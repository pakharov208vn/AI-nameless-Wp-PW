import { db } from '@/server/db'
import { google } from '@ai-sdk/google'
import { Experimental_LanguageModelV1Middleware, generateText, experimental_wrapLanguageModel as wrapLanguageModel } from 'ai'

export const customMiddleware: Experimental_LanguageModelV1Middleware = {}

export const geminiProModel = wrapLanguageModel({
  model: google('gemini-1.5-pro-002'),
  middleware: customMiddleware,
})

export const POST = async (request: Request) => {
  const body = await request.json()
  const { examId, answers, studentId, studentName, question, barem } = body

  const { text } = await generateText({
    model: geminiProModel,
    prompt: `Bạn là giáo viên daỵ Trường Trung Học Phổ Thông. Bạn đang chấm bài của học sinh cho bài thi. Dưới đây là câu hỏi của bạn: ${question}, với barem điểm như sau: ${barem}. Hãy chấm bài, chỉ ra các sai sót (nếu có), hướng dẫn cách học sinh làm bài và cho điểm cho học sinh. Câu trả lời của học sinh là: ${answers}. Bạn hãy cho điểm học sinh theo cú pháp: - SCORE: <điểm>, - EXPLANATION: <giải thích>`,
  })

  console.log(text)

  const score = text
    .split('\n')
    .find((line) => line.startsWith('- SCORE:'))
    ?.split(':')[1]
  const explanation = text
    .split('\n')
    .find((line) => line.startsWith('- EXPLANATION:'))
    ?.split(':')[1]

  console.log(score, explanation)

  const exam = await db.exams.update({
    where: {
      id: examId,
    },
    data: {
      studentAnswers: {
        create: answers.map((answer: string) => ({
          answer,
          score: Number(score?.split('/')[0].trim()) || 0,
          student: {
            connect: {
              id: studentId,
            },
          },
          studentName,
          explanation: explanation || '',
        })),
      },
    },
  })

  return Response.json({ message: 'OK', exam })
}

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url)
  const examId = searchParams.get('examId')

  const exam = await db.exams.findUnique({
    where: {
      id: examId || undefined,
    },
    include: {
      questions: true,
      by: true,
      studentAnswers: true,
    },
  })

  const by = await db.user.findUnique({
    where: {
      id: exam?.byUserId,
    },
  })

  return Response.json({ message: 'OK', exam, by })
}

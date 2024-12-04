import { db } from '@/server/db'

export const POST = async (request: Request) => {
  const body = await request.json()
  const { title, timerMinutes, questions, byUserId } = body

  const exam = await db.exams.create({
    data: {
      title,
      by: {
        connect: {
          id: byUserId,
        },
      },
      timer: timerMinutes * 60,
      questions: {
        create: questions.map((q: { text: string; barem: string }) => ({
          text: q.text,
          barem: q.barem,
        })),
      },
    },
  })

  return Response.json({ message: 'OK', exam })
}

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url)
  const byUserId = searchParams.get('byUserId')

  const exams = await db.exams.findMany({
    where: {
      by: {
        id: byUserId || undefined,
      },
    },
  })

  return Response.json({ message: 'OK', exams })
}

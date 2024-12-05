'use client'

import { Timer } from '@/components/timer'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { useSession } from '@/providers/session-provider'
import { useExamStore } from '@/stores/exam-store'
import { CircleHelp, Clock, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { use, useState } from 'react'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function Page({ params }: { params: { id: string } }) {
  const { id } = use(params)
  const router = useRouter()
  const { data } = useSWR(`/api/exam/student?examId=${id}`, fetcher)

  const { user } = useSession()

  const [answers, setAnswers] = useState<string[]>([])
  const [studentName, setStudentName] = useState('')

  const { isStarted, setIsStarted } = useExamStore()

  const [loading, setLoading] = useState(false)

  const handleStart = () => {
    setIsStarted(true)
  }

  const handleSubmit = async () => {
    setLoading(true)
    await fetch('/api/exam/student', {
      method: 'POST',
      body: JSON.stringify({
        question: data?.exam?.questions[0].text,
        barem: data?.exam?.questions[0].barem,
        examId: id,
        answers,
        studentId: user?.id,
        studentName,
      }),
    })

    setLoading(false)

    router.push('/examination/done')
  }

  const updateAnswer = (index: number, answer: string) => {
    setAnswers((prev) => {
      const newAnswers = [...prev]
      newAnswers[index] = answer
      return newAnswers
    })
  }

  return (
    <main className='w-dvw h-dvh '>
      {!isStarted ? (
        <section className='w-full h-full flex items-center justify-center'>
          <Card className='w-full max-w-xl rounded-2xl'>
            <CardHeader className='space-y-1'>
              <CardTitle className='text-2xl flex flex-col'>
                <span className='text-muted-foreground text-sm font-medium'>Bài thi</span>
                <span>Chủ đề: {data?.exam.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className=''>
              <div className='grid grid-cols-2 gap-2 p-1'>
                <div className='flex flex-col'>
                  <span className='text-sm font-medium text-muted-foreground'>Số câu hỏi</span>
                  <span className='text-2xl font-extrabold flex items-center gap-2'>
                    <CircleHelp className='w-5 h-5 text-muted-foreground' />
                    {data?.exam.questions.length}
                  </span>
                </div>
                <div className='flex flex-col'>
                  <span className='text-sm font-medium text-muted-foreground'>Thời gian làm bài</span>
                  <span className='text-2xl font-extrabold flex items-center gap-2'>
                    <Clock className='w-5 h-5 text-muted-foreground' />
                    {data?.exam.timer / 60} phút
                  </span>
                </div>
              </div>
              <Separator className='mt-4 mb-2' />

              <div className='flex flex-col'>
                <span className='text-sm font-medium text-muted-foreground'>Giáo viên ra đề</span>
                <div className='flex'>
                  <Avatar className={`w-12 h-12 border-4 border-background bg-red-300`}>
                    <AvatarImage src={data?.by.avatar} alt={data?.by.name} />

                    <AvatarFallback className='select-none'>
                      {data?.by.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </CardContent>
            <CardFooter className='flex flex-col gap-2 items-end'>
              <span className='text-sm cursor-pointer font-medium italic underline pr-1 text-muted-foreground'>Báo cáo</span>
              <Button className='w-full font-semibold' size={'lg'} onClick={handleStart}>
                Bắt đầu làm bài
              </Button>
            </CardFooter>
          </Card>
        </section>
      ) : (
        <section className='w-full h-full flex items-center justify-center'>
          <Card className='w-full relative max-w-xl rounded-2xl'>
            <Timer duration={data?.exam.timer} />
            <CardHeader className='space-y-1'>
              <CardTitle className='text-2xl flex flex-col'>
                <span className='text-muted-foreground text-sm font-medium'>Bài thi</span>
                <span>Chủ đề: {data?.exam.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className=''>
              <div className='flex flex-col gap-2'>
                {data?.exam.questions.map((question, index) => (
                  <div className='flex flex-col gap-2' key={index}>
                    <div className='flex flex-col'>
                      <span className='text-sm font-medium text-muted-foreground'>Câu hỏi {index + 1}</span>
                      <span className='text-2xl font-extrabold flex items-center gap-2'>{question.text}</span>
                    </div>

                    <div className='flex flex-col gap-1'>
                      <Label className='text-sm font-medium text-muted-foreground'>Câu trả lời</Label>
                      <Textarea className='text-2xl rounded-xl p-2' onChange={(e) => updateAnswer(index, e.target.value)} />
                    </div>
                  </div>
                ))}
              </div>
              <Separator className='mt-4 mb-2' />

              <div className='flex flex-col gap-2'>
                <Label className='text-sm font-medium text-muted-foreground'>Tên học sinh</Label>
                <Input className='text-2xl rounded-xl p-2' onChange={(e) => setStudentName(e.target.value)} />
              </div>
            </CardContent>
            <CardFooter className='flex flex-col gap-2 items-end'>
              <span className='text-sm cursor-pointer font-medium italic underline pr-1 text-muted-foreground'>Báo cáo</span>
              <Button
                className='w-full font-semibold'
                size={'lg'}
                onClick={handleSubmit}
                disabled={!studentName || answers.length !== data?.exam.questions.length}
              >
                {loading ? <Loader2 className='w-4 h-4 animate-spin' /> : 'Nộp bài'}
              </Button>
            </CardFooter>
          </Card>
        </section>
      )}
    </main>
  )
}

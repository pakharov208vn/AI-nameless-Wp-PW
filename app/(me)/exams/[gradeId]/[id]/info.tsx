'use client'

import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function Info({ id }: { id: string }) {
  const { data } = useSWR(`/api/exam/student?examId=${id}`, fetcher)

  return (
    <div className='min-h-[100vh] flex-1 rounded-xl p-4 bg-muted/50 md:min-h-min'>
      <div className='flex flex-col gap-1'>
        <span className='text-sm text-muted-foreground'>Bài thi</span>
        <span className='text-xl font-semibold'>{data?.exam?.title}</span>
      </div>

      <div className='flex flex-col gap-1 mt-4'>
        <span className='text-sm text-muted-foreground'>Thời gian</span>
        <span className='text-xl font-semibold'>{data?.exam?.timer / 60} phút</span>
      </div>

      <div className='flex flex-col gap-1 mt-4'>
        <span className='text-sm text-muted-foreground'>Câu trả lời ({data?.exam?.studentAnswers.length})</span>
        <div className='flex flex-col gap-4 mt-2'>
          {data?.exam?.studentAnswers.map((question, index) => (
            <div key={index} className='flex flex-col gap-2'>
              <div className='flex flex-col bg-muted/50 p-4 rounded-lg'>
                <span className='text-sm text-muted-foreground'>{question.studentName}</span>
                <span className='text-lg'>{question.answer}</span>

                <span className='text-sm text-muted-foreground'>Giải thích: {question.explanation}</span>
                <span className='text-sm text-muted-foreground'>Điểm: {question.score}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

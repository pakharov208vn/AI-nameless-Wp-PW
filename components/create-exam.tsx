'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useSession } from '@/providers/session-provider'
import { Minus, Plus } from 'lucide-react'
import { ChangeEvent, useState } from 'react'

interface Question {
  id: number
  text: string
  barem: string
}

export default function CreateExam() {
  const [examTitle, setExamTitle] = useState('')
  const [timerMinutes, setTimerMinutes] = useState(20)
  const [questions, setQuestions] = useState<Question[]>([{ id: 1, text: '', barem: '' }])

  const { user } = useSession()

  const addQuestion = () => {
    const newId = questions.length > 0 ? Math.max(...questions.map((q) => q.id)) + 1 : 1
    setQuestions([...questions, { id: newId, text: '', barem: '' }])
  }

  const removeQuestion = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  const updateQuestion = (id: number, text: string) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, text } : q)))
  }

  const updateBarem = (id: number, barem: string) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, barem } : q)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    await fetch('/api/exam', {
      method: 'POST',
      body: JSON.stringify({ title: examTitle, timerMinutes, questions, byUserId: user?.id }),
    })
  }

  return (
    <div className='container mx-auto p-4'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <Label htmlFor='examTitle'>Tiêu đề bài thi</Label>
          <Input id='examTitle' value={examTitle} onChange={(e) => setExamTitle(e.target.value)} placeholder='Nhập tiêu đề bài thi' required />
        </div>
        <div>
          <Label htmlFor='timerMinutes'>Thời gian làm bài (phút)</Label>
          <Input id='timerMinutes' type='number' value={timerMinutes} onChange={(e) => setTimerMinutes(parseInt(e.target.value))} min={1} required />
        </div>
        <div className='space-y-2 flex flex-col gap-2'>
          <Label>Câu hỏi</Label>
          {questions.map((question, index) => (
            <div key={question.id} className='flex items-start space-x-2'>
              <Textarea
                value={question.text}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => updateQuestion(question.id, e.target.value)}
                placeholder={`Nhập câu hỏi ${index + 1}`}
                required
              />

              <Textarea
                value={question.barem}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => updateBarem(question.id, e.target.value)}
                placeholder={`Barem câu hỏi ${index + 1}`}
                required
              />
              <Button type='button' variant='outline' size='icon' onClick={() => removeQuestion(question.id)} disabled={questions.length === 1}>
                <Minus className='h-4 w-4' />
              </Button>
            </div>
          ))}
          <Button type='button' onClick={addQuestion} className='mt-8 flex items-center w-fit'>
            <Plus className='h-4 w-4 mr-1' /> Thêm câu hỏi
          </Button>
        </div>

        <Button type='submit'>Tạo bài thi</Button>
      </form>
    </div>
  )
}

'use client'

import { Exam } from '@/components/exam'
import { SidebarExam } from '@/components/sidebar-exam'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { CircleHelp, Clock } from 'lucide-react'
import { useState } from 'react'

const users = [
  { id: '1', name: 'Nguyễn Sơn Hà', sex: 'male', avatar: '/placeholder.svg?height=32&width=32' },
  { id: '2', name: 'Nguyễn Sơn Hà', sex: 'male', avatar: '/placeholder.svg?height=32&width=32' },
  { id: '3', name: 'Nguyễn Sơn Hà', sex: 'female', avatar: '/placeholder.svg?height=32&width=32' },
]

export default function Page() {
  const displayUsers = users.slice(0, 3)

  const [isStarted, setIsStarted] = useState(true)

  const handleStart = () => {
    setIsStarted(true)
  }

  return (
    <main className='w-dvw h-dvh '>
      {!isStarted ? (
        <section className='w-full h-full flex items-center justify-center'>
          <Card className='w-full max-w-xl rounded-2xl'>
            <CardHeader className='space-y-1'>
              <CardTitle className='text-2xl flex flex-col'>
                <span className='text-muted-foreground text-sm font-medium'>Bài thi ngoại khoá</span>
                <span>Chủ đề: Áp dụng Toán học và các lý thuyết liên quan trong đời sống</span>
              </CardTitle>

              <CardDescription className='flex flex-col gap-2'>
                Trong bài kiếm tra ngắn này, các bạn sẽ quan sát và phân tích các hành động, sự vật ở xung quanh mình, suy nghĩ và tham chiếu các lý
                thuyết đã học để trả lời các câu hỏi.
              </CardDescription>
            </CardHeader>
            <CardContent className=''>
              <div className='grid grid-cols-2 gap-2 p-1'>
                <div className='flex flex-col'>
                  <span className='text-sm font-medium text-muted-foreground'>Số câu hỏi</span>
                  <span className='text-2xl font-extrabold flex items-center gap-2'>
                    <CircleHelp className='w-5 h-5 text-muted-foreground' />5
                  </span>
                </div>
                <div className='flex flex-col'>
                  <span className='text-sm font-medium text-muted-foreground'>Thời gian làm bài</span>
                  <span className='text-2xl font-extrabold flex items-center gap-2'>
                    <Clock className='w-5 h-5 text-muted-foreground' />
                    15 phút
                  </span>
                </div>
              </div>
              <Separator className='mt-4 mb-2' />

              <div className='flex flex-col'>
                <span className='text-sm font-medium text-muted-foreground'>Giáo viên ra đề</span>
                <div className='flex'>
                  {displayUsers.map((user, index) => (
                    <Avatar key={user.id} className={`w-12 h-12 border-4 border-background bg-red-300 ${index !== 0 ? '-ml-3' : ''}`}>
                      <AvatarImage src={user.avatar} alt={user.name} />

                      <AvatarFallback className='select-none'>
                        {user.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <div className='flex flex-col bg-muted rounded-lg p-4 mt-2'>
                  <div className='grid grid-cols-[min-content_1fr] gap-2'>
                    <Avatar className={'w-12 h-12'}>
                      <AvatarImage src={'/placeholder.svg?height=32&width=32'} alt={'T'} />
                      <AvatarFallback className='select-none'>T</AvatarFallback>
                    </Avatar>
                    <div>
                      <span className='text-sm font-bold flex items-center gap-2 mt-1'>Thầy Tâm</span>
                      <p className='text-sm text-muted-foreground leading-0 italic'>
                        Thầy chúc các bạn làm bài tốt! Đây là bài thi ngoại khoá đầu tiên trong học kỳ này, sẽ là bước đệm để các bạn chịu khó quan
                        sát các hiện tượng xung quanh.
                      </p>
                    </div>
                  </div>
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
        <SidebarProvider>
          <SidebarInset>
            <Exam />
          </SidebarInset>
          <SidebarExam />
        </SidebarProvider>
      )}
    </main>
  )
}

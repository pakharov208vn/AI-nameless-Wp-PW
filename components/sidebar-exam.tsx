'use client'

import * as React from 'react'

import { NavUser } from '@/components/nav-user'
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenuButton } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { useExamStore } from '@/stores/exam-store'
import { useState } from 'react'
import { Button } from './ui/button'

export function SidebarExam({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const exam = {
    title: 'Bài thi ngoại khoá',
    topic: 'Chủ đề: Áp dụng Toán học và các lý thuyết liên quan trong đời sống',
    time: '120 phút',
    questions: [
      {
        id: 1,
        title: 'Câu hỏi 1',
        content:
          'Nếu bạn có 1.500.000 đồng để chi tiêu trong một tháng, và bạn muốn phân bổ số tiền này cho các khoản như ăn uống, đi lại và giải trí với tỷ lệ 50%, 30%, và 20%. Bạn sẽ chi tiêu bao nhiêu cho mỗi khoản?',
      },
      {
        id: 2,
        title: 'Câu hỏi 2',
        content:
          'Nếu bạn gửi 10.000.000 đồng vào ngân hàng với lãi suất hàng năm là 5%, sau một năm bạn sẽ nhận được số tiền tổng cộng là bao nhiêu?',
      },
      {
        id: 3,
        title: 'Câu hỏi 3',
        content: 'Một chiếc bàn có hình tròn với bán kính là 0.75 mét. Hãy tính diện tích của mặt bàn. (Sử dụng công thức: A = πr²)',
      },
      {
        id: 4,
        title: 'Câu hỏi 4',
        content:
          'Trong một lớp học có 30 học sinh, 18 học sinh đạt điểm trung bình trên 7.0. Tính tỷ lệ phần trăm học sinh đạt điểm trung bình trên 7.0 trong lớp.',
      },
      {
        id: 5,
        title: 'Câu hỏi 5',
        content: 'Bạn đi xe máy với tốc độ 40 km/h và bạn có kế hoạch đi đến một thành phố cách đó 120 km. Hỏi bạn sẽ mất bao lâu để đến nơi?',
      },
    ],
  }

  const [selectedQuestion, setSelectedQuestion] = useState<number>(exam.questions[0].id)
  const { isStarted, setIsStarted } = useExamStore()

  return (
    <Sidebar variant='inset' collapsible='none' className='bg-sidebar-background h-dvh w-[350px] py-2 pr-2 ' {...props}>
      <SidebarHeader>
        <div className='flex flex-col p-2'>
          <span className='text-sm text-muted-foreground'>Bài thi ngoại khoá</span>
          <span className='text-xl font-bold'>Chủ đề: Áp dụng Toán học và các lý thuyết liên quan trong đời sống</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {!isStarted ? (
          <SidebarGroup>
            <SidebarGroupContent>
              <div className='flex flex-col gap-2 bg-yellow-400/10 rounded-xl p-3 px-3.5'>
                <ul className='text-sm text-muted-foreground'>
                  <li>
                    - Bạn có <strong className='text-primary'>15 phút</strong> để hoàn thành bài thi.
                  </li>
                  <li>
                    - Bạn có thể trả lời các câu hỏi <strong className='text-primary'>không theo thứ tự</strong>.
                  </li>
                  <li>
                    - Khi trả lời xong một câu hỏi, hãy <strong className='text-primary'>bấm hoàn thành</strong> để đánh dấu bạn đã trả lời xong.
                  </li>
                  <li>
                    - Mỗi câu hỏi <strong className='text-primary'>không giới hạn số lần trả lời lại</strong>.
                  </li>
                </ul>
              </div>
              <Button className='font-semibold w-full mt-5' size='lg' onClick={() => setIsStarted(true)}>
                Bắt đầu
              </Button>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : (
          <SidebarGroup>
            <SidebarGroupContent>
              {exam.questions.map((question) => (
                <SidebarMenuButton
                  asChild
                  key={question.id}
                  className={cn(
                    'grid w-full h-fit cursor-pointer p-3 pr-4 pb-4 mt-1 rounded-xl',
                    selectedQuestion === question.id && 'bg-primary/10',
                  )}
                  tooltip={question.title}
                  onClick={() => setSelectedQuestion(question.id)}
                >
                  <div className='flex flex-col leading-tight p-1'>
                    <span className='text-sm text-muted-foreground'>{question.title}</span>
                    <p className='text-primary -mt-1'>{question.content}</p>
                  </div>
                </SidebarMenuButton>
              ))}
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}

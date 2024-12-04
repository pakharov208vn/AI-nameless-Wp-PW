'use client'

import Link from 'next/link'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { useSession } from '@/providers/session-provider'
import { ChevronRight, Plus, SquareTerminal } from 'lucide-react'
import { useState } from 'react'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function NavExams() {
  const { user } = useSession()

  const { data } = useSWR('/api/exam?byUserId=' + user?.id, fetcher)

  const [exams] = useState<any[]>([
    {
      title: 'Khối 10',
      url: '/exams/10',
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: 'Bài thi 15 phút',
          url: '/exams/10/15min',
        },
        {
          title: 'Bài thi giữa kỳ Đề 1',
          url: '/exams/10/midterm-1',
        },
      ],
    },
  ])

  if (data?.exams) {
    exams[0].items = [
      ...exams[0].items,
      ...data.exams.map((exam: any) => ({
        title: exam.title,
        url: `/exams/10/${exam.id}`,
      })),
    ]
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Bài thi</SidebarGroupLabel>
      <SidebarMenu>
        {exams.map((item) => (
          <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={item.title}>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
              {item.items?.length ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction className='data-[state=open]:rotate-90'>
                      <ChevronRight />
                      <span className='sr-only'>Toggle</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem: any) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <a href={subItem.url}>
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
        ))}

        <SidebarMenuItem>
          <Link href='/exams/new'>
            <SidebarMenuButton className='text-sidebar-foreground/70 border' tooltip='Tạo bài thi'>
              <Plus />
              <span>Tạo bài thi</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}

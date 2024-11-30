'use client'

import { Book } from 'lucide-react'

import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'

export function NavTools() {
  const classes = [
    {
      name: 'Tạo đề thi',
      url: '/exams/create',
      icon: Book,
    },
  ]

  return (
    <SidebarGroup className=''>
      <SidebarGroupLabel className='flex items-center justify-between'>Công cụ</SidebarGroupLabel>
      <SidebarMenu>
        {classes.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild tooltip={item.name}>
              <a href={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

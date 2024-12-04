'use client'

import { Image, Pencil, Video } from 'lucide-react'

import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'

export function NavTools() {
  const classes = [
    {
      name: 'Tạo Ảnh minh hoạ',
      url: '#',
      icon: Image,
    },
    {
      name: 'Tạo Ví dụ tham khảo',
      url: '#',
      icon: Pencil,
    },
    {
      name: 'Tạo Video tóm tắt',
      url: '#',
      icon: Video,
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

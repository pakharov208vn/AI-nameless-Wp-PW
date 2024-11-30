'use client'

import { Book } from 'lucide-react'

import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'

export function NavTools() {
  const classes = [
    {
      name: 'Lớp 10A1',
      url: '/classes/10a1',
      icon: Book,
    },
    {
      name: 'Lớp 10A2',
      url: '/classes/10a2',
      icon: Book,
    },
    {
      name: 'Lớp 10A3',
      url: '/classes/10a3',
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

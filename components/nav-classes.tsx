'use client'

import { Book, ChevronRight, Plus } from 'lucide-react'

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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible'

export function NavClasses() {
  const classes = [
    {
      title: 'Lớp 10A1',
      url: '/classes/10a1',
      icon: Book,
      isActive: true,
      items: [
        {
          title: 'Danh sách học sinh',
          url: '#',
        },
        {
          title: 'Đề thi',
          url: '#',
        },
        {
          title: 'Thông báo',
          url: '#',
        },
      ],
    },
  ]

  return (
    <SidebarGroup className=''>
      <SidebarGroupLabel className='flex items-center justify-between'>Lớp học</SidebarGroupLabel>
      <SidebarMenu>
        {classes.map((item) => (
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
                      {item.items?.map((subItem) => (
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
          <SidebarMenuButton className='text-sidebar-foreground/70 border' tooltip='Thêm lớp học'>
            <Plus />
            <span>Thêm lớp học</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}

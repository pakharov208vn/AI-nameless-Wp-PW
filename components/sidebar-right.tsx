'use client'

import * as React from 'react'

import { NavUser } from '@/components/nav-user'
import { Sidebar, SidebarContent, SidebarHeader, SidebarSeparator } from '@/components/ui/sidebar'
import { DatePicker } from './date-picker'

export function SidebarRight({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='none' className='sticky hidden w-fit lg:flex top-0 h-svh border-l' {...props}>
      <SidebarHeader className='h-16 border-b border-sidebar-border'>
        <NavUser />
      </SidebarHeader>
      <SidebarContent>
        <DatePicker />
        <SidebarSeparator className='mx-0' />
      </SidebarContent>
    </Sidebar>
  )
}

'use client'

import * as React from 'react'

import { NavMain } from '@/components/nav-main'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { HelpCircle } from 'lucide-react'
import { NavClasses } from './nav-classes'
import { NavExams } from './nav-exams'
import { NavTools } from './nav-tools'
import { SchoolSwitcher } from './school-switcher'

export function SidebarLeft({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <SchoolSwitcher />
        <NavMain />
        <SidebarSeparator />
      </SidebarHeader>
      <SidebarContent>
        <NavClasses />

        <NavExams />
        <NavTools />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <HelpCircle />
              <span>Trợ giúp</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

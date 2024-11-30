'use client'

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { Activity, ChartBar, Home } from 'lucide-react'
import Link from 'next/link'

export function NavMain() {
  const items = [
    {
      title: 'Trang chủ',
      url: '/dashboard',
      icon: Home,
    },
    {
      title: 'Thống kê',
      url: '/statistics',
      icon: ChartBar,
    },
    {
      title: 'Hoạt động',
      url: '/activities',
      icon: Activity,
    },
  ]

  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <Link href={item.url}>
            <SidebarMenuButton tooltip={item.title}>
              {item.icon && <item.icon />}
              <span>{item.title}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}

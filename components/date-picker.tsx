import { Calendar } from '@/components/ui/calendar'
import { SidebarGroup, SidebarGroupContent } from '@/components/ui/sidebar'
import { vi } from 'date-fns/locale'

export function DatePicker() {
  return (
    <SidebarGroup className='px-0'>
      <SidebarGroupContent>
        <Calendar
          locale={vi}
          className='[&_[role=gridcell].bg-accent]:bg-sidebar-primary [&_[role=gridcell].bg-accent]:text-sidebar-primary-foreground [&_[role=gridcell]]:w-[33px] select-none'
        />
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

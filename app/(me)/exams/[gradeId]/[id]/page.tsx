import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import Info from './info'
import Inside from './inside'

export default async function Page({ params }: { params: { id: string; gradeId: string } }) {
  const { id, gradeId } = await params

  return (
    <>
      <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
        <div className='flex items-center gap-2 px-4'>
          <SidebarTrigger className='-ml-1' />
          <Separator orientation='vertical' className='mr-2 h-4' />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className='hidden md:block'>
                <BreadcrumbLink href='#'>Bài thi Khối {gradeId}</BreadcrumbLink>
              </BreadcrumbItem>

              <Inside id={id} />
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
        <Info id={id} />
      </div>
    </>
  )
}

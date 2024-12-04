'use client'

import { BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { useSession } from '@/providers/session-provider'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function Inside({ id }: { id: string }) {
  const { user } = useSession()

  const { data, isLoading } = useSWR('/api/exam?byUserId=' + user?.id, fetcher)

  if (isLoading) return null

  const exam = data?.exams.find((exam: any) => exam.id === id)

  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem className='hidden md:block'>
        <BreadcrumbLink href='#'>{exam?.title}</BreadcrumbLink>
      </BreadcrumbItem>
    </>
  )
}

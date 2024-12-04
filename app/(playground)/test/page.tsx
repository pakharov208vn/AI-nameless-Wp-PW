'use client'

import { Button } from '@/components/ui/button'
// import useSWR from 'swr'

// const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function TestPage() {
  // const { data, isLoading, error } = useSWR('/api/chat', fetcher)

  // console.log(data)

  const handleFetch = async () => {
    const res = await fetch('/api/chat', {
      method: 'POST',
    })
    const data = await res.json()
    console.log(data)
  }

  return (
    <div>
      <Button onClick={handleFetch}>Fetch</Button>
    </div>
  )
}

import { cn } from '@/lib/utils'
import { useExamStore } from '@/stores/exam-store'
import { Clock } from 'lucide-react'
import { ComponentProps, useEffect, useState } from 'react'

type TimerProps = {
  duration?: number
} & ComponentProps<'aside'>

export function Timer({ duration = 15 * 60, className, ...props }: TimerProps) {
  const { isStarted } = useExamStore()
  const [countdown, setCountdown] = useState(duration)

  useEffect(() => {
    if (!isStarted) return

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 0) return 0
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isStarted])

  const minutes = Math.floor(countdown / 60)
  const seconds = countdown % 60
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

  return (
    <aside className={cn('absolute text-sm top-3 right-3 bg-primary/20 rounded-xl px-2.5 p-2 flex items-center gap-2', className)} {...props}>
      <Clock className='w-4 h-4' />
      <span className='text-primary font-semibold leading-none mt-0.5'>{timeString}</span>
    </aside>
  )
}

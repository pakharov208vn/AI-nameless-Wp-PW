import { Hero } from '@/components/hero'
import { Button } from '@/components/ui/button'
import { validateRequest } from '@/server/auth/lucia'
import { redirect } from 'next/navigation'

export default async function Page() {
  const { user } = await validateRequest()

  if (user) {
    return redirect('/dashboard')
  }

  return (
    <main className='flex flex-col gap-10 items-center justify-center overflow-hidden h-screen'>
      <Hero />

      <form action='/api/auth/google'>
        <Button>Sign In</Button>
      </form>
    </main>
  )
}

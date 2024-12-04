import { lucia } from '@/server/auth/lucia'

import { validateRequest } from '@/server/auth/lucia'
import { cookies } from 'next/headers'

export const signOut = async () => {
  try {
    const { session } = await validateRequest()

    if (!session) {
      return {
        error: 'Unauthorized',
      }
    }

    await lucia.invalidateSession(session.id)

    const sessionCookie = lucia.createBlankSessionCookie()

    const cookieStore = await cookies()
    cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
  } catch (error: unknown) {
    return {
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    }
  }
}

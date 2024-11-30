import { google, lucia } from '@/server/auth/lucia'
import { db } from '@/server/db'
import { OAuth2RequestError } from 'arctic'
import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export const GET = async (req: NextRequest) => {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')

  const cookie = await cookies()
  const codeVerifier = cookie.get('google_code_verifier')?.value ?? null
  const storedState = cookie.get('google_oauth_state')?.value ?? null

  if (!code || !state || !codeVerifier || state !== storedState) return NextResponse.json({ message: 'Invalid state' }, { status: 400 })

  try {
    const tokens = await google.validateAuthorizationCode(code, codeVerifier)
    const googleUserRes = await fetch('https://www.googleapis.com/oauth2/v1/userinfo', {
      // @ts-expect-error - TODO: fix this
      headers: { Authorization: `Bearer ${tokens.data.access_token}` },
    })

    const userData = (await googleUserRes.json()) as GoogleUser

    console.log('userData', userData)

    const user = {
      email: userData.email,
      name: userData.name,
      avatar: userData.picture,
    }

    const existedUser = await db.user.findFirst({
      where: { OR: [{ email: userData.email }] },
    })
    if (existedUser) {
      await db.user.update({ where: { id: existedUser.id }, data: user })

      const session = await lucia.createSession(existedUser.id, {})
      const sessionCookie = lucia.createSessionCookie(session.id)
      cookie.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)

      return NextResponse.redirect(new URL('/', req.url))
    }

    const newUser = await db.user.create({
      data: user,
    })

    const session = await lucia.createSession(newUser.id, {})
    const sessionCookie = lucia.createSessionCookie(session.id)
    cookie.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)

    return NextResponse.redirect(new URL('/', req.url))
  } catch (e) {
    if (e instanceof OAuth2RequestError) return NextResponse.json({ message: e.message, description: e.description }, { status: 400 })
    if (e instanceof Error) return NextResponse.json({ message: e.message }, { status: 500 })
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 })
  }
}

interface GoogleUser {
  sub: string
  name: string
  given_name: string
  family_name: string
  picture: string
  email: string
  email_verified: boolean
}

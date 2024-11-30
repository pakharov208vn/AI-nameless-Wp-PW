import { env } from '@/env'
import { google } from '@/server/auth/lucia'
import { generateCodeVerifier, generateState } from 'arctic'
import { cookies } from 'next/headers'

export const GET = async (req: Request) => {
  const state = generateState()
  const codeVerifier = generateCodeVerifier()
  const scopes = ['openid', 'profile', 'email']
  const url = google.createAuthorizationURL(state, codeVerifier, scopes)

  const cookie = await cookies()
  cookie.set('google_oauth_state', state, {
    path: '/',
    secure: env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: 'lax',
  })
  cookie.set('google_code_verifier', codeVerifier, {
    path: '/',
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    maxAge: 60 * 10,
    sameSite: 'lax',
  })

  return Response.redirect(new URL(url, req.url))
}

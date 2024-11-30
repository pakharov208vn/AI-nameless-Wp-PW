import { ThemeProvider } from '@/components/theme-provider'
import { SessionProvider } from '@/providers/session-provider'
import { validateRequest } from '@/server/auth/lucia'
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: {
    template: '%s | Examini',
    default: 'Examini',
  },
  description: 'Hệ thống quản lý đề thi và đánh giá học sinh',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const sessionData = await validateRequest()

  return (
    <html lang='en'>
      <body className={`${geistSans.variable} antialiased`}>
        <ThemeProvider attribute='class' defaultTheme='dark' enableSystem disableTransitionOnChange>
          <SessionProvider value={sessionData}>{children}</SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

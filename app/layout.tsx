import './globals.css'
import type { Metadata } from 'next'
import { Quicksand } from 'next/font/google'

const quicksand = Quicksand({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-quicksand',
})

export const metadata: Metadata = {
  title: 'Josh Cabradilla | Front End Portfolio',
  description: 'Portfolio website for Josh Cabradilla, showcasing modern web projects, profile details, and social connections.',
  metadataBase: new URL('https://yourdomain.example'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/x-icon" href="/assets/r.ico" />
      </head>
      <body className={`${quicksand.variable} font-sans`}>{children}</body>
    </html>
  )
}


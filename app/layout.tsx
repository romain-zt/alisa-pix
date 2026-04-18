import type { Metadata, Viewport } from 'next'
import { Inter, Cormorant_Garamond } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500'],
  variable: '--font-cormorant',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Vasilisa — Boudoir Photography',
  description:
    'Paris boudoir — at ease in the room, light on your best self, honest retouch when it serves you.',
  metadataBase: new URL('https://vasilisa.com'),
  openGraph: {
    title: 'Vasilisa — Boudoir Photography',
    description: 'At ease — the best light on who you already are.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0908',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="grain">
        {children}
      </body>
    </html>
  )
}

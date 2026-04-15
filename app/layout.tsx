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
  description: 'A bright trace of your personality. Luxury boudoir photography in Paris.',
  metadataBase: new URL('https://vasilisa.com'),
  openGraph: {
    title: 'Vasilisa — Boudoir Photography',
    description: 'A bright trace of your personality',
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

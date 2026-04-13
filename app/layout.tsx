import type { Metadata, Viewport } from 'next'
import './globals.css'
import ClientProviders from './providers'

export const metadata: Metadata = {
  title: 'VASILISA — Private Luxury Photography',
  description: 'A private luxury photography experience. Confidential. Selective. By invitation.',
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0B0B0B',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-black text-off-white antialiased cinema-root">
        {/* Cinematic depth layers */}
        <div className="cinema-hole" aria-hidden="true" />
        <div className="cinema-lens" aria-hidden="true" />
        <div className="cinema-leak" aria-hidden="true" />

        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  )
}

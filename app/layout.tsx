import type { Metadata, Viewport } from 'next'
import './globals.css'
import ClientProviders from './providers'

export const metadata: Metadata = {
  title: 'VASILISA',
  description: 'A private luxury photography experience.',
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
      <body className="bg-black text-off-white antialiased">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  )
}

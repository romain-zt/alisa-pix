'use client'

import { ReactNode } from 'react'
import LenisProvider from '@/components/LenisProvider'
import { I18nProvider } from '@/lib/i18n/context'
import Navigation from '@/components/Navigation'
import GrainOverlay from '@/components/GrainOverlay'
import Footer from '@/components/Footer'

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <LenisProvider>
        <GrainOverlay />
        <Navigation />
        <div className="relative z-10">
          {children}
        </div>
        <Footer />
      </LenisProvider>
    </I18nProvider>
  )
}

'use client'

import { ReactNode } from 'react'
import LenisProvider from '@/components/LenisProvider'
import { I18nProvider } from '@/lib/i18n/context'
import Navigation from '@/components/Navigation'

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <LenisProvider>
        <Navigation />
        {children}
      </LenisProvider>
    </I18nProvider>
  )
}

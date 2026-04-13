'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import en from './en.json'
import ru from './ru.json'

type Locale = 'en' | 'ru'
type Translations = typeof en

const translations: Record<Locale, Translations> = { en, ru }

interface I18nContextValue {
  locale: Locale
  t: Translations
  toggle: () => void
}

const I18nContext = createContext<I18nContextValue>({
  locale: 'en',
  t: en,
  toggle: () => {},
})

function detectLocale(): Locale {
  if (typeof navigator === 'undefined') return 'en'
  const lang = navigator.language.toLowerCase()
  if (lang.startsWith('ru')) return 'ru'
  return 'en'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(detectLocale)

  const toggle = useCallback(() => {
    setLocale((prev) => (prev === 'en' ? 'ru' : 'en'))
  }, [])

  return (
    <I18nContext.Provider value={{ locale, t: translations[locale], toggle }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}

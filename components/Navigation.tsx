'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useI18n } from '@/lib/i18n/context'

export default function Navigation() {
  const { locale, t, toggle } = useI18n()

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 md:px-12 md:py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, delay: 0.5 }}
      style={{
        background: 'linear-gradient(to bottom, rgba(11,11,11,0.6) 0%, transparent 100%)',
      }}
    >
      <Link
        href="/"
        className="font-serif text-lg md:text-xl tracking-[0.2em] text-off-white/90 hover:text-off-white transition-colors duration-700"
      >
        VASILISA
      </Link>

      <div className="flex items-center gap-6 md:gap-10">
        <Link
          href="/experience"
          className="font-sans text-[11px] md:text-xs tracking-[0.15em] uppercase text-off-white/60 hover:text-off-white transition-colors duration-700"
        >
          {t.nav.experience}
        </Link>
        <Link
          href="/contact"
          className="font-sans text-[11px] md:text-xs tracking-[0.15em] uppercase text-off-white/60 hover:text-off-white transition-colors duration-700"
        >
          {t.nav.contact}
        </Link>
        <button
          onClick={toggle}
          className="font-sans text-[11px] md:text-xs tracking-[0.15em] uppercase text-gold/60 hover:text-gold transition-colors duration-700 cursor-pointer"
        >
          {locale === 'en' ? 'RU' : 'EN'}
        </button>
      </div>
    </motion.nav>
  )
}

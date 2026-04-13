'use client'

import { motion } from 'framer-motion'
import { useI18n } from '@/lib/i18n/context'
import SoftReveal from '@/components/SoftReveal'

export default function ContactPage() {
  const { t } = useI18n()

  return (
    <main className="min-h-[100dvh] flex flex-col items-center justify-center px-6">
      <motion.div
        className="text-center max-w-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.3 }}
      >
        <motion.h1
          className="font-serif text-3xl sm:text-4xl md:text-5xl font-light italic tracking-wide text-off-white/90 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {t.contact.headline}
        </motion.h1>

        <motion.p
          className="font-sans text-sm tracking-[0.12em] text-off-white/40 mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.2 }}
        >
          {t.contact.subline}
        </motion.p>

        <SoftReveal className="space-y-8">
          <div>
            <a
              href={`mailto:${t.contact.email}`}
              className="font-sans text-xs md:text-sm tracking-[0.2em] uppercase text-gold/60 hover:text-gold transition-colors duration-1000"
            >
              {t.contact.email}
            </a>
          </div>

          <div>
            <a
              href="https://t.me/vasilisa_photo"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-xs md:text-sm tracking-[0.2em] uppercase text-off-white/40 hover:text-off-white/70 transition-colors duration-1000"
            >
              Telegram
            </a>
          </div>

          <div>
            <a
              href="https://www.instagram.com/ph_vasilisa"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-xs md:text-sm tracking-[0.2em] uppercase text-off-white/40 hover:text-off-white/70 transition-colors duration-1000"
            >
              Instagram
            </a>
          </div>
        </SoftReveal>
      </motion.div>

      <motion.div
        className="absolute bottom-8 font-sans text-[10px] tracking-[0.15em] text-off-white/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
      >
        {t.footer.copy}
      </motion.div>
    </main>
  )
}

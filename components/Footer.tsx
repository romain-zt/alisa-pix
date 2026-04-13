'use client'

import { motion } from 'framer-motion'
import { useI18n } from '@/lib/i18n/context'

export default function Footer() {
  const { t } = useI18n()

  return (
    <footer className="relative px-6 md:px-12 pb-8 pt-24">
      {/* Gold divider */}
      <motion.div
        className="gold-line w-full mb-12"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 2.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        viewport={{ once: true }}
      />

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-10">
        {/* Brand */}
        <div>
          <span className="font-serif text-lg tracking-[0.2em] text-off-white/70">
            VASILISA
          </span>
          <p className="label-micro text-off-white/25 mt-2">
            {t.footer.tagline}
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col items-start md:items-end gap-3">
          <a
            href={`mailto:${t.contact.email}`}
            className="label-small text-gold/50 hover:text-gold transition-colors duration-1000"
          >
            {t.contact.email}
          </a>
          <div className="flex gap-6">
            <a
              href="https://t.me/vasilisa_photo"
              target="_blank"
              rel="noopener noreferrer"
              className="label-micro text-off-white/25 hover:text-off-white/50 transition-colors duration-1000"
            >
              Telegram
            </a>
            <a
              href="https://www.instagram.com/ph_vasilisa"
              target="_blank"
              rel="noopener noreferrer"
              className="label-micro text-off-white/25 hover:text-off-white/50 transition-colors duration-1000"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-6xl mx-auto mt-12 flex flex-col md:flex-row md:justify-between gap-2">
        <span className="label-micro text-off-white/15">
          {t.footer.copy}
        </span>
        <span className="label-micro text-off-white/15">
          {t.footer.confidential}
        </span>
      </div>
    </footer>
  )
}

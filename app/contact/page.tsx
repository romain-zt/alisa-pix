'use client'

import { useState, FormEvent } from 'react'
import { motion } from 'framer-motion'
import { useI18n } from '@/lib/i18n/context'
import SoftReveal from '@/components/SoftReveal'

export default function ContactPage() {
  const { t } = useI18n()
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const name = data.get('name') as string
    const email = data.get('email') as string
    const message = data.get('message') as string

    const mailto = `mailto:${t.contact.email}?subject=Inquiry from ${encodeURIComponent(name)}&body=${encodeURIComponent(`From: ${name}\nEmail: ${email}\n\n${message}`)}`
    window.location.href = mailto
    setSubmitted(true)
  }

  return (
    <main className="min-h-[100dvh] flex flex-col items-center justify-center px-6 py-32">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.3 }}
      >
        {/* Header */}
        <motion.h1
          className="font-serif text-3xl sm:text-4xl md:text-5xl font-light italic tracking-wide text-off-white/90 text-center mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {t.contact.headline}
        </motion.h1>

        <motion.p
          className="label-micro text-center text-off-white/30 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1 }}
        >
          {t.contact.subline}
        </motion.p>

        {/* Form */}
        {!submitted ? (
          <motion.form
            onSubmit={handleSubmit}
            className="flex flex-col gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 1.2 }}
          >
            <div>
              <label htmlFor="name" className="label-micro text-off-white/25 block mb-3">
                {t.contact.form_name}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full bg-transparent border-b border-off-white/10 focus:border-gold/30 text-off-white/80 font-sans text-sm font-light py-3 outline-none transition-colors duration-700 placeholder:text-off-white/15"
              />
            </div>

            <div>
              <label htmlFor="email" className="label-micro text-off-white/25 block mb-3">
                {t.contact.form_email}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full bg-transparent border-b border-off-white/10 focus:border-gold/30 text-off-white/80 font-sans text-sm font-light py-3 outline-none transition-colors duration-700 placeholder:text-off-white/15"
              />
            </div>

            <div>
              <label htmlFor="message" className="label-micro text-off-white/25 block mb-3">
                {t.contact.form_message}
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="w-full bg-transparent border-b border-off-white/10 focus:border-gold/30 text-off-white/80 font-sans text-sm font-light py-3 outline-none transition-colors duration-700 resize-none placeholder:text-off-white/15"
              />
            </div>

            <motion.p
              className="label-micro text-off-white/20 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              {t.contact.reassurance}
            </motion.p>

            <button
              type="submit"
              className="mt-4 font-sans text-xs tracking-[0.25em] uppercase text-gold/60 hover:text-gold border border-gold/20 hover:border-gold/40 px-8 py-4 transition-all duration-1000 cursor-pointer self-center"
            >
              {t.contact.form_submit}
            </button>
          </motion.form>
        ) : (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
          >
            <p className="font-serif text-xl italic text-off-white/60">
              Thank you. We&apos;ll be in touch.
            </p>
          </motion.div>
        )}

        {/* Direct links */}
        <motion.div
          className="mt-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 1.8 }}
        >
          <p className="label-micro text-off-white/20 text-center mb-6">
            {t.contact.or_reach}
          </p>

          <SoftReveal className="flex flex-col items-center gap-5">
            <a
              href={`mailto:${t.contact.email}`}
              className="label-small text-gold/50 hover:text-gold transition-colors duration-1000"
            >
              {t.contact.email}
            </a>
            <div className="flex gap-8">
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
          </SoftReveal>
        </motion.div>
      </motion.div>
    </main>
  )
}

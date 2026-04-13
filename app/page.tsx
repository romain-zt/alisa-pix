'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n/context'
import CinematicSequence from '@/components/CinematicSequence'
import { heroImages, scrollImages } from '@/lib/images'

function EnterSection() {
  const { t } = useI18n()

  return (
    <section className="h-[60vh] flex flex-col items-center justify-center px-6">
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 3, ease: [0.25, 0.46, 0.45, 0.94] }}
        viewport={{ once: true, margin: '-10%' }}
      >
        <Link href="/experience" className="group inline-block">
          <motion.span
            className="font-serif text-xl md:text-2xl tracking-[0.3em] uppercase text-gold/60 group-hover:text-gold transition-colors duration-[2000ms] block"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 2.4,
              delay: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            viewport={{ once: true }}
          >
            {t.home.enter}
          </motion.span>
          <motion.div
            className="mt-6 mx-auto w-10 h-px bg-gold/20 group-hover:w-20 group-hover:bg-gold/50 transition-all duration-[2000ms]"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 2, delay: 0.8 }}
            viewport={{ once: true }}
          />
        </Link>
      </motion.div>
    </section>
  )
}

export default function HomePage() {
  const { t } = useI18n()

  const scenes = [
    { src: heroImages[0], text: t.home.hero },
    { src: scrollImages[0], text: t.home.s1 },
    { src: heroImages[1] },
    { src: scrollImages[1], text: t.home.s2 },
    { src: heroImages[2] },
    { src: scrollImages[2], text: t.home.s3 },
    { src: scrollImages[3], text: t.home.s4 },
  ]

  return (
    <main className="relative">
      <CinematicSequence scenes={scenes} />

      <div className="h-[15vh]" aria-hidden />

      <EnterSection />

      <div className="h-[15vh]" aria-hidden />
    </main>
  )
}

'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n/context'
import ProtectedImage from '@/components/ProtectedImage'
import { experienceImages } from '@/lib/images'

function ProgressBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-px bg-gold/30 z-[60] origin-left"
      style={{ scaleX }}
    />
  )
}

function ExperienceHero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section ref={ref} className="relative h-[100dvh] overflow-hidden">
      <div className="absolute inset-0">
        <ProtectedImage
          src={experienceImages[0]}
          alt=""
          className="w-full h-full"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <motion.div
        className="relative z-10 h-full"
        style={{ opacity }}
      />
    </section>
  )
}

function ExperienceFrame({
  src,
  text,
  index,
}: {
  src: string
  text: string
  index: number
}) {
  return (
    <section
      className="relative h-[100dvh] overflow-hidden"
      style={{ marginTop: index === 0 ? 0 : '-8vh' }}
    >
      <div className="absolute inset-0">
        <ProtectedImage src={src} alt="" className="w-full h-full" />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <motion.div
        className="absolute inset-0 z-10 flex items-center justify-center px-8 md:px-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        viewport={{ once: true, margin: '-20%' }}
      >
        <p className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light italic text-center leading-relaxed tracking-wide text-off-white/85 max-w-xl">
          {text}
        </p>
      </motion.div>
    </section>
  )
}

function ClosingCTA() {
  const { t } = useI18n()

  return (
    <section className="h-[80vh] flex flex-col items-center justify-center px-6 tone-warm">
      <motion.div
        className="w-16 h-px bg-gold/20 mb-16"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 2, ease: [0.25, 0.46, 0.45, 0.94] }}
        viewport={{ once: true }}
      />

      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
      >
        <Link href="/contact" className="group">
          <span className="font-serif text-4xl sm:text-5xl md:text-6xl font-light italic text-off-white/70 group-hover:text-off-white transition-colors duration-[2000ms]">
            {t.experience.cta}
          </span>
        </Link>
      </motion.div>

      <motion.div
        className="mt-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.6 }}
        viewport={{ once: true }}
      >
        <Link
          href="/contact"
          className="font-sans text-xs tracking-[0.25em] uppercase text-gold/40 hover:text-gold border border-gold/15 hover:border-gold/35 px-8 py-3 transition-all duration-1000"
        >
          {t.nav.book}
        </Link>
      </motion.div>
    </section>
  )
}

export default function ExperiencePage() {
  const { t } = useI18n()
  const lines = [t.experience.l1, t.experience.l2, t.experience.l3, t.experience.l4, t.experience.l5, t.experience.l6]

  return (
    <main className="relative">
      <ProgressBar />
      <ExperienceHero />

      {lines.map((line, i) => (
        <ExperienceFrame
          key={i}
          src={experienceImages[i % experienceImages.length]}
          text={line}
          index={i}
        />
      ))}

      <ClosingCTA />
    </main>
  )
}

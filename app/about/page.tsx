'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n/context'
import ProtectedImage from '@/components/ProtectedImage'
import { experienceImages } from '@/lib/images'

function AboutHero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section ref={ref} className="relative h-[85dvh] overflow-hidden">
      <div className="absolute inset-0">
        <ProtectedImage
          src={experienceImages[2]}
          alt=""
          className="w-full h-full"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <motion.div
        className="relative z-10 h-full flex flex-col items-center justify-end pb-20 md:pb-28 px-6"
        style={{ opacity }}
      >
        <motion.h1
          className="font-serif text-4xl sm:text-5xl md:text-7xl font-light italic tracking-wide text-off-white/90"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          Vasilisa
        </motion.h1>
        <motion.p
          className="label-micro text-gold/40 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1 }}
        >
          Behind the lens
        </motion.p>
      </motion.div>
    </section>
  )
}

function TextBlock({ text, large = false }: { text: string; large?: boolean }) {
  return (
    <motion.p
      className={`${large
        ? 'font-serif text-2xl sm:text-3xl md:text-4xl font-light italic leading-relaxed tracking-wide text-off-white/85'
        : 'font-sans text-sm md:text-base font-light leading-loose text-off-white/50'
      } max-w-xl`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      viewport={{ once: true, margin: '-10%' }}
    >
      {text}
    </motion.p>
  )
}

export default function AboutPage() {
  const { t } = useI18n()

  return (
    <main className="relative">
      <AboutHero />

      <section className="relative py-28 md:py-44 px-6 md:px-12 tone-warm">
        <div className="max-w-2xl mx-auto flex flex-col gap-12 md:gap-20">
          <TextBlock text={t.about.p1} large />
          <TextBlock text={t.about.p2} large />
          <TextBlock text={t.about.p3} />
          <TextBlock text={t.about.p4} />
          <TextBlock text={t.about.p5} large />
        </div>
      </section>

      <section className="relative h-[60vh] overflow-hidden">
        <motion.div
          className="absolute inset-0 bw-image"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          viewport={{ once: true }}
        >
          <ProtectedImage src={experienceImages[4]} alt="" className="w-full h-full" />
        </motion.div>
        <div className="absolute inset-0 bg-black/40" />
      </section>

      <section className="relative py-28 md:py-44 px-6 md:px-12 tone-silk">
        <div className="max-w-2xl mx-auto text-center">
          <motion.p
            className="label-micro text-gold/35 mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            viewport={{ once: true }}
          >
            {t.about.philosophy_title}
          </motion.p>

          <motion.p
            className="font-serif text-2xl sm:text-3xl md:text-4xl font-light italic leading-relaxed tracking-wide text-off-white/75"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 2, ease: [0.25, 0.46, 0.45, 0.94] }}
            viewport={{ once: true }}
          >
            {t.about.philosophy}
          </motion.p>

          <motion.div
            className="gold-line w-16 mx-auto mt-20 mb-16"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1.5 }}
            viewport={{ once: true }}
          />

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Link
              href="/contact"
              className="font-serif text-lg md:text-xl tracking-[0.2em] text-gold/50 hover:text-gold transition-colors duration-[2000ms]"
            >
              {t.about.cta}
            </Link>
          </motion.div>
        </div>
      </section>

      <div className="h-[8vh]" aria-hidden />
    </main>
  )
}

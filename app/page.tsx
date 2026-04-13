'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n/context'
import ProtectedImage from '@/components/ProtectedImage'
import ParallaxImage from '@/components/ParallaxImage'
import TextReveal from '@/components/TextReveal'
import ScrollReveal from '@/components/ScrollReveal'
import { heroImages, scrollImages } from '@/lib/images'

function HeroSection() {
  const { t } = useI18n()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const textY = useTransform(scrollYProgress, [0, 1], [0, -100])

  return (
    <section ref={ref} className="relative h-[100dvh] overflow-hidden">
      <motion.div className="absolute inset-0" style={{ scale }}>
        <ProtectedImage
          src={heroImages[0]}
          alt=""
          className="w-full h-full"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
      </motion.div>

      <motion.div
        className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center"
        style={{ opacity, y: textY }}
      >
        <motion.h1
          className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light italic tracking-wide text-off-white/90 max-w-3xl leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {t.home.hero}
        </motion.h1>
      </motion.div>

      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 1.8 }}
      >
        <motion.div
          className="w-px h-12 bg-off-white/20 mx-auto mb-4"
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: 'top' }}
        />
      </motion.div>
    </section>
  )
}

function ScrollTextSection({ text, image, reverse = false }: { text: string; image?: string; reverse?: boolean }) {
  return (
    <section className="min-h-[80vh] md:min-h-screen flex items-center justify-center px-6 md:px-12 relative">
      {image && (
        <ScrollReveal className={`absolute ${reverse ? 'right-8 md:right-20' : 'left-8 md:left-20'} top-1/2 -translate-y-1/2 w-[40vw] md:w-[30vw] h-[50vh] md:h-[60vh] opacity-20`} blur>
          <ParallaxImage src={image} className="w-full h-full rounded-sm" speed={0.2} />
        </ScrollReveal>
      )}
      <TextReveal
        text={text}
        className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light italic text-center max-w-2xl leading-relaxed tracking-wide text-off-white/85"
        tag="h2"
      />
    </section>
  )
}

function EnterSection() {
  const { t } = useI18n()

  return (
    <section className="min-h-[60vh] flex flex-col items-center justify-center px-6">
      <ScrollReveal className="text-center" blur parallax>
        <Link
          href="/experience"
          className="group inline-block"
        >
          <span className="font-serif text-xl md:text-2xl tracking-[0.3em] uppercase text-gold/70 group-hover:text-gold transition-colors duration-1000">
            {t.home.enter}
          </span>
          <div className="mt-4 mx-auto w-12 h-px bg-gold/30 group-hover:w-20 group-hover:bg-gold/60 transition-all duration-1000" />
        </Link>
      </ScrollReveal>
    </section>
  )
}

export default function HomePage() {
  const { t } = useI18n()

  return (
    <main>
      <HeroSection />
      <ScrollTextSection text={t.home.s1} image={scrollImages[0]} />
      <ScrollTextSection text={t.home.s2} image={scrollImages[1]} reverse />
      <ScrollTextSection text={t.home.s3} image={scrollImages[2]} />
      <ScrollTextSection text={t.home.s4} image={scrollImages[3]} reverse />
      <EnterSection />
      <div className="h-[20vh]" />
    </main>
  )
}

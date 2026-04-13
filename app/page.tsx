'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n/context'
import { heroImages, scrollImages, boudoirImages } from '@/lib/images'
import ProtectedImage from '@/components/ProtectedImage'
import {
  FullScene,
  FloatingScene,
  HorizontalScene,
  CloseUpScene,
  Breath,
} from '@/components/scenes'

function TestimonialWhisper({ quote, delay = 0 }: { quote: string; delay?: number }) {
  return (
    <motion.blockquote
      className="max-w-md mx-auto text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      viewport={{ once: true, margin: '-15%' }}
    >
      <p className="font-serif text-lg sm:text-xl md:text-2xl font-light italic leading-relaxed text-off-white/60">
        &ldquo;{quote}&rdquo;
      </p>
    </motion.blockquote>
  )
}

function TestimonialsSection() {
  const { t } = useI18n()

  return (
    <section className="relative py-32 md:py-48 px-6 tone-warm">
      <motion.p
        className="label-micro text-center text-gold/40 mb-20 md:mb-28"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        viewport={{ once: true }}
      >
        {t.home.testimonials_intro}
      </motion.p>

      <div className="flex flex-col gap-20 md:gap-28">
        <TestimonialWhisper quote={t.home.t1} delay={0.1} />
        <TestimonialWhisper quote={t.home.t2} delay={0.1} />
        <TestimonialWhisper quote={t.home.t3} delay={0.1} />
      </div>

      <motion.div
        className="rose-line w-24 mx-auto mt-24"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 1.5, delay: 0.2 }}
        viewport={{ once: true }}
      />
    </section>
  )
}

const teaserImages = [boudoirImages[7], boudoirImages[22], boudoirImages[15]]

function GalleryTeaser() {
  const { t } = useI18n()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [20, -20])
  const y2 = useTransform(scrollYProgress, [0, 1], [10, -10])
  const y3 = useTransform(scrollYProgress, [0, 1], [30, -30])

  return (
    <section ref={ref} className="relative py-24 md:py-36 px-6 md:px-12 tone-ember">
      <motion.p
        className="label-micro text-center text-gold/40 mb-16 md:mb-24"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        viewport={{ once: true }}
      >
        {t.home.gallery_teaser}
      </motion.p>

      <div className="max-w-5xl mx-auto grid grid-cols-12 gap-3 md:gap-4">
        <motion.div className="col-span-5 aspect-[3/4] overflow-hidden" style={{ y: y1 }}>
          <motion.div
            className="w-full h-full bw-image"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            viewport={{ once: true }}
          >
            <ProtectedImage src={teaserImages[0]} alt="" className="w-full h-full" />
          </motion.div>
        </motion.div>

        <div className="col-span-7 flex flex-col gap-3 md:gap-4">
          <motion.div className="aspect-[16/10] overflow-hidden" style={{ y: y2 }}>
            <motion.div
              className="w-full h-full bw-image"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <ProtectedImage src={teaserImages[1]} alt="" className="w-full h-full" />
            </motion.div>
          </motion.div>
          <motion.div className="aspect-[16/9] overflow-hidden" style={{ y: y3 }}>
            <motion.div
              className="w-full h-full bw-image"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <ProtectedImage src={teaserImages[2]} alt="" className="w-full h-full" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="text-center mt-16 md:mt-24"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        viewport={{ once: true }}
      >
        <Link
          href="/gallery"
          className="label-small text-off-white/30 hover:text-off-white/60 transition-colors duration-1000 border-b border-off-white/10 hover:border-off-white/25 pb-1"
        >
          {t.home.gallery_cta}
        </Link>
      </motion.div>
    </section>
  )
}

function EnterSection() {
  const { t } = useI18n()

  return (
    <section className="h-[70vh] flex flex-col items-center justify-center px-6 tone-dusk">
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 2, ease: [0.25, 0.46, 0.45, 0.94] }}
        viewport={{ once: true, margin: '-10%' }}
      >
        <Link href="/contact" className="group inline-block">
          <motion.span
            className="font-serif text-xl md:text-2xl tracking-[0.3em] uppercase text-gold/50 group-hover:text-gold transition-colors duration-[2000ms] block"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            viewport={{ once: true }}
          >
            {t.home.enter}
          </motion.span>
          <motion.div
            className="mt-6 mx-auto w-10 h-px bg-gold/20 group-hover:w-24 group-hover:bg-gold/40 transition-all duration-[2000ms]"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1.5, delay: 0.6 }}
            viewport={{ once: true }}
          />
        </Link>
      </motion.div>
    </section>
  )
}

export default function HomePage() {
  const { t } = useI18n()

  return (
    <main className="relative">
      <FullScene src={heroImages[0]} text={t.home.hero} isHero />

      <Breath height="40vh" />

      <FloatingScene
        src={scrollImages[0]}
        text={t.home.s1}
        duration="145vh"
        direction="right"
      />

      <Breath height="30vh" />

      <CloseUpScene
        src={heroImages[1]}
        duration="100vh"
      />

      <Breath height="55vh" />

      <HorizontalScene
        src={scrollImages[1]}
        text={t.home.s2}
        duration="120vh"
        direction="left"
      />

      <Breath height="22vh" />

      <FullScene
        src={heroImages[2]}
        text={t.home.s3}
        duration="170vh"
        textPosition="right"
      />

      <Breath height="45vh" />

      <CloseUpScene
        src={scrollImages[2]}
        duration="90vh"
      />

      <Breath height="35vh" />

      <FloatingScene
        src={scrollImages[3]}
        text={t.home.s4}
        duration="135vh"
        direction="left"
      />

      <Breath height="30vh" />

      <TestimonialsSection />

      <GalleryTeaser />

      <Breath height="15vh" />

      <EnterSection />

      <div className="h-[10vh]" aria-hidden />
    </main>
  )
}

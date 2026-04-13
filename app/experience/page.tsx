'use client'

import { motion } from 'framer-motion'
import { useI18n } from '@/lib/i18n/context'
import ScrollReveal from '@/components/ScrollReveal'
import ParallaxImage from '@/components/ParallaxImage'
import TextReveal from '@/components/TextReveal'
import { experienceImages } from '@/lib/images'

function ExperienceHero() {
  return (
    <section className="relative h-[100dvh] flex items-center justify-center overflow-hidden">
      <motion.div className="absolute inset-0">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <motion.div
          className="w-full h-full"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 3.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <ParallaxImage
            src={experienceImages[0]}
            className="w-full h-full"
            speed={0.15}
          />
        </motion.div>
      </motion.div>
    </section>
  )
}

const sectionRhythm = [
  { imgSide: 'right' as const, voidBefore: '40vh', delay: 0.1 },
  { imgSide: 'left' as const, voidBefore: '30vh', delay: 0.2 },
  { imgSide: 'right' as const, voidBefore: '45vh', delay: 0.15 },
  { imgSide: 'left' as const, voidBefore: '35vh', delay: 0.25 },
  { imgSide: 'right' as const, voidBefore: '50vh', delay: 0.1 },
  { imgSide: 'left' as const, voidBefore: '30vh', delay: 0.2 },
]

function TextSection({ text, idx, rhythm }: { text: string; idx: number; rhythm: typeof sectionRhythm[number] }) {
  const hasImage = idx % 2 === 0
  const isRight = rhythm.imgSide === 'right'

  return (
    <section className="min-h-[70vh] md:min-h-[80vh] flex items-center justify-center px-6 md:px-12 relative">
      {hasImage && (
        <ScrollReveal
          className={`absolute ${isRight ? 'right-6 md:right-16' : 'left-6 md:left-16'} top-1/2 -translate-y-1/2 w-[35vw] md:w-[25vw] h-[40vh] md:h-[55vh] opacity-15`}
          blur
          cinematic
          delay={rhythm.delay}
        >
          <ParallaxImage
            src={experienceImages[idx % experienceImages.length]}
            className="w-full h-full rounded-sm"
            speed={0.15}
          />
        </ScrollReveal>
      )}
      <TextReveal
        text={text}
        className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light italic text-center max-w-xl leading-relaxed tracking-wide text-off-white/85"
        tag="h2"
      />
    </section>
  )
}

function ClosingSection() {
  return (
    <section className="min-h-[50vh] flex items-center justify-center px-6">
      <ScrollReveal blur parallax>
        <motion.div
          className="w-16 h-px bg-gold/30 mx-auto"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1.8, delay: 0.4 }}
          viewport={{ once: true }}
        />
      </ScrollReveal>
    </section>
  )
}

export default function ExperiencePage() {
  const { t } = useI18n()
  const lines = [t.experience.l1, t.experience.l2, t.experience.l3, t.experience.l4, t.experience.l5, t.experience.l6]

  return (
    <main className="relative">
      <ExperienceHero />

      {lines.map((line, i) => {
        const rhythm = sectionRhythm[i] || sectionRhythm[0]
        return (
          <div key={i}>
            {/* Breathing space — irregular rhythm prevents monotony */}
            <div style={{ height: rhythm.voidBefore }} />
            <TextSection text={line} idx={i} rhythm={rhythm} />
          </div>
        )
      })}

      <div style={{ height: '40vh' }} />
      <ClosingSection />
      <div className="h-[20vh]" />
    </main>
  )
}

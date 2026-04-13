'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion'
import ProtectedImage from '@/components/ProtectedImage'

interface Scene {
  src: string
  text?: string
}

interface CinematicSequenceProps {
  scenes: Scene[]
}

const SCENE_HEIGHT = '150vh'
const EASE_EMERGE: [number, number, number, number] = [0.16, 1, 0.3, 1]

function useFilterString(progress: MotionValue<number>, input: number[], blurValues: number[]) {
  return useTransform(progress, input, blurValues.map((v) => `blur(${v}px)`))
}

function CinematicScene({ scene, index }: { scene: Scene; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // --- IMAGE ANIMATION ---
  // 0 → 0.2: enter (fade in, deblur, scale down from 1.1)
  // 0.2 → 0.7: hold (fully visible, breathing scale, long dwell)
  // 0.7 → 1.0: leave (fade out, re-blur, slight zoom out)

  const imgOpacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.2, 0.7, 0.85, 1],
    [0, 0.6, 1, 1, 0.4, 0]
  )

  const imgScale = useTransform(
    scrollYProgress,
    [0, 0.2, 0.45, 0.7, 1],
    [1.12, 1.0, 1.02, 1.0, 1.06]
  )

  const imgBlur = useBlur(
    scrollYProgress,
    [0, 0.12, 0.2, 0.7, 0.88, 1],
    [14, 6, 0, 0, 6, 10]
  )

  const imgBrightness = useTransform(
    scrollYProgress,
    [0, 0.2, 0.45, 0.7, 1],
    [0.2, 0.9, 1, 0.9, 0.2]
  )

  const imgFilter = useTransform(
    ([imgBlur, imgBrightness] as MotionValue[]) as MotionValue<string>[],
    // @ts-expect-error -- framer-motion overload typing
    ([blur, brightness]: [string, number]) =>
      `${blur} brightness(${brightness})`
  )

  // Subtle horizontal drift — alternates direction per scene
  const driftDirection = index % 2 === 0 ? 1 : -1
  const imgX = useTransform(
    scrollYProgress,
    [0, 0.2, 0.5, 0.7, 1],
    [
      -12 * driftDirection,
      -4 * driftDirection,
      0,
      4 * driftDirection,
      12 * driftDirection,
    ]
  )

  // Slight vertical drift (organic breathing)
  const imgY = useTransform(
    scrollYProgress,
    [0, 0.2, 0.5, 0.7, 1],
    [8, 3, 0, -3, -8]
  )

  // --- TEXT ANIMATION ---
  // Text enters LATER, exits EARLIER → emotional delay
  const textOpacity = useTransform(
    scrollYProgress,
    [0.25, 0.35, 0.38, 0.6, 0.65],
    [0, 0.5, 1, 1, 0]
  )

  const textY = useTransform(
    scrollYProgress,
    [0.25, 0.38, 0.6, 0.65],
    [40, 0, 0, -30]
  )

  const textBlur = useBlur(
    scrollYProgress,
    [0.25, 0.35, 0.38, 0.6, 0.65],
    [12, 4, 0, 0, 10]
  )

  const textScale = useTransform(
    scrollYProgress,
    [0.25, 0.38, 0.6, 0.65],
    [0.96, 1, 1, 0.97]
  )

  // Vignette intensity pulses slightly
  const vignetteOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.5, 0.7, 1],
    [0.9, 0.5, 0.35, 0.5, 0.9]
  )

  const isEven = index % 2 === 0

  return (
    <section
      ref={ref}
      style={{ height: SCENE_HEIGHT }}
      className="relative"
    >
      {/* Sticky viewport — pins the visual while scroll drives animation */}
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        {/* Image layer */}
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={{
            scale: imgScale,
            opacity: imgOpacity,
            filter: imgFilter,
            x: imgX,
            y: imgY,
          }}
        >
          <ProtectedImage
            src={scene.src}
            alt=""
            className="w-full h-full"
          />
        </motion.div>

        {/* Cinematic darkening overlay */}
        <div className="absolute inset-0 bg-black/30 pointer-events-none" />

        {/* Vignette overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: vignetteOpacity,
            background:
              'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)',
          }}
        />

        {/* Subtle flicker — extremely light opacity animation */}
        <motion.div
          className="absolute inset-0 bg-black pointer-events-none"
          animate={{
            opacity: [0, 0.015, 0, 0.01, 0, 0.02, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
            times: [0, 0.1, 0.15, 0.4, 0.45, 0.8, 1],
          }}
        />

        {/* Text layer */}
        {scene.text && (
          <motion.div
            className={`absolute inset-0 z-10 flex items-center px-6 md:px-16 lg:px-24 ${
              isEven ? 'justify-start' : 'justify-end'
            }`}
            style={{
              opacity: textOpacity,
              y: textY,
              filter: textBlur,
              scale: textScale,
            }}
          >
            <p
              className={`font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light italic leading-relaxed tracking-wide text-off-white/90 max-w-xl ${
                isEven ? 'text-left' : 'text-right'
              }`}
            >
              {scene.text}
            </p>
          </motion.div>
        )}
      </div>
    </section>
  )
}

function CinematicHero({
  src,
  headline,
}: {
  src: string
  headline: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15])
  const imgOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 0.6, 0])
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.35, 0.85])
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const textY = useTransform(scrollYProgress, [0, 1], [0, -100])
  const textBlur = useBlur(scrollYProgress, [0, 0.4, 0.6], [0, 0, 8])

  return (
    <section ref={ref} className="relative h-[120vh]">
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={{ scale: imgScale, opacity: imgOpacity }}
        >
          <ProtectedImage
            src={src}
            alt=""
            className="w-full h-full"
            priority
          />
          <motion.div
            className="absolute inset-0 bg-black"
            style={{ opacity: overlayOpacity }}
          />
        </motion.div>

        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.6) 100%)',
          }}
        />

        <motion.div
          className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center"
          style={{ opacity: textOpacity, y: textY, filter: textBlur }}
        >
          <motion.h1
            className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-light italic tracking-wide text-off-white/90 max-w-4xl leading-relaxed"
            initial={{ opacity: 0, y: 50, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 3.2,
              delay: 0.6,
              ease: EASE_EMERGE,
            }}
          >
            {headline}
          </motion.h1>
        </motion.div>

        {/* Scroll indicator — breathing line */}
        <motion.div
          className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2.5, delay: 3.5 }}
        >
          <motion.div
            className="w-px h-16 bg-off-white/12 mx-auto"
            animate={{ scaleY: [0, 1, 0] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ transformOrigin: 'top' }}
          />
        </motion.div>
      </div>
    </section>
  )
}

export default function CinematicSequence({ scenes }: CinematicSequenceProps) {
  if (scenes.length === 0) return null

  const [hero, ...rest] = scenes

  return (
    <>
      {/* First scene is the hero — full presence on load */}
      <CinematicHero src={hero.src} headline={hero.text ?? ''} />

      {/* Breathing space between hero and sequence */}
      <div className="h-[8vh]" aria-hidden />

      {/* Each remaining scene is a cinematic scroll-driven moment */}
      {rest.map((scene, i) => (
        <CinematicScene key={i} scene={scene} index={i} />
      ))}
    </>
  )
}

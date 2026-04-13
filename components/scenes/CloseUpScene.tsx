'use client'

import { useRef } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useInView,
} from 'framer-motion'
import ProtectedImage from '@/components/ProtectedImage'
import { interpolate, type Stops } from './types'

interface CloseUpSceneProps {
  src: string
  text?: string
  duration?: string
  focus?: string
  /** 'scroll' | 'viewport' — controls what drives the scale animation */
  driver?: 'scroll' | 'viewport'
}

export default function CloseUpScene({
  src,
  text,
  duration = '100vh',
  focus = 'center 40%',
  driver = 'scroll',
}: CloseUpSceneProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { margin: '-20% 0px -20% 0px' })
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // Heavy blur entry/exit — tension builds through clarity
  const imgLayerRef = useRef<HTMLDivElement>(null)
  const BLUR_STOPS: Stops = [[0, 20], [0.08, 12], [0.18, 0], [0.82, 0], [0.92, 14], [1, 22]]
  const BRIGHT_STOPS: Stops = [[0, 0.1], [0.18, 0.7], [0.5, 0.95], [0.82, 0.7], [1, 0.1]]

  const imgFilterValue = useTransform(scrollYProgress, (p) => {
    const blur = interpolate(BLUR_STOPS, p)
    const brightness = interpolate(BRIGHT_STOPS, p)
    return `blur(${blur}px) brightness(${brightness})`
  })

  useMotionValueEvent(imgFilterValue, 'change', (v) => {
    if (imgLayerRef.current) imgLayerRef.current.style.filter = v
  })

  const imgOpacity = useTransform(
    scrollYProgress,
    [0, 0.08, 0.16, 0.84, 0.94, 1],
    [0, 0.3, 1, 1, 0.3, 0]
  )

  // Scale — scroll-driven: slow creep in; viewport-driven: delayed autoplay
  const scrollScale = useTransform(
    scrollYProgress,
    [0, 0.15, 0.5, 0.85, 1],
    [1.15, 1.06, 1.0, 1.04, 1.12]
  )

  // Tight crop — image is zoomed and reframed via object-position
  const cropScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1.25, 1.18, 1.25]
  )

  // Inner shadow for tension
  const innerShadowOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.5, 0.8, 1],
    [0.9, 0.5, 0.35, 0.5, 0.9]
  )

  // Optional minimal text
  const textOpacity = useTransform(
    scrollYProgress,
    [0.35, 0.44, 0.48, 0.56, 0.62],
    [0, 0.4, 1, 1, 0]
  )

  const textLayerRef = useRef<HTMLDivElement>(null)
  const textFilterValue = useTransform(scrollYProgress, (p) => {
    const blur = interpolate([[0.35, 8], [0.44, 2], [0.48, 0], [0.56, 0], [0.62, 6]] as Stops, p)
    return `blur(${blur}px)`
  })
  useMotionValueEvent(textFilterValue, 'change', (v) => {
    if (textLayerRef.current) textLayerRef.current.style.filter = v
  })

  return (
    <section ref={ref} style={{ height: duration }} className="relative">
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        {/* Cropped image layer */}
        <motion.div
          ref={imgLayerRef}
          className="absolute inset-0 will-change-transform"
          style={{
            scale: driver === 'scroll' ? scrollScale : undefined,
            opacity: imgOpacity,
          }}
        >
          <motion.div
            className="absolute inset-0"
            style={{ scale: cropScale }}
            {...(driver === 'viewport'
              ? {
                  animate: isInView
                    ? { scale: [1.2, 1.12] }
                    : { scale: 1.2 },
                  transition: { duration: 8, ease: [0.16, 1, 0.3, 1] },
                }
              : {})}
          >
            <ProtectedImage
              src={src}
              alt=""
              className="w-full h-full"
            />
          </motion.div>

          <div className="absolute inset-0 bg-black/35 pointer-events-none" />
        </motion.div>

        {/* Inner shadow / vignette — tighter than FullScene */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: innerShadowOpacity,
            background:
              'radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.75) 100%)',
            boxShadow: 'inset 0 0 120px 40px rgba(0,0,0,0.5)',
          }}
        />

        {/* Minimal text — rarely used on close-ups */}
        {text && (
          <motion.div
            ref={textLayerRef}
            className="absolute inset-0 z-10 flex items-end justify-center pb-[15%] px-6"
            style={{ opacity: textOpacity }}
          >
            <p className="font-serif text-lg sm:text-xl md:text-2xl font-light italic tracking-wider text-off-white/70 max-w-sm text-center">
              {text}
            </p>
          </motion.div>
        )}
      </div>
    </section>
  )
}

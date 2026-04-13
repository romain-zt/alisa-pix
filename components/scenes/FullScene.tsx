'use client'

import { useRef } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from 'framer-motion'
import ProtectedImage from '@/components/ProtectedImage'
import { interpolate, type Stops } from './types'

const EASE_EMERGE: [number, number, number, number] = [0.16, 1, 0.3, 1]

interface FullSceneProps {
  src: string
  text?: string
  duration?: string
  textPosition?: 'left' | 'right' | 'center'
  focus?: string
  /** First scene in the sequence gets autoplay headline + scroll indicator */
  isHero?: boolean
}

function FullSceneHero({ src, text, focus }: Pick<FullSceneProps, 'src' | 'text' | 'focus'>) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.18])
  const imgOpacity = useTransform(scrollYProgress, [0, 0.65, 1], [1, 0.5, 0])
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.3, 0.85])
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const textY = useTransform(scrollYProgress, [0, 1], [0, -120])

  const heroTextRef = useRef<HTMLDivElement>(null)
  const heroTextFilter = useTransform(scrollYProgress, (p) => {
    const blur = interpolate([[0, 0], [0.35, 0], [0.6, 10]] as Stops, p)
    return `blur(${blur}px)`
  })
  useMotionValueEvent(heroTextFilter, 'change', (v) => {
    if (heroTextRef.current) heroTextRef.current.style.filter = v
  })

  return (
    <section ref={ref} className="relative h-[200vh]">
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

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,0.65) 100%)',
          }}
        />

        <motion.div
          ref={heroTextRef}
          className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center"
          style={{ opacity: textOpacity, y: textY }}
        >
          {text && (
            <motion.h1
              className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-light italic tracking-wide text-off-white/90 max-w-4xl leading-relaxed"
              initial={{ opacity: 0, y: 60, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 3.6, delay: 0.8, ease: EASE_EMERGE }}
            >
              {text}
            </motion.h1>
          )}
        </motion.div>

        <motion.div
          className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2.5, delay: 4 }}
        >
          <motion.div
            className="w-px h-16 bg-off-white/10 mx-auto"
            animate={{ scaleY: [0, 1, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: 'top' }}
          />
        </motion.div>
      </div>
    </section>
  )
}

function FullSceneInner({
  src,
  text,
  duration = '160vh',
  textPosition = 'center',
  focus,
}: FullSceneProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const imgScale = useTransform(
    scrollYProgress,
    [0, 0.15, 0.5, 0.85, 1],
    [1.08, 1.0, 1.03, 1.0, 1.06]
  )
  const imgOpacity = useTransform(
    scrollYProgress,
    [0, 0.12, 0.18, 0.75, 0.88, 1],
    [0, 0.5, 1, 1, 0.3, 0]
  )

  const imgLayerRef = useRef<HTMLDivElement>(null)
  const BLUR_STOPS: Stops = [[0, 16], [0.1, 5], [0.18, 0], [0.75, 0], [0.9, 6], [1, 12]]
  const BRIGHT_STOPS: Stops = [[0, 0.15], [0.18, 0.85], [0.5, 1], [0.75, 0.85], [1, 0.15]]

  const imgFilterValue = useTransform(scrollYProgress, (p) => {
    const blur = interpolate(BLUR_STOPS, p)
    const brightness = interpolate(BRIGHT_STOPS, p)
    return `blur(${blur}px) brightness(${brightness})`
  })

  useMotionValueEvent(imgFilterValue, 'change', (v) => {
    if (imgLayerRef.current) imgLayerRef.current.style.filter = v
  })

  const imgY = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8, 1], [10, 4, 0, -4, -10])

  const vignetteOpacity = useTransform(
    scrollYProgress,
    [0, 0.18, 0.5, 0.75, 1],
    [0.85, 0.45, 0.3, 0.45, 0.85]
  )

  const textOpacity = useTransform(
    scrollYProgress,
    [0.22, 0.32, 0.36, 0.62, 0.68],
    [0, 0.4, 1, 1, 0]
  )
  const textY = useTransform(scrollYProgress, [0.22, 0.36, 0.62, 0.68], [50, 0, 0, -40])

  const textLayerRef = useRef<HTMLDivElement>(null)
  const textFilterValue = useTransform(scrollYProgress, (p) => {
    const blur = interpolate([[0.22, 14], [0.32, 4], [0.36, 0], [0.62, 0], [0.68, 12]] as Stops, p)
    return `blur(${blur}px)`
  })
  useMotionValueEvent(textFilterValue, 'change', (v) => {
    if (textLayerRef.current) textLayerRef.current.style.filter = v
  })

  const textScale = useTransform(scrollYProgress, [0.22, 0.36, 0.62, 0.68], [0.95, 1, 1, 0.96])

  const justifyMap = { left: 'justify-start', right: 'justify-end', center: 'justify-center' }
  const alignMap = { left: 'text-left', right: 'text-right', center: 'text-center' }

  return (
    <section ref={ref} style={{ height: duration }} className="relative">
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        <motion.div
          ref={imgLayerRef}
          className="absolute inset-0 will-change-transform"
          style={{
            scale: imgScale,
            opacity: imgOpacity,
            y: imgY,
          }}
        >
          <ProtectedImage src={src} alt="" className="w-full h-full" />
        </motion.div>

        <div className="absolute inset-0 bg-black/25 pointer-events-none" />

        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: vignetteOpacity,
            background:
              'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.7) 100%)',
          }}
        />

        <motion.div
          className="absolute inset-0 bg-black pointer-events-none"
          animate={{ opacity: [0, 0.012, 0, 0.008, 0, 0.015, 0] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'linear',
            times: [0, 0.1, 0.15, 0.4, 0.45, 0.8, 1],
          }}
        />

        {text && (
          <motion.div
            ref={textLayerRef}
            className={`absolute inset-0 z-10 flex items-center px-6 md:px-16 lg:px-24 ${justifyMap[textPosition!]}`}
            style={{ opacity: textOpacity, y: textY, scale: textScale }}
          >
            <p
              className={`font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light italic leading-relaxed tracking-wide text-off-white/90 max-w-xl ${alignMap[textPosition!]}`}
            >
              {text}
            </p>
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default function FullScene(props: FullSceneProps) {
  if (props.isHero) {
    return <FullSceneHero src={props.src} text={props.text} focus={props.focus} />
  }
  return <FullSceneInner {...props} />
}

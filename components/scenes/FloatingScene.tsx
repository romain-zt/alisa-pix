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

interface FloatingSceneProps {
  src: string
  text?: string
  duration?: string
  direction?: 'left' | 'right'
  focus?: string
}

export default function FloatingScene({
  src,
  text,
  duration = '140vh',
  direction = 'right',
  focus,
}: FloatingSceneProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // Viewport-driven entry — floats into view
  const frameOpacity = useTransform(
    scrollYProgress,
    [0, 0.1, 0.2, 0.75, 0.9, 1],
    [0, 0.3, 1, 1, 0.3, 0]
  )

  // Gentle vertical drift — the frame breathes
  const frameY = useTransform(
    scrollYProgress,
    [0, 0.15, 0.5, 0.85, 1],
    [60, 20, 0, -20, -60]
  )

  // Slight horizontal offset based on direction
  const dirMul = direction === 'left' ? -1 : 1
  const frameX = useTransform(
    scrollYProgress,
    [0, 0.2, 0.5, 0.8, 1],
    [40 * dirMul, 12 * dirMul, 0, -12 * dirMul, -40 * dirMul]
  )

  // Soft scale breath
  const frameScale = useTransform(
    scrollYProgress,
    [0, 0.2, 0.5, 0.8, 1],
    [0.94, 0.98, 1, 0.98, 0.94]
  )

  // Shadow intensity peaks at center
  const shadowOpacity = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [0, 0.3, 0.5, 0.3, 0]
  )

  const imgLayerRef = useRef<HTMLDivElement>(null)
  const BLUR_STOPS: Stops = [[0, 8], [0.15, 2], [0.22, 0], [0.78, 0], [0.88, 3], [1, 8]]

  const imgFilterValue = useTransform(scrollYProgress, (p) => {
    const blur = interpolate(BLUR_STOPS, p)
    return `blur(${blur}px)`
  })

  useMotionValueEvent(imgFilterValue, 'change', (v) => {
    if (imgLayerRef.current) imgLayerRef.current.style.filter = v
  })

  // Text — appears after image, disappears before
  const textOpacity = useTransform(
    scrollYProgress,
    [0.3, 0.4, 0.44, 0.6, 0.66],
    [0, 0.5, 1, 1, 0]
  )
  const textY = useTransform(scrollYProgress, [0.3, 0.44, 0.6, 0.66], [30, 0, 0, -25])

  const textLayerRef = useRef<HTMLDivElement>(null)
  const textFilterValue = useTransform(scrollYProgress, (p) => {
    const blur = interpolate([[0.3, 10], [0.4, 3], [0.44, 0], [0.6, 0], [0.66, 8]] as Stops, p)
    return `blur(${blur}px)`
  })
  useMotionValueEvent(textFilterValue, 'change', (v) => {
    if (textLayerRef.current) textLayerRef.current.style.filter = v
  })

  const alignClass = direction === 'left' ? 'mr-auto ml-6 md:ml-16' : 'ml-auto mr-6 md:mr-16'

  return (
    <section ref={ref} style={{ height: duration }} className="relative">
      <div className="sticky top-0 h-[100dvh] overflow-hidden flex items-center justify-center">
        <motion.div
          className="relative w-[85%] md:w-[65%] lg:w-[58%] aspect-[3/4] md:aspect-[4/5]"
          style={{
            opacity: frameOpacity,
            y: frameY,
            x: frameX,
            scale: frameScale,
          }}
        >
          {/* Drop shadow */}
          <motion.div
            className="absolute -inset-4 rounded-sm pointer-events-none"
            style={{
              opacity: shadowOpacity,
              boxShadow: '0 30px 80px rgba(0,0,0,0.8), 0 10px 30px rgba(0,0,0,0.6)',
            }}
          />

          {/* Image */}
          <div
            ref={imgLayerRef}
            className="relative w-full h-full overflow-hidden rounded-sm"
          >
            <ProtectedImage
              src={src}
              alt=""
              className="w-full h-full"
            />
            <div className="absolute inset-0 bg-black/15 pointer-events-none" />
          </div>
        </motion.div>

        {/* Text below or beside the frame */}
        {text && (
          <motion.div
            ref={textLayerRef}
            className={`absolute bottom-[12%] md:bottom-[15%] z-10 px-6 md:px-16 ${alignClass}`}
            style={{ opacity: textOpacity, y: textY }}
          >
            <p className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light italic leading-relaxed tracking-wide text-off-white/80 max-w-md">
              {text}
            </p>
          </motion.div>
        )}
      </div>
    </section>
  )
}

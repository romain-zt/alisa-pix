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

interface HorizontalSceneProps {
  src: string
  text?: string
  duration?: string
  direction?: 'left' | 'right'
  focus?: string
}

export default function HorizontalScene({
  src,
  text,
  duration = '120vh',
  direction = 'left',
  focus,
}: HorizontalSceneProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const dirMul = direction === 'left' ? -1 : 1

  // Image slides in from one side, exits the other
  const imgX = useTransform(
    scrollYProgress,
    [0, 0.15, 0.5, 0.85, 1],
    [
      `${35 * dirMul}%`,
      `${10 * dirMul}%`,
      '0%',
      `${-10 * dirMul}%`,
      `${-35 * dirMul}%`,
    ]
  )

  const imgOpacity = useTransform(
    scrollYProgress,
    [0, 0.1, 0.2, 0.8, 0.92, 1],
    [0, 0.4, 1, 1, 0.4, 0]
  )

  // Slight parallax offset — image moves faster than frame
  const parallaxX = useTransform(
    scrollYProgress,
    [0, 1],
    [`${8 * dirMul}%`, `${-8 * dirMul}%`]
  )

  const imgScale = useTransform(
    scrollYProgress,
    [0, 0.2, 0.5, 0.8, 1],
    [1.04, 1.0, 1.02, 1.0, 1.04]
  )

  const imgLayerRef = useRef<HTMLDivElement>(null)
  const BLUR_STOPS: Stops = [[0, 6], [0.15, 2], [0.22, 0], [0.78, 0], [0.88, 3], [1, 6]]

  const imgFilterValue = useTransform(scrollYProgress, (p) => {
    const blur = interpolate(BLUR_STOPS, p)
    return `blur(${blur}px)`
  })

  useMotionValueEvent(imgFilterValue, 'change', (v) => {
    if (imgLayerRef.current) imgLayerRef.current.style.filter = v
  })

  // Text appears on the opposite side of image motion
  const textOpacity = useTransform(
    scrollYProgress,
    [0.28, 0.38, 0.42, 0.58, 0.64],
    [0, 0.5, 1, 1, 0]
  )
  const textY = useTransform(scrollYProgress, [0.28, 0.42, 0.58, 0.64], [25, 0, 0, -20])

  const textLayerRef = useRef<HTMLDivElement>(null)
  const textFilterValue = useTransform(scrollYProgress, (p) => {
    const blur = interpolate([[0.28, 8], [0.38, 2], [0.42, 0], [0.58, 0], [0.64, 6]] as Stops, p)
    return `blur(${blur}px)`
  })
  useMotionValueEvent(textFilterValue, 'change', (v) => {
    if (textLayerRef.current) textLayerRef.current.style.filter = v
  })

  const textSide = direction === 'left' ? 'right-6 md:right-16 text-right' : 'left-6 md:left-16 text-left'

  return (
    <section ref={ref} style={{ height: duration }} className="relative">
      <div className="sticky top-0 h-[100dvh] overflow-hidden flex items-center">
        {/* Sliding image frame */}
        <motion.div
          className="relative w-[88%] md:w-[78%] lg:w-[72%] aspect-[16/10] mx-auto"
          style={{
            x: imgX,
            opacity: imgOpacity,
            scale: imgScale,
          }}
        >
          <div
            ref={imgLayerRef}
            className="relative w-full h-full overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 will-change-transform"
              style={{ x: parallaxX }}
            >
              <ProtectedImage
                src={src}
                alt=""
                className="w-full h-full"
              />
            </motion.div>
            <div className="absolute inset-0 bg-black/20 pointer-events-none" />
          </div>
        </motion.div>

        {/* Text on opposite side */}
        {text && (
          <motion.div
            ref={textLayerRef}
            className={`absolute top-1/2 -translate-y-1/2 z-10 ${textSide}`}
            style={{ opacity: textOpacity, y: textY }}
          >
            <p className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light italic leading-relaxed tracking-wide text-off-white/85 max-w-sm">
              {text}
            </p>
          </motion.div>
        )}
      </div>
    </section>
  )
}

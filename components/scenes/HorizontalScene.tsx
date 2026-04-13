'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import ProtectedImage from '@/components/ProtectedImage'

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
}: HorizontalSceneProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const dirMul = direction === 'left' ? -1 : 1

  const imgX = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [`${20 * dirMul}%`, '0%', '0%', `${-20 * dirMul}%`]
  )
  const imgOpacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    [0, 1, 1, 0]
  )

  const textOpacity = useTransform(
    scrollYProgress,
    [0.3, 0.42, 0.58, 0.7],
    [0, 1, 1, 0]
  )
  const textY = useTransform(scrollYProgress, [0.3, 0.42, 0.58, 0.7], [20, 0, 0, -15])

  const textSide =
    direction === 'left'
      ? 'right-6 md:right-16 text-right'
      : 'left-6 md:left-16 text-left'

  return (
    <section ref={ref} style={{ height: duration }} className="relative">
      <div className="sticky top-0 h-[100dvh] overflow-hidden flex items-center">
        <motion.div
          className="relative w-[88%] md:w-[78%] lg:w-[72%] aspect-[16/10] mx-auto"
          style={{ x: imgX, opacity: imgOpacity }}
        >
          <div className="relative w-full h-full overflow-hidden">
            <ProtectedImage src={src} alt="" className="w-full h-full" />
            <div className="absolute inset-0 bg-black/20 pointer-events-none" />
          </div>
        </motion.div>

        {text && (
          <motion.div
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

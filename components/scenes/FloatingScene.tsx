'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import ProtectedImage from '@/components/ProtectedImage'

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
}: FloatingSceneProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const frameOpacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    [0, 1, 1, 0]
  )

  const frameY = useTransform(scrollYProgress, [0, 1], [40, -40])

  const textOpacity = useTransform(
    scrollYProgress,
    [0.3, 0.42, 0.58, 0.7],
    [0, 1, 1, 0]
  )
  const textY = useTransform(scrollYProgress, [0.3, 0.42, 0.58, 0.7], [20, 0, 0, -15])

  const alignClass = direction === 'left' ? 'mr-auto ml-6 md:ml-16' : 'ml-auto mr-6 md:mr-16'

  return (
    <section ref={ref} style={{ height: duration }} className="relative">
      <div className="sticky top-0 h-[100dvh] overflow-hidden flex items-center justify-center">
        <motion.div
          className="relative w-[85%] md:w-[65%] lg:w-[58%] aspect-[3/4] md:aspect-[4/5]"
          style={{ opacity: frameOpacity, y: frameY }}
        >
          <div className="relative w-full h-full overflow-hidden rounded-sm shadow-2xl">
            <ProtectedImage src={src} alt="" className="w-full h-full" />
            <div className="absolute inset-0 bg-black/15 pointer-events-none" />
          </div>
        </motion.div>

        {text && (
          <motion.div
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

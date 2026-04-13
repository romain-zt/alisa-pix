'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import ProtectedImage from '@/components/ProtectedImage'

interface CloseUpSceneProps {
  src: string
  text?: string
  duration?: string
  focus?: string
  driver?: 'scroll' | 'viewport'
}

export default function CloseUpScene({
  src,
  text,
  duration = '100vh',
}: CloseUpSceneProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const imgOpacity = useTransform(
    scrollYProgress,
    [0, 0.12, 0.88, 1],
    [0, 1, 1, 0]
  )
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1, 1.04])

  const textOpacity = useTransform(
    scrollYProgress,
    [0.35, 0.45, 0.55, 0.65],
    [0, 1, 1, 0]
  )

  return (
    <section ref={ref} style={{ height: duration }} className="relative">
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={{ scale: imgScale, opacity: imgOpacity }}
        >
          <ProtectedImage src={src} alt="" className="w-full h-full" />
          <div className="absolute inset-0 bg-black/35 pointer-events-none" />
        </motion.div>

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.65) 100%)',
          }}
        />

        {text && (
          <motion.div
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

'use client'

import { useRef, type ReactNode } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  blur?: boolean
  parallax?: boolean
  parallaxOffset?: number
  /** Full cinematic lifecycle: fade in → hold → fade out */
  cinematic?: boolean
}

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  blur = false,
  parallax = false,
  parallaxOffset = 80,
  cinematic = false,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: cinematic
      ? ['start end', 'start 0.4', 'end 0.6', 'end start']
      : ['start 0.95', 'start 0.3'],
  })

  // Cinematic: enter → presence → exit
  // Standard: just enter
  const opacity = cinematic
    ? useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8, 1], [0, 1, 1, 1, 0])
    : useTransform(scrollYProgress, [0, 0.3, 0.6, 1], [0, 0.3, 1, 1])

  const y = useTransform(scrollYProgress, [0, 1], [parallaxOffset, 0])

  const filterBlur = cinematic
    ? useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8, 1], ['blur(16px)', 'blur(0px)', 'blur(0px)', 'blur(0px)', 'blur(12px)'])
    : useTransform(scrollYProgress, [0, 0.5, 1], ['blur(12px)', 'blur(4px)', 'blur(0px)'])

  // Cinematic scale: breathe in → settle → breathe out
  const scale = cinematic
    ? useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [1.08, 1, 1, 1.05])
    : useTransform(scrollYProgress, [0, 0.5, 1], [0.98, 1.01, 1])

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        opacity,
        y: parallax ? y : 0,
        scale,
        filter: blur ? filterBlur : 'none',
        willChange: 'opacity, transform, filter',
      }}
      transition={{
        duration: 1.6,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  )
}

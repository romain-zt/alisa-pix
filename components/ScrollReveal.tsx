'use client'

import { useRef, ReactNode } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  blur?: boolean
  parallax?: boolean
  parallaxOffset?: number
}

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  blur = false,
  parallax = false,
  parallaxOffset = 80,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.95', 'start 0.3'],
  })

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1])
  const y = useTransform(scrollYProgress, [0, 1], [parallaxOffset, 0])
  const filterBlur = useTransform(scrollYProgress, [0, 0.5, 1], ['blur(12px)', 'blur(4px)', 'blur(0px)'])

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        opacity,
        y: parallax ? y : 0,
        filter: blur ? filterBlur : 'none',
        willChange: 'opacity, transform, filter',
      }}
      transition={{
        duration: 1.2,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  )
}

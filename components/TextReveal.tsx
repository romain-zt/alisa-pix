'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface TextRevealProps {
  text: string
  className?: string
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
}

export default function TextReveal({ text, className = '', tag = 'p' }: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'center 0.4'],
  })

  // Hesitation → presence → settled
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], [0, 0.3, 1, 1])
  const y = useTransform(scrollYProgress, [0, 1], [60, 0])
  const blur = useTransform(scrollYProgress, [0, 0.4, 1], ['blur(10px)', 'blur(3px)', 'blur(0px)'])

  // Breath: letters compress as text settles
  const letterSpacing = useTransform(scrollYProgress, [0, 1], ['0.08em', '0.02em'])

  // Micro-scale pulse — organic, not mechanical
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.98, 1.01, 1])

  const Tag = tag

  return (
    <motion.div
      ref={ref}
      style={{
        opacity,
        y,
        scale,
        letterSpacing,
        filter: blur,
        willChange: 'opacity, transform, filter',
      }}
    >
      <Tag className={className}>{text}</Tag>
    </motion.div>
  )
}

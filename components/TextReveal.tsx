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
    offset: ['start 0.85', 'center 0.35'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.55, 1], [0, 0.15, 1, 1])
  const y = useTransform(scrollYProgress, [0, 1], [50, 0])
  const blur = useTransform(scrollYProgress, [0, 0.35, 1], ['blur(12px)', 'blur(3px)', 'blur(0px)'])
  const letterSpacing = useTransform(scrollYProgress, [0, 1], ['0.06em', '0.02em'])
  const scale = useTransform(scrollYProgress, [0, 0.4, 1], [0.97, 1.005, 1])

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

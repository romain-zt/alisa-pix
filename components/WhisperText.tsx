'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface WhisperTextProps {
  text: string
  className?: string
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
}

export default function WhisperText({ text, className = '', tag = 'p' }: WhisperTextProps) {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'center 0.45'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.4, 1], [0, 0.6, 1])
  const y = useTransform(scrollYProgress, [0, 1], [24, 0])

  const Tag = tag

  return (
    <motion.div ref={ref} style={{ opacity, y }}>
      <Tag className={className}>{text}</Tag>
    </motion.div>
  )
}

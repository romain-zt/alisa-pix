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
    offset: ['start 0.9', 'start 0.4'],
  })

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1])
  const y = useTransform(scrollYProgress, [0, 1], [40, 0])
  const blur = useTransform(scrollYProgress, [0, 0.6, 1], ['blur(8px)', 'blur(2px)', 'blur(0px)'])

  const Tag = tag

  return (
    <motion.div ref={ref} style={{ opacity, y, filter: blur }}>
      <Tag className={className}>{text}</Tag>
    </motion.div>
  )
}

'use client'

import { useRef, type ReactNode } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function DeepReveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start 0.25'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 0.2, 0.8, 1])
  const y = useTransform(scrollYProgress, [0, 1], [30, 0])
  const blur = useTransform(scrollYProgress, [0, 0.6, 1], ['blur(6px)', 'blur(2px)', 'blur(0px)'])

  return (
    <motion.div ref={ref} className={className} style={{ opacity, y, filter: blur }}>
      {children}
    </motion.div>
  )
}

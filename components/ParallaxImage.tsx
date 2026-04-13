'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import ProtectedImage from './ProtectedImage'

interface ParallaxImageProps {
  src: string
  alt?: string
  className?: string
  speed?: number
}

export default function ParallaxImage({
  src,
  alt = '',
  className = '',
  speed = 0.3,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [`-${speed * 100}%`, `${speed * 100}%`])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1.05, 1.1])

  // Image "awakens" as it scrolls into view
  const brightness = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0.5, 1, 1, 0.6])
  const filterVal = useTransform(brightness, (v) => `brightness(${v})`)

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        style={{ y, scale, filter: filterVal, willChange: 'transform, filter' }}
        className="w-full h-full"
      >
        <ProtectedImage src={src} alt={alt} className="w-full h-full" />
      </motion.div>
    </div>
  )
}

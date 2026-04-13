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

  const y = useTransform(scrollYProgress, [0, 1], [`-${speed * 80}%`, `${speed * 80}%`])

  // Center focus: zoom in when centered, zoom out when leaving
  const scale = useTransform(scrollYProgress, [0, 0.35, 0.5, 0.65, 1], [0.95, 1.02, 1.05, 1.02, 0.95])

  const brightness = useTransform(scrollYProgress, [0, 0.3, 0.5, 0.7, 1], [0.4, 0.9, 1, 0.9, 0.4])
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

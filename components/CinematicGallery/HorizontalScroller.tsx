'use client'

import { useRef, type ReactNode } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface HorizontalScrollerProps {
  children: ReactNode
  slideCount: number
  className?: string
}

export default function HorizontalScroller({ children, slideCount, className = '' }: HorizontalScrollerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const x = useTransform(scrollYProgress, [0, 1], ['0%', `-${(slideCount - 1) * 100}%`])

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{ height: `${slideCount * 100}vh` }}
    >
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        <motion.div
          className="flex h-full"
          style={{
            x,
            width: `${slideCount * 100}%`,
            willChange: 'transform',
          }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  )
}

'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import GalleryCanvas from './GalleryCanvas'
import type { GallerySlideProps } from './types'

export default function GallerySlide({
  image,
  index,
  total,
  isActive,
  showCounter = true,
}: GallerySlideProps) {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start start', 'end start', 'end end'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [1.06, 1, 1, 1.06])

  const counterText = `${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`

  return (
    <motion.div
      ref={ref}
      data-slide-index={index}
      className="relative h-[100dvh] w-full overflow-hidden flex-shrink-0"
      style={{ opacity }}
    >
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={{ scale }}
      >
        <GalleryCanvas
          src={image.src}
          alt={image.alt || ''}
          className="w-full h-full"
          active={isActive}
        />
      </motion.div>

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)',
        }}
      />

      {/* Bottom UI */}
      <div className="absolute bottom-0 inset-x-0 p-6 md:p-10 z-10">
        <div className="flex items-end justify-between">
          {image.caption ? (
            <span className="font-serif text-sm md:text-base text-off-white/70 italic tracking-wide">
              {image.caption}
            </span>
          ) : (
            <span />
          )}
          {showCounter && (
            <span className="font-sans text-xs md:text-sm tracking-[0.25em] text-off-white/40 tabular-nums">
              {counterText}
            </span>
          )}
        </div>
        <div className="mt-4 h-px w-full bg-off-white/10" />
      </div>
    </motion.div>
  )
}

'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import GalleryCanvas from './GalleryCanvas'
import GrainOverlay from './GrainOverlay'
import type { GallerySlideProps } from './types'
import { useSlideEntrance } from './useGalleryAnimations'

export default function GallerySlide({
  image,
  index,
  total,
  isActive,
  grain = true,
  showCounter = true,
}: GallerySlideProps) {
  const ref = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const captionRef = useRef<HTMLSpanElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start start', 'end start', 'end end'],
  })

  // Enter → presence → exit
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [0, 1, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [1.15, 1.02, 1.02, 1.15])
  // Ken Burns
  const slowZoom = useTransform(scrollYProgress, [0.2, 0.8], [1, 1.06])

  // Micro-rotation — imperfection = life
  const rotate = useTransform(scrollYProgress, [0, 0.5, 1], [-0.8, 0, 0.8])

  // Brightness awakening — combined into a single scroll-driven filter string
  const combinedFilter = useTransform(
    scrollYProgress,
    [0, 0.2, 0.3, 0.5, 0.7, 0.8, 1],
    [
      'blur(12px) brightness(0.5)',
      'blur(0px) brightness(0.8)',
      'blur(0px) brightness(1)',
      'blur(0px) brightness(1)',
      'blur(0px) brightness(1)',
      'blur(0px) brightness(0.8)',
      'blur(12px) brightness(0.5)',
    ]
  )

  useSlideEntrance(isActive, counterRef, captionRef)

  const counterText = `${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`

  return (
    <motion.div
      ref={ref}
      data-slide-index={index}
      className="relative h-[100dvh] w-full overflow-hidden flex-shrink-0"
      style={{ opacity }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          scale,
          rotate,
          filter: combinedFilter,
          willChange: 'transform, filter',
        }}
      >
        <motion.div className="w-full h-full" style={{ scale: slowZoom }}>
          <GalleryCanvas
            src={image.src}
            alt={image.alt || ''}
            className="w-full h-full"
            active={isActive}
          />
        </motion.div>
      </motion.div>

      {grain && (
        <GrainOverlay intensity={isActive ? 0.05 : 0.03} />
      )}

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
        }}
      />

      {/* Bottom UI */}
      <div className="absolute bottom-0 inset-x-0 p-6 md:p-10 z-10">
        <div className="flex items-end justify-between">
          {image.caption ? (
            <span
              ref={captionRef}
              className="font-serif text-sm md:text-base text-off-white/70 italic tracking-wide opacity-0"
            >
              {image.caption}
            </span>
          ) : (
            <span />
          )}
          {showCounter && (
            <span
              ref={counterRef}
              className="font-sans text-xs md:text-sm tracking-[0.25em] text-off-white/40 tabular-nums opacity-0"
            >
              {counterText}
            </span>
          )}
        </div>
        <div className="mt-4 h-px w-full bg-off-white/10" />
      </div>
    </motion.div>
  )
}

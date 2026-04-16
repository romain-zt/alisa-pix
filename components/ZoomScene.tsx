'use client'

import Image from 'next/image'
import { useCallback } from 'react'
import { useSectionProgress, useSectionStyle } from '@/hooks/useSectionProgress'

interface ZoomSceneProps {
  src: string
  text?: string
}

export function ZoomScene({ src, text = 'too close' }: ZoomSceneProps) {
  const { ref: sectionRef, progress } = useSectionProgress<HTMLDivElement>()

  // Image: starts at 30% scale, fills frame, then keeps growing past edges
  const imgStyler = useCallback((p: number) => {
    const scale = 0.28 + p * 1.3
    const opacity = p < 0.04 ? p / 0.04 : 1
    return {
      transform: `scale(${scale})`,
      opacity: `${opacity}`,
    }
  }, [])
  const imgRef = useSectionStyle<HTMLDivElement>(imgStyler)

  // Text: appears early, destroyed as image takes over
  const textOpacity =
    progress < 0.12
      ? progress / 0.12
      : progress > 0.38
        ? Math.max(0, 1 - (progress - 0.38) / 0.18)
        : 1

  // Vignette tightens as image fills
  const vignetteOpacity = Math.min(1, progress * 2.5)

  return (
    <div
      ref={sectionRef}
      className="relative h-[320vh]"
      style={{ background: 'var(--color-bg-deep)' }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden flex items-center justify-center">

        {/* The zooming image */}
        <div
          ref={imgRef}
          className="absolute inset-0"
          style={{ opacity: 0, willChange: 'transform, opacity' }}
        >
          <Image
            src={src}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>

        {/* Vignette — dark edges tighten as you zoom in */}
        <div
          className="absolute inset-0 z-[2] pointer-events-none"
          style={{
            opacity: vignetteOpacity,
            background:
              'radial-gradient(ellipse 55% 50% at 50% 50%, transparent 0%, rgba(10,9,8,0.65) 55%, rgba(10,9,8,0.98) 100%)',
          }}
        />

        {/* Text — center, dissolves as image overwhelms */}
        {text && (
          <p
            className="relative z-[3] font-serif italic text-[var(--text-lead)] md:text-[var(--text-title)] text-white/55 select-none text-center px-8 pointer-events-none"
            style={{ opacity: textOpacity }}
            aria-hidden="true"
          >
            {text}
          </p>
        )}
      </div>
    </div>
  )
}

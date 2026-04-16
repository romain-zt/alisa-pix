'use client'

import { useCallback } from 'react'
import Image from 'next/image'
import { useSectionProgress, useSectionStyle } from '@/hooks/useSectionProgress'

interface SplitTensionProps {
  src: string
  text: string
}

export function SplitTension({ src, text }: SplitTensionProps) {
  const { ref: sectionRef, progress } = useSectionProgress<HTMLElement>()

  // Gas layer — blurred, slow opposite drift
  const gasStyler = useCallback((p: number) => {
    const y = -15 + p * 30
    const x = 12 - p * 24
    const opacity = p < 0.1 ? p / 0.1 * 0.12 : p > 0.88 ? (1 - p) / 0.12 * 0.12 : 0.12
    return {
      transform: `translate3d(${x}px, ${y}px, 0) scale(1.3)`,
      opacity: `${opacity}`,
    }
  }, [])
  const gasRef = useSectionStyle<HTMLDivElement>(gasStyler)

  // Image subject — slow zoom
  const imageStyler = useCallback((p: number) => {
    const scale = 1.0 + p * 0.06
    return { transform: `scale(${scale})` }
  }, [])
  const imageRef = useSectionStyle<HTMLDivElement>(imageStyler)

  // Liquid light — warm glow in the void, moves across with scroll
  const lightStyler = useCallback((p: number) => {
    const y = 20 - p * 40
    const intensity = p > 0.12 && p < 0.9
      ? Math.min(0.06, Math.sin((p - 0.12) / 0.78 * Math.PI) * 0.06)
      : 0
    return {
      opacity: `${intensity}`,
      transform: `translate3d(0, ${y}px, 0)`,
    }
  }, [])
  const lightRef = useSectionStyle<HTMLDivElement>(lightStyler)

  const textOpacity =
    progress > 0.2 && progress < 0.85
      ? Math.min(1, (progress - 0.2) * 1.54)
      : progress >= 0.85
        ? (1 - progress) * 6.67
        : 0

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[80vh] md:min-h-[100vh] md:grid md:grid-cols-10 overflow-hidden"
      style={{ background: '#050504' }}
    >
      {/* Gas layer — blurred image behind everything */}
      <div
        ref={gasRef}
        className="absolute inset-[-30%] z-[0] opacity-0"
      >
        <Image
          src={src}
          alt=""
          fill
          className="object-cover blur-[16px]"
          sizes="160vw"
        />
      </div>

      {/* Subject — 70% with bleed into void */}
      <div className="relative h-[55vh] md:h-full md:col-span-7 z-[1] overflow-hidden md:overflow-visible">
        <div
          ref={imageRef}
          className="absolute inset-0 md:right-[-8%]"
        >
          <Image
            src={src}
            alt=""
            fill
            className="object-cover"
            sizes="(min-width: 768px) 78vw, 100vw"
          />
          {/* Optical vignette on the image edges */}
          <div className="lens-vignette-soft absolute inset-0" />
          {/* Soft bleed edge — desktop only */}
          <div
            className="hidden md:block absolute inset-y-0 right-0 w-[22%] pointer-events-none z-[1]"
            style={{
              background: 'linear-gradient(to right, transparent, #050504)',
            }}
          />
        </div>
      </div>

      {/* Void — 30%, text and light live here */}
      <div className="md:col-span-3 md:col-start-8 relative flex items-center px-8 py-16 md:py-0 md:pl-4 md:pr-[4vw] z-[2]">
        {/* Liquid light — warm amber glow, moves vertically */}
        <div
          ref={lightRef}
          className="absolute inset-0 pointer-events-none opacity-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 40% 50%, rgba(196,168,138,0.08) 0%, rgba(196,168,138,0.03) 50%, transparent 80%)',
          }}
        />

        {/* Interference — shimmer on the void surface */}
        <div
          className="absolute inset-0 pointer-events-none shimmer-slow"
          style={{
            background:
              'linear-gradient(to bottom, transparent 20%, rgba(255,248,235,0.02) 50%, transparent 80%)',
          }}
        />

        <p
          className="relative font-serif italic text-[var(--text-lead)] md:text-[var(--text-title)] text-text-primary/50 select-none leading-snug"
          style={{ opacity: textOpacity }}
        >
          {text}
        </p>
      </div>
    </section>
  )
}

'use client'

import { useCallback } from 'react'
import Image from 'next/image'
import { useSectionProgress, useSectionStyle } from '@/hooks/useSectionProgress'

interface DepthSceneProps {
  atmosphereSrc: string
  mainSrc: string
  label?: string
}

export function DepthScene({ atmosphereSrc, mainSrc, label }: DepthSceneProps) {
  const { ref: sectionRef, progress } = useSectionProgress<HTMLElement>()

  // Background: drifts UP (opposed to scroll direction), fades in then out
  const bgStyler = useCallback((p: number) => {
    const y = 60 - p * 120
    const opacity = p < 0.2 ? p * 5 * 0.3 : p > 0.8 ? (1 - p) * 5 * 0.3 : 0.3
    return {
      transform: `translate3d(0, ${y}px, 0) scale(1.15)`,
      opacity: `${opacity}`,
    }
  }, [])
  const bgRef = useSectionStyle<HTMLDivElement>(bgStyler)

  // Main image: slow zoom IN from 1.0 → 1.04 + slight upward drift
  const mainStyler = useCallback((p: number) => {
    const scale = 1.0 + p * 0.04
    const y = 30 - p * 60
    return {
      transform: `translate3d(0, ${y}px, 0) scale(${scale})`,
    }
  }, [])
  const mainRef = useSectionStyle<HTMLDivElement>(mainStyler)

  // Foreground label: moves OPPOSITE to main (downward while main goes up)
  const fgStyler = useCallback((p: number) => {
    const y = -20 + p * 50
    const opacity = p < 0.15 ? p / 0.15 : p > 0.85 ? (1 - p) / 0.15 : 1
    return {
      transform: `translate3d(0, ${y}px, 0)`,
      opacity: `${Math.min(0.7, opacity * 0.7)}`,
    }
  }, [])
  const fgRef = useSectionStyle<HTMLDivElement>(fgStyler)

  // Emotional puncture text: independent rhythm, appears mid-scroll
  const punctureOpacity = progress > 0.3 && progress < 0.7
    ? Math.min(0.45, (progress - 0.3) * 2.25)
    : progress >= 0.7
      ? Math.max(0, 0.45 - (progress - 0.7) * 1.5)
      : 0

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[160vh] md:min-h-[180vh] overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, var(--color-tone-silk), var(--color-tone-shadow) 80%, var(--color-tone-shadow))',
      }}
    >
      {/* Layer 1 — Background: opposed vertical drift, blurred, dim */}
      <div
        ref={bgRef}
        className="absolute inset-[-20%] z-[1]"
      >
        <Image
          src={atmosphereSrc}
          alt=""
          fill
          className="object-cover blur-[5px]"
          sizes="140vw"
        />
      </div>

      {/* Layer 2 — Main image: zoom IN on scroll, asymmetric */}
      <div className="relative z-10 pt-[14vh] md:pt-[20vh]">
        <div
          ref={mainRef}
          className="
            w-[90%] -ml-3
            md:w-[50vw] md:ml-[7vw]
          "
        >
          <div className="relative aspect-[3/4] overflow-hidden">
            <Image
              src={mainSrc}
              alt=""
              fill
              className="object-cover"
              sizes="(min-width: 768px) 50vw, 90vw"
            />
            {/* Bottom fade — scene bleeds into next */}
            <div className="absolute bottom-0 left-0 right-0 h-[15%] bg-gradient-to-t from-tone-shadow/60 to-transparent" />
          </div>
        </div>
      </div>

      {/* Emotional puncture — NOT a caption, placed independently */}
      <span
        className="absolute z-30
          left-[12%] bottom-[32vh]
          md:left-[62vw] md:bottom-[38vh]
          font-serif italic text-[var(--text-title)] text-text-muted select-none pointer-events-none"
        style={{
          opacity: punctureOpacity,
          transform: `translate3d(0, ${(0.5 - progress) * 20}px, 0)`,
        }}
      >
        stay
      </span>

      {/* Layer 3 — Foreground label: moves opposite to main image */}
      {label && (
        <div
          ref={fgRef}
          className="
            absolute z-20
            bottom-[8vh] right-6
            md:bottom-[14vh] md:right-[9vw]
            flex items-center gap-3
          "
        >
          <div className="w-6 h-px bg-accent-soft" />
          <p className="text-[var(--text-micro)] tracking-[0.3em] uppercase text-text-muted">
            {label}
          </p>
        </div>
      )}
    </section>
  )
}

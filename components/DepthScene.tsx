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

  // Background: horizontal drift (not just vertical) + vertical opposed motion
  const bgStyler = useCallback((p: number) => {
    const y = 80 - p * 160
    const x = -15 + p * 30
    const opacity = p < 0.15 ? p / 0.15 * 0.35 : p > 0.8 ? (1 - p) * 5 * 0.35 : 0.35
    return {
      transform: `translate3d(${x}px, ${y}px, 0) scale(1.2)`,
      opacity: `${opacity}`,
    }
  }, [])
  const bgRef = useSectionStyle<HTMLDivElement>(bgStyler)

  // Main image: zoom IN from 0.97 → 1.06 (starts slightly small — reveals growing)
  const mainStyler = useCallback((p: number) => {
    const scale = 0.97 + p * 0.09
    const y = 40 - p * 80
    return {
      transform: `translate3d(0, ${y}px, 0) scale(${scale})`,
    }
  }, [])
  const mainRef = useSectionStyle<HTMLDivElement>(mainStyler)

  // Foreground label: counter-direction, drifts right + down
  const fgStyler = useCallback((p: number) => {
    const y = -25 + p * 60
    const x = -5 + p * 15
    const opacity = p < 0.12 ? p / 0.12 : p > 0.85 ? (1 - p) / 0.15 : 1
    return {
      transform: `translate3d(${x}px, ${y}px, 0)`,
      opacity: `${Math.min(0.65, opacity * 0.65)}`,
    }
  }, [])
  const fgRef = useSectionStyle<HTMLDivElement>(fgStyler)

  // Puncture: "stay" — appears early-mid, drifts diagonally
  const p1Opacity = progress > 0.2 && progress < 0.55
    ? Math.min(0.5, (progress - 0.2) * 1.43)
    : progress >= 0.55
      ? Math.max(0, 0.5 - (progress - 0.55) * 1.11)
      : 0

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[180vh] md:min-h-[210vh] overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, var(--color-tone-silk), var(--color-tone-shadow) 70%, var(--color-tone-shadow))',
      }}
    >
      {/* Layer 1 — Background: horizontal + vertical drift, blurred, warm */}
      <div
        ref={bgRef}
        className="absolute inset-[-25%] z-[1]"
      >
        <Image
          src={atmosphereSrc}
          alt=""
          fill
          className="object-cover blur-[6px]"
          sizes="150vw"
        />
      </div>

      {/* Layer 2 — Main image: zoom IN, bleeds left edge, soft bottom mask */}
      <div className="relative z-10 pt-[10vh] md:pt-[16vh]">
        <div
          ref={mainRef}
          className="
            w-[95%] -ml-6
            md:w-[52vw] md:-ml-[2vw]
          "
        >
          <div className="relative aspect-[3/4] overflow-hidden mask-soft-bottom">
            <Image
              src={mainSrc}
              alt=""
              fill
              className="object-cover"
              sizes="(min-width: 768px) 52vw, 95vw"
            />
          </div>
        </div>
      </div>

      {/* Puncture — "stay": serif italic, diagonal drift */}
      <span
        className="absolute z-30
          left-[10%] bottom-[35vh]
          md:left-[60vw] md:bottom-[42vh]
          font-serif italic text-[var(--text-title)] text-text-muted select-none pointer-events-none"
        style={{
          opacity: p1Opacity,
          transform: `translate3d(${(0.4 - progress) * 25}px, ${(0.4 - progress) * 15}px, 0)`,
        }}
      >
        stay
      </span>

      {/* Layer 3 — Foreground label: counter-drift, right side */}
      {label && (
        <div
          ref={fgRef}
          className="
            absolute z-20
            bottom-[6vh] right-6
            md:bottom-[12vh] md:right-[8vw]
            flex items-center gap-3
          "
        >
          <div className="w-8 h-px bg-accent-soft" />
          <p className="text-[var(--text-micro)] tracking-[0.3em] uppercase text-text-muted">
            {label}
          </p>
        </div>
      )}
    </section>
  )
}

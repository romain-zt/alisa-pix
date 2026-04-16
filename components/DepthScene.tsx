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

  const bgStyler = useCallback((p: number) => {
    const curved = Math.pow(p, 1.4)
    const y = 90 - curved * 180
    const x = -20 + Math.sin(p * Math.PI) * 25
    const rotation = -0.8 + p * 1.6
    const opacity = p < 0.12 ? p / 0.12 * 0.32 : p > 0.82 ? (1 - p) / 0.18 * 0.32 : 0.32
    return {
      transform: `translate3d(${x}px, ${y}px, 0) scale(1.25) rotate(${rotation}deg)`,
      opacity: `${opacity}`,
    }
  }, [])
  const bgRef = useSectionStyle<HTMLDivElement>(bgStyler)

  const mainStyler = useCallback((p: number) => {
    const scale = 0.95 + Math.pow(p, 0.7) * 0.11
    const y = 50 - Math.pow(p, 1.3) * 100
    return {
      transform: `translate3d(0, ${y}px, 0) scale(${scale})`,
    }
  }, [])
  const mainRef = useSectionStyle<HTMLDivElement>(mainStyler)

  const fgStyler = useCallback((p: number) => {
    const y = -30 + Math.pow(p, 0.6) * 70
    const x = -8 + p * 20
    const opacity = p < 0.15 ? Math.pow(p / 0.15, 2) : p > 0.82 ? Math.pow((1 - p) / 0.18, 0.5) : 1
    return {
      transform: `translate3d(${x}px, ${y}px, 0)`,
      opacity: `${Math.min(0.6, opacity * 0.6)}`,
    }
  }, [])
  const fgRef = useSectionStyle<HTMLDivElement>(fgStyler)

  const lightStyler = useCallback((p: number) => {
    const x = 20 + Math.sin(p * Math.PI * 1.3) * 20
    const y = 25 + p * 25
    const intensity = p > 0.08 && p < 0.85
      ? Math.min(0.07, Math.sin((p - 0.08) / 0.77 * Math.PI) * 0.07)
      : 0
    return {
      opacity: `${intensity}`,
      transform: `translate3d(${x - 30}px, ${y - 30}px, 0)`,
    }
  }, [])
  const lightRef = useSectionStyle<HTMLDivElement>(lightStyler)

  const punctureOpacity = progress > 0.18 && progress < 0.5
    ? Math.min(0.55, Math.pow((progress - 0.18) / 0.32, 0.6) * 0.55)
    : progress >= 0.5 && progress < 0.7
      ? 0.55 * Math.pow(1 - (progress - 0.5) / 0.2, 1.8)
      : 0

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[185vh] md:min-h-[215vh] overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, var(--color-tone-silk), var(--color-tone-shadow) 65%, var(--color-tone-shadow))',
      }}
    >
      {/* Layer 1 — Background: drift + rotation, blurred */}
      <div
        ref={bgRef}
        className="absolute inset-[-28%] z-[1]"
      >
        <Image
          src={atmosphereSrc}
          alt=""
          fill
          className="object-cover blur-[8px]"
          sizes="156vw"
        />
      </div>

      {/* Layer 2 — Liquid light: moves independently from everything */}
      <div
        ref={lightRef}
        className="absolute inset-0 z-[5] pointer-events-none opacity-0"
        style={{
          background:
            'radial-gradient(ellipse 50% 45% at 35% 30%, rgba(255,242,220,0.12) 0%, transparent 50%)',
        }}
      />

      {/* Layer 3 — Main image: non-linear zoom, bleeds left */}
      <div className="relative z-10 pt-[11vh] md:pt-[17vh]">
        <div
          ref={mainRef}
          className="
            w-[96%] -ml-6
            md:w-[54vw] md:-ml-[3vw]
          "
        >
          <div className="relative aspect-[3/4] overflow-hidden mask-soft-bottom lens-vignette-soft">
            <Image
              src={mainSrc}
              alt=""
              fill
              className="object-cover"
              sizes="(min-width: 768px) 54vw, 96vw"
            />
          </div>
        </div>
      </div>

      {/* Puncture — "stay": power-curved entry, diagonal drift */}
      <span
        className="absolute z-30
          left-[8%] bottom-[33vh]
          md:left-[58vw] md:bottom-[40vh]
          font-serif italic text-[var(--text-display)] text-text-muted select-none pointer-events-none"
        style={{
          opacity: punctureOpacity,
          transform: `translate3d(${(0.35 - progress) * 30}px, ${(0.35 - progress) * 18}px, 0) rotate(${(0.35 - progress) * -2}deg)`,
        }}
      >
        stay
      </span>

      {/* Interference — shimmer reflection, diagonal slow breathe */}
      <div
        className="absolute inset-0 z-[6] pointer-events-none shimmer-slow"
        style={{
          background:
            'linear-gradient(155deg, rgba(255,252,242,0.025) 0%, transparent 35%, rgba(196,168,138,0.015) 65%, transparent 100%)',
        }}
      />

      {/* Layer 4 — Foreground label: counter-drift */}
      {label && (
        <div
          ref={fgRef}
          className="
            absolute z-20
            bottom-[5vh] right-6
            md:bottom-[10vh] md:right-[7vw]
            flex items-center gap-3
          "
        >
          <div className="w-10 h-px bg-accent-soft" />
          <p className="text-[var(--text-micro)] tracking-[0.35em] uppercase text-text-muted">
            {label}
          </p>
        </div>
      )}
    </section>
  )
}

'use client'

import { useCallback } from 'react'
import Image from 'next/image'
import { useSectionProgress, useSectionStyle } from '@/hooks/useSectionProgress'

export function SessionGate() {
  const { ref, progress } = useSectionProgress<HTMLElement>()

  // Background image: very slow drift, stays dim
  const bgStyler = useCallback((p: number) => {
    const y = 20 - p * 40
    const opacity = p > 0.1 ? Math.min(0.12, (p - 0.1) * 0.16) : 0
    return {
      transform: `translate3d(0, ${y}px, 0) scale(1.15)`,
      opacity: `${opacity}`,
    }
  }, [])
  const bgRef = useSectionStyle<HTMLDivElement>(bgStyler)

  const contentOpacity = progress > 0.15
    ? Math.min(1, (progress - 0.15) * 1.5)
    : 0

  const lineScale = progress > 0.25
    ? Math.min(1, (progress - 0.25) * 2)
    : 0

  const labelX = 12 - progress * 18

  return (
    <section
      ref={ref}
      id="sessions"
      className="relative min-h-[90vh] md:min-h-[100vh] flex items-center overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, var(--color-tone-shadow), var(--color-bg-deep) 40%, var(--color-bg-deep))',
      }}
    >
      {/* Atmospheric background — very dim image for depth */}
      <div
        ref={bgRef}
        className="absolute inset-[-15%] z-[1] opacity-0"
      >
        <Image
          src="/assets/images/boudoir/IMG_7550.jpeg"
          alt=""
          fill
          className="object-cover blur-[12px]"
          sizes="130vw"
        />
      </div>

      {/* Warm radial glow */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 30% 40% at 20% 55%, rgba(196,168,138,${
            progress > 0.2 ? Math.min(0.04, (progress - 0.2) * 0.06) : 0
          }), transparent 70%)`,
        }}
      />

      <div
        className="relative z-10 px-6 md:px-16 lg:px-24 w-full"
        style={{
          opacity: contentOpacity,
          transform: `translate3d(${labelX}px, 0, 0)`,
        }}
      >
        <div className="max-w-md">
          <p className="text-[var(--text-micro)] tracking-[0.35em] uppercase text-text-muted/60 mb-10">
            Private sessions
          </p>

          <div
            className="w-10 h-px bg-accent-soft/50 mb-10"
            style={{
              transform: `scaleX(${lineScale})`,
              transformOrigin: 'left center',
            }}
          />

          <h2 className="font-serif font-light text-[var(--text-display)] text-text-primary leading-[1.1] mb-8">
            By appointment<br />
            <span className="text-text-muted/70">only</span>
          </h2>

          <p className="text-[var(--text-caption)] text-text-muted/50 leading-relaxed mb-2">
            Boudoir sessions in Paris
          </p>
          <p className="text-[var(--text-caption)] text-text-muted/50 leading-relaxed mb-14">
            Starting from €480
          </p>

          <a
            href="mailto:hello@vasilisa.com"
            className="inline-flex items-center gap-4 group min-h-[44px]"
          >
            <span className="text-[var(--text-caption)] tracking-[0.2em] uppercase text-accent/80 transition-all duration-700 group-hover:text-accent group-hover:tracking-[0.25em]">
              Request access
            </span>
            <span className="w-8 h-px bg-accent/40 transition-all duration-700 origin-left group-hover:w-12 group-hover:bg-accent/70" />
          </a>
        </div>
      </div>
    </section>
  )
}

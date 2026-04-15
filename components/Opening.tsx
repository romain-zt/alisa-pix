'use client'

import { useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { createTimeline } from 'animejs'
import { useSectionProgress, useSectionStyle } from '@/hooks/useSectionProgress'

export function Opening({ src }: { src: string }) {
  const containerRef = useRef<HTMLElement>(null)
  const hasPlayed = useRef(false)

  const { ref: sectionRef, progress } = useSectionProgress<HTMLElement>()

  // Dramatic zoom OUT: 1.2 → 1.0
  const scrollScale = 1.2 - progress * 0.2
  // Opacity: low luminance that fades at the end
  const scrollOpacity = progress < 0.8 ? 0.35 : 0.35 - (progress - 0.8) * 1.75
  // Brand drifts upward slowly
  const brandShift = Math.min(progress * 60, 50)
  const brandOpacity = progress < 0.85 ? 1 : Math.max(0, (1 - progress) * 6.67)

  // Background depth plane — opposed, atmospheric
  const bgStyler = useCallback((p: number) => {
    const y = 40 - p * 80
    const scale = 1.35 - p * 0.05
    return {
      transform: `translate3d(0, ${y}px, 0) scale(${scale})`,
      opacity: `${p < 0.1 ? p * 10 * 0.12 : p > 0.8 ? (1 - p) * 5 * 0.12 : 0.12}`,
    }
  }, [])
  const bgRef = useSectionStyle<HTMLDivElement>(bgStyler)

  // Puncture "closer": drifts horizontally
  const punctureOpacity = progress > 0.12 && progress < 0.5
    ? Math.min(0.5, (progress - 0.12) * 1.32)
    : progress >= 0.5
      ? Math.max(0, 0.5 - (progress - 0.5) * 1)
      : 0
  const punctureX = -25 + progress * 50

  // Second puncture "not yet": opposed timing
  const p2Opacity = progress > 0.35 && progress < 0.65
    ? Math.min(0.3, (progress - 0.35) * 1)
    : progress >= 0.65
      ? Math.max(0, 0.3 - (progress - 0.65) * 0.86)
      : 0

  // Intro timeline
  useEffect(() => {
    if (!containerRef.current || hasPlayed.current) return
    hasPlayed.current = true

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) {
      const img = containerRef.current.querySelector('.threshold-image') as HTMLElement
      const brand = containerRef.current.querySelector('.threshold-brand') as HTMLElement
      if (img) img.style.opacity = '0.35'
      if (brand) brand.style.opacity = '1'
      return
    }

    const imgEl = containerRef.current.querySelector('.threshold-image') as HTMLElement
    const brandEl = containerRef.current.querySelector('.threshold-brand') as HTMLElement
    const punctureEl = containerRef.current.querySelector('.threshold-puncture') as HTMLElement
    const bgEl = containerRef.current.querySelector('.threshold-bg') as HTMLElement
    const veilEl = containerRef.current.querySelector('.threshold-veil') as HTMLElement

    const tl = createTimeline({
      defaults: {
        ease: 'cubicBezier(0.16, 1, 0.3, 1)',
      },
    })

    // Veil lifts first — pure darkness recedes
    tl.add(veilEl, {
      opacity: [1, 0],
      duration: 2800,
    }, 0)
    // Background atmosphere emerges slowly
    .add(bgEl, {
      opacity: [0, 0.12],
      scale: [1.4, 1.35],
      duration: 3500,
    }, 400)
    // Main image: from deep darkness, slow reveal
    .add(imgEl, {
      opacity: [0, 0.35],
      scale: [1.25, 1.2],
      duration: 3200,
    }, 1200)
    // Puncture drifts in from left
    .add(punctureEl, {
      opacity: [0, 0.5],
      translateX: [-40, 0],
      duration: 2000,
    }, 2800)
    // Brand enters last — the signature
    .add(brandEl, {
      opacity: [0, 1],
      translateX: [-15, 0],
      duration: 1800,
    }, 3200)
  }, [])

  return (
    <section
      ref={(node) => {
        (containerRef as React.MutableRefObject<HTMLElement | null>).current = node
        ;(sectionRef as React.MutableRefObject<HTMLElement | null>).current = node
      }}
      className="relative h-[300svh]"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Darkness veil — the first thing that lifts */}
        <div
          className="threshold-veil absolute inset-0 z-[5] bg-bg-deep pointer-events-none"
        />

        {/* Background depth plane */}
        <div
          ref={bgRef}
          className="threshold-bg absolute inset-[-30%] z-[1] opacity-0"
        >
          <Image
            src={src}
            alt=""
            fill
            className="object-cover blur-[10px]"
            sizes="160vw"
          />
        </div>

        {/* Main image — dramatic zoom OUT, vignetted */}
        <div
          className="threshold-image absolute inset-0 z-[2] opacity-0"
          style={{
            transform: `scale(${scrollScale})`,
            opacity: Math.max(0, scrollOpacity),
          }}
        >
          <Image
            src={src}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          {/* Deep vignette — tighter, more dramatic */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 55% 45% at 50% 48%, transparent 0%, rgba(10,9,8,0.55) 45%, rgba(10,9,8,0.95) 100%)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-deep via-transparent to-bg-deep/70" />
        </div>

        {/* Puncture "closer" */}
        <span
          className="threshold-puncture absolute z-20 opacity-0
            top-[30vh] right-6
            md:top-[24vh] md:right-[12vw]
            font-serif italic text-[var(--text-display)] text-text-muted/15 select-none pointer-events-none"
          style={{
            opacity: punctureOpacity,
            transform: `translate3d(${punctureX}px, ${progress * -25}px, 0)`,
          }}
        >
          closer
        </span>

        {/* Puncture "not yet" — smaller, opposed, later */}
        <span
          className="absolute z-20 select-none pointer-events-none
            bottom-[30vh] left-6
            md:bottom-[34vh] md:left-[8vw]
            text-[var(--text-micro)] tracking-[0.45em] uppercase text-text-muted/10"
          style={{
            opacity: p2Opacity,
            transform: `translate3d(${-12 + progress * 24}px, 0, 0)`,
          }}
        >
          not yet
        </span>

        {/* Brand — enters last, drifts up on scroll */}
        <div
          className="threshold-brand opacity-0 absolute z-10 bottom-0 left-0
            pb-12 md:pb-16 pl-6 md:pl-10"
          style={{
            transform: `translate3d(0, ${-brandShift}px, 0)`,
            opacity: brandOpacity,
          }}
        >
          <p className="text-[var(--text-micro)] tracking-[0.35em] uppercase text-text-muted/60">
            Vasilisa
          </p>
        </div>
      </div>
    </section>
  )
}

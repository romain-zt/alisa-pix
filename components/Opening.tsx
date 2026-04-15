'use client'

import { useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { createTimeline } from 'animejs'
import { useSectionProgress, useSectionStyle } from '@/hooks/useSectionProgress'

export function Opening({ src }: { src: string }) {
  const containerRef = useRef<HTMLElement>(null)
  const hasPlayed = useRef(false)

  const { ref: sectionRef, progress } = useSectionProgress<HTMLElement>()

  // Dramatic zoom OUT: 1.18 → 1.0 — the world pulls back slowly
  const scrollScale = 1.18 - progress * 0.18
  // Held presence: opacity stays low and warm, fades only at the very end
  const scrollOpacity = progress < 0.75 ? 0.3 : 0.3 - (progress - 0.75) * 1.2
  // Brand drifts upward with scroll — slow departure
  const brandShift = Math.min(progress * 50, 40)

  // Background depth plane — moves at 0.4x speed (opposed, stays behind)
  const bgStyler = useCallback((p: number) => {
    const y = 30 - p * 60
    const scale = 1.3 - p * 0.05
    return {
      transform: `translate3d(0, ${y}px, 0) scale(${scale})`,
      opacity: `${p < 0.1 ? p * 10 * 0.15 : p > 0.8 ? (1 - p) * 5 * 0.15 : 0.15}`,
    }
  }, [])
  const bgRef = useSectionStyle<HTMLDivElement>(bgStyler)

  // Puncture word — drifts horizontally, independent of everything else
  const punctureProgress = progress
  const punctureOpacity = punctureProgress > 0.15 && punctureProgress < 0.55
    ? Math.min(0.6, (punctureProgress - 0.15) * 1.5)
    : punctureProgress >= 0.55
      ? Math.max(0, 0.6 - (punctureProgress - 0.55) * 1.33)
      : 0
  const punctureX = -20 + progress * 40

  useEffect(() => {
    if (!containerRef.current || hasPlayed.current) return
    hasPlayed.current = true

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) {
      const img = containerRef.current.querySelector('.threshold-image') as HTMLElement
      const brand = containerRef.current.querySelector('.threshold-brand') as HTMLElement
      if (img) img.style.opacity = '0.3'
      if (brand) brand.style.opacity = '1'
      return
    }

    const imgEl = containerRef.current.querySelector('.threshold-image') as HTMLElement
    const brandEl = containerRef.current.querySelector('.threshold-brand') as HTMLElement
    const punctureEl = containerRef.current.querySelector('.threshold-puncture') as HTMLElement
    const bgEl = containerRef.current.querySelector('.threshold-bg') as HTMLElement

    const tl = createTimeline({
      defaults: {
        ease: 'cubicBezier(0.16, 1, 0.3, 1)',
      },
    })

    tl.add(bgEl, {
      opacity: [0, 0.15],
      duration: 3000,
    }, 200)
      .add(imgEl, {
        opacity: [0, 0.3],
        duration: 2800,
      }, 600)
      .add(punctureEl, {
        opacity: [0, 0.6],
        translateX: [-30, 0],
        duration: 2200,
      }, 1800)
      .add(brandEl, {
        opacity: [0, 1],
        translateX: [-12, 0],
        duration: 1600,
      }, 2400)
  }, [])

  return (
    <section
      ref={(node) => {
        (containerRef as React.MutableRefObject<HTMLElement | null>).current = node
        ;(sectionRef as React.MutableRefObject<HTMLElement | null>).current = node
      }}
      className="relative h-[280svh]"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Background depth plane — blurred, slow, atmospheric */}
        <div
          ref={bgRef}
          className="threshold-bg absolute inset-[-25%] z-[1] opacity-0"
        >
          <Image
            src={src}
            alt=""
            fill
            className="object-cover blur-[8px]"
            sizes="150vw"
          />
        </div>

        {/* Main image — dramatic zoom OUT, vignetted into darkness */}
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
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 60% 50% at 50% 50%, transparent 5%, rgba(10,9,8,0.6) 50%, rgba(10,9,8,0.95) 100%)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-deep/90 via-transparent to-bg-deep/60" />
        </div>

        {/* Puncture — serif italic, horizontal drift, larger than before */}
        <span
          className="threshold-puncture absolute z-20 opacity-0
            top-[28vh] right-6
            md:top-[22vh] md:right-[14vw]
            font-serif italic text-[var(--text-title)] text-text-muted/20 select-none pointer-events-none"
          style={{
            opacity: punctureOpacity,
            transform: `translate3d(${punctureX}px, ${progress * -20}px, 0)`,
          }}
        >
          closer
        </span>

        {/* Second puncture — appears later, opposite side, smaller */}
        <span
          className="absolute z-20 select-none pointer-events-none
            bottom-[28vh] left-6
            md:bottom-[32vh] md:left-[10vw]
            text-[var(--text-micro)] tracking-[0.4em] uppercase text-text-muted/15"
          style={{
            opacity: progress > 0.4 && progress < 0.7
              ? Math.min(0.35, (progress - 0.4) * 1.17)
              : progress >= 0.7
                ? Math.max(0, 0.35 - (progress - 0.7) * 1.17)
                : 0,
            transform: `translate3d(${-10 + progress * 20}px, 0, 0)`,
          }}
        >
          not yet
        </span>

        {/* Brand — enters from the left (not just fading in), shifts up on scroll */}
        <div
          className="threshold-brand opacity-0 absolute z-10 bottom-0 left-0
            pb-10 md:pb-14 pl-6 md:pl-10"
          style={{
            transform: `translate3d(0, ${-brandShift}px, 0)`,
          }}
        >
          <p className="text-[var(--text-micro)] tracking-[0.3em] uppercase text-text-muted">
            Vasilisa
          </p>
        </div>
      </div>
    </section>
  )
}

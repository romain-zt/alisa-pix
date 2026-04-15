'use client'

import { useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { createTimeline } from 'animejs'
import { useSectionProgress } from '@/hooks/useSectionProgress'

export function Opening({ src }: { src: string }) {
  const containerRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const punctureRef = useRef<HTMLSpanElement>(null)
  const hasPlayed = useRef(false)

  const { ref: sectionRef, progress } = useSectionProgress<HTMLElement>()

  // Zoom OUT as user scrolls: 1.08 → 1.00
  // Opacity: held at 0.25, then slowly fades as user scrolls past
  const scrollScale = 1.08 - progress * 0.08
  const scrollOpacity = progress < 0.7 ? 0.28 : 0.28 - (progress - 0.7) * 0.9
  const brandShift = Math.min(progress * 40, 30)

  useEffect(() => {
    if (!containerRef.current || hasPlayed.current) return
    hasPlayed.current = true

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) {
      const img = containerRef.current.querySelector('.threshold-image') as HTMLElement
      const brand = containerRef.current.querySelector('.threshold-brand') as HTMLElement
      if (img) img.style.opacity = '0.25'
      if (brand) brand.style.opacity = '1'
      return
    }

    const imgEl = containerRef.current.querySelector('.threshold-image') as HTMLElement
    const brandEl = containerRef.current.querySelector('.threshold-brand') as HTMLElement
    const punctureEl = containerRef.current.querySelector('.threshold-puncture') as HTMLElement

    const tl = createTimeline({
      defaults: {
        ease: 'cubicBezier(0.16, 1, 0.3, 1)',
      },
    })

    tl.add(imgEl, {
      opacity: [0, 0.28],
      duration: 2400,
    }, 400)
      .add(brandEl, {
        opacity: [0, 1],
        translateY: [8, 0],
        duration: 1400,
      }, 1800)
      .add(punctureEl, {
        opacity: [0, 0.5],
        duration: 2000,
      }, 2600)
  }, [])

  return (
    <section
      ref={(node) => {
        (containerRef as React.MutableRefObject<HTMLElement | null>).current = node
        ;(sectionRef as React.MutableRefObject<HTMLElement | null>).current = node
      }}
      className="relative h-[250svh]"
    >
      {/* Sticky child — held for the full 250vh scroll distance */}
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Image — zoom OUT on scroll, held presence */}
        <div
          className="threshold-image absolute inset-0 opacity-0"
          ref={imageRef}
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
          <div className="absolute inset-0 bg-gradient-to-t from-bg-deep/80 via-bg-deep/40 to-bg-deep/70" />
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 65% 55% at 50% 55%, transparent 10%, rgba(10,9,8,0.7) 65%, rgba(10,9,8,0.95) 100%)',
            }}
          />
        </div>

        {/* Emotional puncture — upper right, appears late, drifts with scroll */}
        <span
          className="threshold-puncture absolute z-20 opacity-0
            top-[22vh] right-8
            md:top-[18vh] md:right-[12vw]
            font-serif italic text-[var(--text-lead)] text-text-muted/30 select-none"
          ref={punctureRef}
          style={{
            transform: `translate3d(0, ${progress * -15}px, 0)`,
          }}
        >
          closer
        </span>

        {/* Brand whisper — bottom left, delayed appearance, shifts up on scroll */}
        <div
          className="threshold-brand opacity-0 absolute z-10 bottom-0 left-0
            pb-8 md:pb-12 pl-6 md:pl-10"
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

'use client'

import { useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { createTimeline } from 'animejs'
import { useSectionProgress, useSectionStyle } from '@/hooks/useSectionProgress'

export function Opening({ src }: { src: string }) {
  const containerRef = useRef<HTMLElement>(null)
  const hasPlayed = useRef(false)

  const { ref: sectionRef, progress } = useSectionProgress<HTMLElement>()

  const scrollScale = 1.18 - progress * 0.18
  const scrollOpacity = progress < 0.75 ? 0.3 : 0.3 - (progress - 0.75) * 1.2
  const brandShift = Math.min(progress * 50, 40)

  const bgStyler = useCallback((p: number) => {
    const y = 30 - p * 60
    const scale = 1.3 - p * 0.05
    return {
      transform: `translate3d(0, ${y}px, 0) scale(${scale})`,
      opacity: `${p < 0.1 ? p * 10 * 0.15 : p > 0.8 ? (1 - p) * 5 * 0.15 : 0.15}`,
    }
  }, [])
  const bgRef = useSectionStyle<HTMLDivElement>(bgStyler)

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

    // Focus pull — blur → sharp, dim → lit via CSS transition (GPU-composited)
    imgEl.style.willChange = 'filter'
    imgEl.style.filter = 'blur(10px) brightness(0.8)'
    imgEl.style.transition = 'filter 2500ms cubic-bezier(0.16, 1, 0.3, 1)'
    requestAnimationFrame(() => {
      imgEl.style.filter = 'blur(0px) brightness(1)'
    })

    // Opacity + brand via anime.js — only 2 layers
    const tl = createTimeline({
      defaults: { ease: 'cubicBezier(0.16, 1, 0.3, 1)' },
    })

    tl.add(imgEl, {
      opacity: [0, 0.3],
      duration: 2500,
    }, 0)
      .add(brandEl, {
        opacity: [0, 1],
        translateX: [-12, 0],
        duration: 1600,
      }, 1800)

    const cleanup = setTimeout(() => {
      imgEl.style.transition = ''
      imgEl.style.filter = ''
      imgEl.style.willChange = ''
    }, 2800)

    return () => clearTimeout(cleanup)
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

        {/* Main image — cinematic focus pull, vignetted into darkness */}
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
          {/* Vignette — lens edge darkening */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 55% 45% at 50% 50%, transparent 0%, rgba(10,9,8,0.55) 45%, rgba(10,9,8,0.95) 100%)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-deep/90 via-transparent to-bg-deep/60" />
        </div>

        {/* Directional light — studio soft light from top-left */}
        <div
          className="absolute inset-0 z-[3] pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 70% at 25% 20%, rgba(255,245,230,0.06) 0%, transparent 65%)',
          }}
        />

        {/* Puncture — serif italic, horizontal drift */}
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

        {/* Second puncture — appears later, opposite side */}
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

        {/* Brand — enters from the left, shifts up on scroll */}
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

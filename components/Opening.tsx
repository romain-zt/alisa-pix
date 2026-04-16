'use client'

import { useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { createTimeline } from 'animejs'
import { useSectionProgress, useSectionStyle } from '@/hooks/useSectionProgress'

function powerCurve(t: number, exp: number): number {
  return Math.pow(t, exp)
}

function deadZone(t: number, start: number, end: number): number {
  if (t < start) return t / start * 0.5
  if (t > end) return 0.5 + ((t - end) / (1 - end)) * 0.5
  return 0.5
}

export function Opening({ src }: { src: string }) {
  const containerRef = useRef<HTMLElement>(null)
  const hasPlayed = useRef(false)

  const { ref: sectionRef, progress } = useSectionProgress<HTMLElement>()

  const p = powerCurve(progress, 1.8)
  const hold = deadZone(progress, 0.25, 0.55)

  const scrollScale = 1.25 - hold * 0.25
  const scrollOpacity = p < 0.6
    ? Math.min(0.35, p * 0.58)
    : 0.35 - (p - 0.6) * 0.875

  const brandShift = progress < 0.1 ? 0 : Math.min((progress - 0.1) * 55, 40)

  const bgStyler = useCallback((p: number) => {
    const curved = powerCurve(p, 2.2)
    const y = 50 - curved * 100
    const scale = 1.35 - curved * 0.08
    const rotation = -1.5 + curved * 3
    const opacity = p < 0.15 ? p / 0.15 * 0.12 : p > 0.75 ? (1 - p) * 4 * 0.12 : 0.12
    return {
      transform: `translate3d(0, ${y}px, 0) scale(${scale}) rotate(${rotation}deg)`,
      opacity: `${opacity}`,
    }
  }, [])
  const bgRef = useSectionStyle<HTMLDivElement>(bgStyler)

  const lightStyler = useCallback((p: number) => {
    const x = 20 + p * 30
    const y = 15 + p * 25
    const intensity = p > 0.1 && p < 0.7
      ? Math.min(0.08, (p - 0.1) * 0.133)
      : 0
    return {
      opacity: `${intensity}`,
      transform: `translate3d(${x - 35}px, ${y - 25}px, 0)`,
    }
  }, [])
  const lightRef = useSectionStyle<HTMLDivElement>(lightStyler)

  const puncture1Opacity = progress > 0.2 && progress < 0.45
    ? Math.min(0.7, Math.pow((progress - 0.2) / 0.25, 0.5) * 0.7)
    : progress >= 0.45 && progress < 0.65
      ? 0.7 * Math.pow(1 - (progress - 0.45) / 0.2, 2)
      : 0

  const puncture2Start = 0.5
  const puncture2Opacity = progress > puncture2Start && progress < 0.78
    ? Math.min(0.3, Math.pow((progress - puncture2Start) / 0.28, 3) * 0.3)
    : progress >= 0.78
      ? Math.max(0, 0.3 - (progress - 0.78) * 1.36)
      : 0

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
    const veilEl = containerRef.current.querySelector('.threshold-veil') as HTMLElement

    imgEl.style.willChange = 'filter'
    imgEl.style.filter = 'blur(16px) brightness(0.6) saturate(0.3)'
    imgEl.style.transition = 'filter 3500ms cubic-bezier(0.87, 0, 0.13, 1)'

    const tl = createTimeline({
      defaults: { ease: 'cubicBezier(0.87, 0, 0.13, 1)' },
    })

    tl.add(veilEl, {
      opacity: [1, 0],
      duration: 2800,
    }, 0)
      .add(imgEl, {
        opacity: [0, 0.35],
        duration: 3200,
      }, 800)
      .add(brandEl, {
        opacity: [0, 1],
        translateX: [-20, 0],
        duration: 1400,
      }, 2600)

    setTimeout(() => {
      imgEl.style.filter = 'blur(0px) brightness(1) saturate(1)'
    }, 600)

    const cleanup = setTimeout(() => {
      imgEl.style.transition = ''
      imgEl.style.filter = ''
      imgEl.style.willChange = ''
    }, 4500)

    return () => clearTimeout(cleanup)
  }, [])

  return (
    <section
      ref={(node) => {
        (containerRef as React.MutableRefObject<HTMLElement | null>).current = node
        ;(sectionRef as React.MutableRefObject<HTMLElement | null>).current = node
      }}
      className="relative h-[320svh]"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Veil — pure darkness that lifts */}
        <div
          className="threshold-veil absolute inset-0 z-[5] bg-bg-deep"
          style={{ pointerEvents: 'none' }}
        />

        {/* Background depth plane — slow rotation + drift */}
        <div
          ref={bgRef}
          className="threshold-bg absolute inset-[-30%] z-[1] opacity-0"
        >
          <Image
            src={src}
            alt=""
            fill
            className="object-cover blur-[12px]"
            sizes="160vw"
          />
        </div>

        {/* Liquid light layer — moves independently */}
        <div
          ref={lightRef}
          className="absolute inset-0 z-[4] pointer-events-none opacity-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 30% 25%, rgba(255,245,230,0.12) 0%, transparent 55%)',
          }}
        />

        {/* Main image — focus pull, vignetted into darkness */}
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
                'radial-gradient(ellipse 50% 40% at 50% 45%, transparent 0%, rgba(10,9,8,0.6) 40%, rgba(10,9,8,0.97) 100%)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-deep/95 via-transparent to-bg-deep/70" />
        </div>

        {/* Studio light — top-left, warm, subtle */}
        <div
          className="absolute inset-0 z-[3] pointer-events-none light-drift"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 20% 15%, rgba(255,240,215,0.06) 0%, transparent 60%)',
          }}
        />

        {/* Puncture — large, serif, fades fast with power curve */}
        <span
          className="absolute z-20 select-none pointer-events-none
            top-[30vh] right-8
            md:top-[24vh] md:right-[12vw]
            font-serif italic text-[var(--text-display)] text-text-muted/25"
          style={{
            opacity: puncture1Opacity,
            transform: `translate3d(${-30 + progress * 60}px, ${progress * -25}px, 0) rotate(${-0.5 + progress}deg)`,
          }}
        >
          closer
        </span>

        {/* Second puncture — delayed, smaller, opposite side, different timing curve */}
        <span
          className="absolute z-20 select-none pointer-events-none
            bottom-[25vh] left-8
            md:bottom-[30vh] md:left-[8vw]
            text-[var(--text-micro)] tracking-[0.5em] uppercase text-text-muted/10"
          style={{
            opacity: puncture2Opacity,
            transform: `translate3d(${-15 + progress * 30}px, ${5 - progress * 10}px, 0)`,
          }}
        >
          not yet
        </span>

        {/* Brand — enters from left, drifts up on scroll */}
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

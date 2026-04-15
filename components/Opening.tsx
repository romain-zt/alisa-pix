'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { createTimeline } from 'animejs'

export function Opening({ src }: { src: string }) {
  const containerRef = useRef<HTMLElement>(null)
  const hasPlayed = useRef(false)

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

    const tl = createTimeline({
      defaults: {
        ease: 'cubicBezier(0.16, 1, 0.3, 1)',
      },
    })

    tl.add(imgEl, {
      opacity: [0, 0.25],
      scale: [1.06, 1.02],
      duration: 2000,
    }, 300)
      .add(brandEl, {
        opacity: [0, 1],
        duration: 1200,
      }, 1200)
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative h-[100svh] flex items-end overflow-hidden"
    >
      {/* Atmospheric image — barely sensed, not clearly seen */}
      <div className="threshold-image absolute inset-0 opacity-0">
        <Image
          src={src}
          alt=""
          fill
          className="object-cover scale-[1.06]"
          priority
          sizes="100vw"
        />
        {/* Heavy vignette: dark at edges, slightly open at center-bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-deep/70 via-bg-deep/50 to-bg-deep/85" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 50% 60%, transparent 15%, rgba(10,9,8,0.75) 70%, rgba(10,9,8,0.95) 100%)',
          }}
        />
      </div>

      {/* Brand whisper — bottom left, gallery placard style */}
      <div className="threshold-brand opacity-0 relative z-10 pb-8 md:pb-12 pl-6 md:pl-10">
        <p className="text-[var(--text-micro)] tracking-[0.3em] uppercase text-text-muted">
          Vasilisa
        </p>
      </div>
    </section>
  )
}

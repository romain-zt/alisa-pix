'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { animate, createTimeline } from 'animejs'

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
      const img = containerRef.current.querySelector('.opening-image') as HTMLElement
      const brand = containerRef.current.querySelector('.opening-brand') as HTMLElement
      const tagline = containerRef.current.querySelector('.opening-tagline') as HTMLElement
      if (img) img.style.opacity = '1'
      if (brand) brand.style.opacity = '1'
      if (tagline) tagline.style.opacity = '1'
      return
    }

    const imgEl = containerRef.current.querySelector('.opening-image') as HTMLElement
    const brandEl = containerRef.current.querySelector('.opening-brand') as HTMLElement
    const taglineEl = containerRef.current.querySelector('.opening-tagline') as HTMLElement

    const tl = createTimeline({
      defaults: {
        ease: 'cubicBezier(0.16, 1, 0.3, 1)',
      },
    })

    tl.add(imgEl, {
      opacity: [0, 0.45],
      scale: [1.04, 1],
      duration: 1800,
    }, 0)
      .add(brandEl, {
        opacity: [0, 1],
        translateY: [12, 0],
        duration: 1200,
      }, 800)
      .add(taglineEl, {
        opacity: [0, 0.5],
        translateY: [8, 0],
        duration: 900,
      }, 1500)
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative h-[100svh] flex flex-col items-center justify-end overflow-hidden"
    >
      <div className="opening-image absolute inset-0 opacity-0">
        <Image
          src={src}
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-deep via-bg-deep/40 to-bg-deep/70" />
      </div>

      <div className="relative z-10 text-center pb-[15svh] px-6">
        <h1 className="opening-brand opacity-0 font-serif font-light text-text-primary text-[var(--text-display)] tracking-[0.3em] uppercase mb-4">
          Vasilisa
        </h1>
        <p className="opening-tagline opacity-0 text-[var(--text-micro)] tracking-[0.2em] uppercase text-text-muted">
          A bright trace of your personality
        </p>
      </div>
    </section>
  )
}

'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import { createTimeline, animate } from 'animejs'

export function FullscreenGallery({ images }: { images: string[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(0)
  const [entered, setEntered] = useState(false)
  const prevRef = useRef(0)

  // Entrance sequence
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) {
      setEntered(true)
      return
    }

    const tl = createTimeline({
      defaults: { ease: 'cubicBezier(0.16, 1, 0.3, 1)' },
    })

    const firstSlide = document.querySelector('.gallery-slide-0') as HTMLElement
    const counter = document.getElementById('gallery-counter')
    const brand = document.getElementById('gallery-brand')

    if (firstSlide) {
      tl.add(firstSlide, {
        opacity: [0, 1],
        scale: [1.06, 1],
        duration: 2200,
      }, 0)
    }
    if (counter) {
      tl.add(counter, {
        opacity: [0, 0.4],
        translateY: [12, 0],
        duration: 1200,
      }, 800)
    }
    if (brand) {
      tl.add(brand, {
        opacity: [0, 0.5],
        translateX: [-8, 0],
        duration: 1000,
      }, 1000)
    }

    setTimeout(() => setEntered(true), 300)
  }, [])

  const handleScroll = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    const idx = Math.round(el.scrollTop / window.innerHeight)
    if (idx !== prevRef.current) {
      prevRef.current = idx
      setCurrent(idx)

      // Subtle scale pulse on the new slide
      const slide = el.querySelector(`.gallery-slide-${idx}`) as HTMLElement
      if (slide) {
        animate(slide, {
          scale: [1.02, 1],
          duration: 1400,
          ease: 'cubicBezier(0.16, 1, 0.3, 1)',
        })
      }
    }
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const el = containerRef.current
      if (!el) return
      if (e.key === 'ArrowDown' || e.key === ' ' || e.key === 'j') {
        e.preventDefault()
        el.scrollTo({ top: (current + 1) * window.innerHeight, behavior: 'smooth' })
      }
      if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault()
        el.scrollTo({ top: Math.max(0, (current - 1) * window.innerHeight), behavior: 'smooth' })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [current])

  return (
    <div
      ref={containerRef}
      className="gallery-scroll h-[100svh] overflow-y-scroll snap-y snap-mandatory bg-bg-deep"
    >
      {images.map((src, i) => (
        <div
          key={i}
          className={`gallery-slide-${i} h-[100svh] snap-start snap-always relative`}
          style={{ opacity: !entered && i > 0 ? 0 : undefined }}
        >
          {/* Radial vignette frame */}
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 70% 65% at 50% 50%, transparent 50%, rgba(10,9,8,0.7) 100%)',
            }}
          />

          <div className="absolute inset-0 flex items-center justify-center p-6 md:p-16 lg:p-24">
            <div className="relative w-full h-full max-w-[85vw] max-h-[80svh] md:max-w-[70vw] md:max-h-[85svh]">
              <Image
                src={src}
                alt=""
                fill
                className="object-contain"
                sizes="(min-width: 1024px) 70vw, 85vw"
                priority={i < 3}
              />
            </div>
          </div>
        </div>
      ))}

      {/* Counter */}
      <div
        id="gallery-counter"
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 opacity-0 text-[var(--text-micro)] tracking-[0.5em] text-text-muted/40 tabular-nums select-none pointer-events-none"
      >
        {String(current + 1).padStart(2, '0')}
        <span className="mx-2 text-text-muted/15">/</span>
        {String(images.length).padStart(2, '0')}
      </div>

      {/* Brand */}
      <a
        id="gallery-brand"
        href="/"
        className="fixed top-8 left-8 z-50 opacity-0 text-[var(--text-micro)] tracking-[0.3em] uppercase text-text-muted/50 transition-opacity duration-700 hover:text-text-muted min-h-[44px] min-w-[44px] flex items-center"
      >
        Vasilisa
      </a>

      {/* Scroll hint — first slide only */}
      {current === 0 && entered && (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-center gap-2 opacity-0 animate-fade-in pointer-events-none">
          <div className="w-px h-8 bg-text-muted/15" />
        </div>
      )}
    </div>
  )
}

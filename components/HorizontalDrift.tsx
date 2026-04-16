'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

interface HorizontalDriftProps {
  images: readonly string[]
}

export function HorizontalDrift({ images }: HorizontalDriftProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const scroller = scrollRef.current
    if (!section || !scroller) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    if (prefersReducedMotion) return

    let ticking = false

    function onScroll() {
      if (ticking) return
      ticking = true

      requestAnimationFrame(() => {
        const rect = section!.getBoundingClientRect()
        const vh = window.innerHeight
        const sectionHeight = rect.height - vh

        if (sectionHeight <= 0) { ticking = false; return }

        const scrolled = -rect.top
        const progress = Math.max(0, Math.min(1, scrolled / sectionHeight))

        const maxScrollLeft = scroller!.scrollWidth - scroller!.clientWidth
        scroller!.scrollLeft = progress * maxScrollLeft

        ticking = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const panelCount = images.length

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{
        height: `${panelCount * 100 + 50}vh`,
        background: 'var(--color-tone-shadow)',
      }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Atmospheric gradient overlay */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background:
              'linear-gradient(to right, var(--color-tone-shadow) 0%, transparent 8%, transparent 92%, var(--color-tone-shadow) 100%)',
          }}
        />

        <div
          ref={scrollRef}
          className="flex h-full items-center gap-[4vw] px-[8vw] overflow-x-hidden gallery-scroll"
        >
          {images.map((src, i) => {
            const aspects = ['aspect-[3/4]', 'aspect-[4/5]', 'aspect-[2/3]', 'aspect-[5/7]']
            const widths = ['w-[75vw] md:w-[38vw]', 'w-[65vw] md:w-[32vw]', 'w-[80vw] md:w-[42vw]', 'w-[70vw] md:w-[35vw]']
            const offsets = ['mt-0', 'mt-[8vh]', 'mt-[-4vh]', 'mt-[12vh]']

            return (
              <div
                key={src}
                className={`flex-shrink-0 ${widths[i % widths.length]} ${offsets[i % offsets.length]}`}
              >
                <div className={`relative ${aspects[i % aspects.length]} overflow-hidden`}>
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 42vw, 80vw"
                  />
                  <div className="lens-vignette-soft absolute inset-0" />
                </div>
              </div>
            )
          })}

          {/* Trailing void — empty space at the end */}
          <div className="flex-shrink-0 w-[20vw]" />
        </div>

        {/* Faint directional light */}
        <div
          className="absolute inset-0 z-[5] pointer-events-none light-drift"
          style={{
            background:
              'radial-gradient(ellipse 50% 60% at 30% 25%, rgba(255,245,230,0.03) 0%, transparent 50%)',
          }}
        />
      </div>
    </section>
  )
}

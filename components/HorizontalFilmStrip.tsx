'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'

const WHISPERS = [
  'you found it',
  'stay a little',
  'not what you expected',
  'closer',
  'don\'t look away',
  'remember this',
]

export function HorizontalFilmStrip({ images }: { images: readonly string[] }) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrapper = wrapperRef.current
    const track = trackRef.current
    if (!wrapper || !track) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    if (prefersReducedMotion) return

    let ticking = false

    function onScroll() {
      if (ticking) return
      ticking = true

      requestAnimationFrame(() => {
        const wh = wrapper!.offsetHeight
        const vh = window.innerHeight
        const rect = wrapper!.getBoundingClientRect()
        const progress = Math.max(0, Math.min(1, -rect.top / (wh - vh)))

        const travel = track!.scrollWidth - window.innerWidth
        track!.style.transform = `translate3d(${-progress * travel}px, 0, 0)`

        ticking = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const count = images.length

  return (
    // Height = how much vertical scroll = full horizontal travel
    <div
      ref={wrapperRef}
      style={{ height: `${count * 100}vh`, background: 'var(--color-bg-deep)' }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Horizontal track — moves left as you scroll down */}
        <div
          ref={trackRef}
          className="flex h-full"
          style={{ willChange: 'transform' }}
        >
          {images.map((src, i) => {
            const isWide = i % 3 === 1
            const whisper = WHISPERS[i % WHISPERS.length]

            return (
              <div
                key={i}
                className="relative flex-none h-full"
                style={{ width: isWide ? '85vw' : '72vw', marginRight: '3vw' }}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="85vw"
                />

                {/* Edge gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-bg-deep/50 via-transparent to-transparent" />

                {/* Whisper — bottom corner, alternating sides */}
                <span
                  className={`
                    absolute bottom-8 font-serif italic
                    text-[var(--text-micro)] text-white/25
                    select-none pointer-events-none
                    ${i % 2 === 0 ? 'right-6 md:right-10' : 'left-6 md:left-10'}
                  `}
                  aria-hidden="true"
                >
                  {whisper}
                </span>

                {/* Frame index */}
                <span
                  className="absolute top-8 right-6 md:right-10 text-[var(--text-micro)] tracking-[0.25em] text-white/20 tabular-nums"
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
            )
          })}

          {/* Trailing void — the strip ends into darkness */}
          <div className="flex-none h-full" style={{ width: '30vw' }} />
        </div>

        {/* Direction hint — fades out as you start scrolling */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 opacity-30 pointer-events-none"
          aria-hidden="true"
        >
          <div className="w-6 h-px bg-white" />
          <span className="text-[var(--text-micro)] tracking-[0.4em] uppercase text-white">
            →
          </span>
          <div className="w-6 h-px bg-white" />
        </div>
      </div>
    </div>
  )
}

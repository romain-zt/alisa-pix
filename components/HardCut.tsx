'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

export function HardCut({ src }: { src: string }) {
  const sectionRef = useRef<HTMLElement>(null)
  const [flashed, setFlashed] = useState(false)
  const hasTriggered = useRef(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    if (prefersReducedMotion) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggered.current) {
          hasTriggered.current = true
          setFlashed(true)
        }
      },
      { threshold: 0.15 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative h-[80svh] md:h-[90vh] overflow-hidden"
    >
      {/* Gas layer — barely present, slow CSS drift, blurred */}
      <div
        className="absolute inset-[-20%] z-[0] gas-drift-reverse"
        style={{ opacity: 0.08 }}
      >
        <Image
          src={src}
          alt=""
          fill
          className="object-cover blur-[18px]"
          sizes="140vw"
        />
      </div>

      {/* Subject — full bleed, hard arrival */}
      <div className="absolute inset-0 z-[1]">
        <Image
          src={src}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          style={{
            filter: 'brightness(1.2) contrast(0.92) saturate(1.05)',
          }}
        />
      </div>

      {/* Liquid light — overexposed corner, CSS-animated, never static */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none light-leak-warm"
        style={{
          background:
            'radial-gradient(ellipse 55% 45% at 18% 12%, rgba(255,252,242,0.12) 0%, rgba(255,248,230,0.05) 40%, transparent 70%)',
        }}
      />

      {/* Warm diagonal tint */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            'linear-gradient(135deg, rgba(255,250,240,0.08) 0%, transparent 30%, transparent 72%, rgba(10,9,8,0.18) 100%)',
        }}
      />

      {/* Flash burn — white overexposure fires once on entry */}
      {flashed && (
        <div
          className="absolute inset-0 z-[3] flash-burn"
          style={{
            background:
              'radial-gradient(ellipse 85% 75% at 42% 38%, rgba(255,252,245,0.82) 0%, rgba(255,250,240,0.35) 55%, transparent 100%)',
          }}
        />
      )}

      {/* Vignette — optical, after the burn */}
      <div className="absolute inset-0 z-[4] lens-vignette pointer-events-none" />

      {/* Harsh top line — emulsion edge */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] z-[5] pointer-events-none"
        style={{ background: 'rgba(255,252,245,0.06)' }}
      />
    </section>
  )
}

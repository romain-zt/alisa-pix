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
      <Image
        src={src}
        alt=""
        fill
        className="object-cover"
        sizes="100vw"
        style={{
          filter: 'brightness(1.25) contrast(0.9) saturate(1.1)',
        }}
      />

      {/* Warm overexposure tint — asymmetric, not centered */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(135deg, rgba(255,250,240,0.1) 0%, transparent 35%, transparent 70%, rgba(10,9,8,0.2) 100%)',
        }}
      />

      {/* Flash burn — white overlay that fires once on entry */}
      {flashed && (
        <div
          className="absolute inset-0 z-10 flash-burn"
          style={{
            background:
              'radial-gradient(ellipse 80% 70% at 45% 40%, rgba(255,252,245,0.85) 0%, rgba(255,250,240,0.4) 50%, transparent 100%)',
          }}
        />
      )}

      {/* Harsh top edge — no soft gradient, abrupt */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] pointer-events-none"
        style={{ background: 'rgba(255,252,245,0.08)' }}
      />
    </section>
  )
}

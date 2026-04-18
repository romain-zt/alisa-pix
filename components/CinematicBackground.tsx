'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

interface Props {
  src: string
  /** How many viewport heights of scroll the bg keeps animating. */
  rangeVH?: number
}

/**
 * CinematicBackground
 *
 * A fixed, full-viewport image pinned beneath the entire homepage. The image
 * never fades — every section above it is transparent so this stage is the
 * single visual constant the visitor experiences.
 *
 * Two independent motions tied to scroll:
 *   - Pan: right → left across the image (the visible window starts on the
 *     RIGHT portion of the image and drifts to the LEFT portion).
 *   - Zoom: a soft sine breath — push in slightly, then release.
 *
 * Continuous CSS "gas-drift" animation gives the stage life even when the
 * user is still. On mount: a dark veil lifts and the image focus-pulls from
 * blur → sharp.
 */
export function CinematicBackground({
  src,
  rangeVH = 8,
}: Props) {
  const [t, setT] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)

  // Initial reveal: triggers focus pull + veil lift on mount
  useEffect(() => {
    const id = requestAnimationFrame(() => setRevealed(true))
    return () => cancelAnimationFrame(id)
  }, [])

  // Global scroll progress (0..1 over the rangeVH)
  useEffect(() => {
    let ticking = false
    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    function onScroll() {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const y = window.scrollY
        const vh = window.innerHeight
        const range = vh * rangeVH
        const local = reduce ? 0 : Math.min(1, Math.max(0, y / range))
        setT(local)
        ticking = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [rangeVH])

  // ── Right → Left pan ────────────────────────────────────────────────────
  // Subtle: ±5% range so the framing stays generous and most of the picture
  // remains visible at all times.
  const panX = 5 + t * -100

  // ── Zoom breath (push in, release) ─────────────────────────────────────
  // Sine peaks at midway. 1.04 → 1.10 → 1.04. Soft, never imposes itself.
  const zoomCurve = Math.sin(t * Math.PI)
  const scale = 1.04 + zoomCurve * 0.06

  // ── Vignette deepens very gently with progress ─────────────────────────
  const vignette = 0.42 + t * 0.18

  const imageOpacity = revealed ? 1 : 0

  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* Base color floor — never empty */}
      <div className="absolute inset-0 bg-bg-deep" />

      {/* Outer wrapper — continuous breathing (independent of scroll) */}
      <div className="absolute inset-[-7%] gas-drift">
        {/* Inner wrapper — scroll-driven pan + zoom */}
        <div
          ref={stageRef}
          className="absolute inset-0"
          style={{
            transform: `translate3d(${panX}%, 0, 0) scale(${scale})`,
            opacity: imageOpacity,
            transition: revealed
              ? 'opacity 3200ms cubic-bezier(0.87, 0, 0.13, 1), filter 3800ms cubic-bezier(0.87, 0, 0.13, 1)'
              : undefined,
            filter: revealed
              ? 'blur(0px) brightness(1) saturate(1)'
              : 'blur(22px) brightness(0.5) saturate(0.5)',
            willChange: 'transform, opacity, filter',
          }}
        >
          <Image
            src={src}
            alt=""
            fill
            priority
            className="object-cover w-full h-full"
            sizes='100%'
          />
        </div>
      </div>

      {/* Veil — pure darkness that lifts on entry */}
      <div
        className="absolute inset-0 bg-bg-deep"
        style={{
          opacity: revealed ? 0 : 1,
          transition: 'opacity 2400ms cubic-bezier(0.87, 0, 0.13, 1)',
        }}
      />

      {/* Liquid light — warm radial drifts continuously */}
      <div
        className="absolute inset-0 light-leak-warm"
        style={{
          background:
            'radial-gradient(ellipse 50% 40% at 25% 22%, rgba(255,238,210,0.18) 0%, transparent 60%)',
        }}
      />

      {/* Cool subtle leak on opposite side */}
      <div
        className="absolute inset-0 light-leak-cold"
        style={{
          background:
            'radial-gradient(ellipse 40% 35% at 78% 75%, rgba(196,168,138,0.12) 0%, transparent 65%)',
        }}
      />

      {/* Cinematic vignette — deepens with scroll */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 80% 75% at 50% 50%, transparent 35%, rgba(8,7,6,${vignette}) 100%)`,
        }}
      />

      {/* Soft top + bottom darken — kept very gentle so the picture reads */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(10,9,8,0.35) 0%, transparent 18%, transparent 70%, rgba(10,9,8,0.55) 100%)',
        }}
      />

      {/* Subtle continuous shimmer */}
      <div
        className="absolute inset-0 shimmer-slow"
        style={{
          background:
            'linear-gradient(to bottom, rgba(255,248,235,0.025) 0%, transparent 45%)',
        }}
      />
    </div>
  )
}

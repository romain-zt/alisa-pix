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
 * THREE-PHASE VIRTUAL CAMERA tied to scroll:
 *
 *   PHASE 1 (0 → 0.40)  "the subject"
 *     — zoomed into the RIGHT-TOP third of the image (the model in the mirror)
 *     — start: scale 1.45, image shifted left, vertical crop near top
 *     — end:   scale 1.05, centered, vertical crop centered
 *
 *   PHASE 2 (0.40 → 0.72)  "the room"
 *     — full dezoom, drift right to reveal the LEFT side of the image (the
 *       woman in the white shirt)
 *
 *   PHASE 3 (0.72 → 1.00)  "the descent"
 *     — slight push back in + pan DOWN via objectPosition to reveal the
 *       bottom of the image (legs, floor)
 *
 * Vertical motion uses `object-position` so it can never expose the container
 * background (no edge cropping). Horizontal motion uses `translateX` within a
 * safe overflow margin guaranteed by the container `inset-[-12%]` and the
 * minimum scale of 1.05.
 *
 * On mount: a dark veil lifts and the image focus-pulls from blur → sharp.
 */

function smoothstep(x: number) {
  const t = Math.max(0, Math.min(1, x))
  return t * t * (3 - 2 * t)
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

interface CameraState {
  scale: number
  /** translateX in % of the inner element's own width */
  tx: number
  /** object-position Y in % */
  objPosY: number
}

/**
 * Camera target values are tuned against a container of `inset-[-28%]`
 * (156% × 156% of viewport). Edge safety verified at every phase boundary
 * — the image always overflows the viewport on every side.
 */
function getCameraState(t: number): CameraState {
  // ── PHASE 1 — focus on RIGHT-TOP (the subject) ──────────────────────────
  // Heavy zoom (1.85 → 1.05) + big rightward pan + vertical crop near top.
  if (t < 0.4) {
    const e = smoothstep(t / 0.4)
    return {
      scale: lerp(1.85, 1.05, e),
      tx: lerp(-20, 2, e),
      objPosY: lerp(10, 52, e),
    }
  }

  // ── PHASE 2 — full dezoom, drift to expose the LEFT side ────────────────
  if (t < 0.72) {
    const e = smoothstep((t - 0.4) / 0.32)
    return {
      scale: lerp(1.05, 1.02, e),
      tx: lerp(2, 16, e),
      objPosY: lerp(52, 56, e),
    }
  }

  // ── PHASE 3 — push back in + pan DOWN to reveal the bottom ──────────────
  const e = smoothstep((t - 0.72) / 0.28)
  return {
    scale: lerp(1.02, 1.35, e),
    tx: lerp(16, -8, e),
    objPosY: lerp(56, 96, e),
  }
}

export function CinematicBackground({ src, rangeVH = 9 }: Props) {
  const [t, setT] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const id = requestAnimationFrame(() => setRevealed(true))
    return () => cancelAnimationFrame(id)
  }, [])

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

  const camera = getCameraState(t)

  // Vignette deepens very gently with progress (kept soft)
  const vignette = 0.38 + t * 0.18
  const imageOpacity = revealed ? 1 : 0

  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* Base color floor — never empty */}
      <div className="absolute inset-0 bg-bg-deep" />

      {/* Stage — generous overflow (156% of viewport) so the larger pan +
          zoom range never exposes the container edges. */}
      <div className="absolute inset-[-28%]">
        <div
          ref={stageRef}
          className="absolute inset-0"
          style={{
            transform: `translate3d(${camera.tx}%, 0, 0) scale(${camera.scale})`,
            transformOrigin: 'center center',
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
            sizes='100dvw'
            className="object-cover"
            style={{ objectPosition: `90% ${-camera.objPosY}%` }}
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
            'radial-gradient(ellipse 50% 40% at 25% 22%, rgba(255,238,210,0.16) 0%, transparent 60%)',
        }}
      />

      {/* Cool subtle leak on opposite side */}
      <div
        className="absolute inset-0 light-leak-cold"
        style={{
          background:
            'radial-gradient(ellipse 40% 35% at 78% 75%, rgba(196,168,138,0.10) 0%, transparent 65%)',
        }}
      />

      {/* Cinematic vignette — deepens with scroll */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 85% 80% at 50% 50%, transparent 40%, rgba(8,7,6,${vignette}) 100%)`,
        }}
      />

      {/* Soft top + bottom darken — kept very gentle so the picture reads */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(10,9,8,0.32) 0%, transparent 18%, transparent 70%, rgba(10,9,8,0.5) 100%)',
        }}
      />

      {/* Subtle continuous shimmer */}
      <div
        className="absolute inset-0 shimmer-slow"
        style={{
          background:
            'linear-gradient(to bottom, rgba(255,248,235,0.022) 0%, transparent 45%)',
        }}
      />
    </div>
  )
}

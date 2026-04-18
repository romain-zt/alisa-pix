'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface Props {
  src: string
  /** How many viewport heights of scroll the bg keeps animating. */
  rangeVH?: number
}

/**
 * CinematicBackground
 *
 * Renders the source image at its **natural cover-fit size** — i.e. the
 * smallest size that fully covers the viewport. The image is never
 * scaled larger than that, so:
 *
 *   - 100% viewport coverage is guaranteed by `object-fit: cover`
 *   - The picture is never zoomed in beyond what's needed to cover
 *
 * The "camera" is just `object-position` — a percentage pair that
 * controls which part of the cropped image is visible. The browser
 * handles the orientation logic automatically:
 *
 *   - Portrait viewport (mobile) → image overflows horizontally, posX
 *     pans LEFT↔RIGHT, posY has no visible effect
 *   - Landscape viewport (desktop) → image overflows vertically, posY
 *     pans TOP↔BOTTOM, posX has no visible effect
 *
 * BOTH posX AND posY change in every phase so motion is visible on
 * BOTH orientations regardless of which axis happens to overflow.
 *
 * `scale` is a CSS transform applied on top of the cover-fit. It is
 * always >= 1.0 so coverage stays guaranteed (scaling outward from
 * the center never exposes edges). Phase 1 zooms IN gently (1.0 →
 * 1.15) to draw the eye in on first scroll, then it dezooms back to
 * natural cover-fit (1.0) by the end of the journey.
 *
 *   t=0.00  posX=15 posY=12  scale=1.00  — top-left, natural
 *   t=0.40  posX=40 posY=85  scale=1.15  — bottom-drifted, zoomed in
 *   t=0.72  posX=85 posY=60  scale=1.05  — far right, releasing
 *   t=1.00  posX=55 posY=40  scale=1.00  — settled, at rest
 *
 * Keyframes are interpolated with **PCHIP** (Piecewise Cubic Hermite
 * Interpolating Polynomial) for C¹-continuous motion (no velocity
 * stutter at keyframes) with monotonicity (no overshoot).
 */

const KEYFRAMES = [
  { t: 0.0, posX: 15, posY: 12, scale: 1.0 },
  { t: 0.4, posX: 40, posY: 85, scale: 1.15 },
  { t: 0.72, posX: 85, posY: 60, scale: 1.05 },
  { t: 1.0, posX: 55, posY: 40, scale: 1.0 },
] as const

interface CameraState {
  posX: number
  posY: number
  scale: number
}

/**
 * PCHIP slope at an interior keyframe. Returns 0 when the secants on
 * either side change sign (or one is zero) to enforce monotonicity.
 * Otherwise uses the Fritsch–Carlson weighted-harmonic-mean formula.
 */
function pchipSlope(
  ym1: number,
  y0: number,
  yp1: number,
  hm1: number,
  hp1: number
): number {
  const dm1 = (y0 - ym1) / hm1
  const dp1 = (yp1 - y0) / hp1
  if (dm1 === 0 || dp1 === 0 || Math.sign(dm1) !== Math.sign(dp1)) return 0
  const w1 = 2 * hp1 + hm1
  const w2 = hp1 + 2 * hm1
  return (w1 + w2) / (w1 / dm1 + w2 / dp1)
}

/** Slope at every keyframe; endpoints forced to 0 (start/end at rest). */
function buildSlopes(values: number[], times: number[]): number[] {
  const n = values.length
  const m = new Array(n).fill(0)
  for (let i = 1; i < n - 1; i++) {
    m[i] = pchipSlope(
      values[i - 1],
      values[i],
      values[i + 1],
      times[i] - times[i - 1],
      times[i + 1] - times[i]
    )
  }
  return m
}

const TIMES = KEYFRAMES.map((k) => k.t)
const SLOPES_X = buildSlopes(
  KEYFRAMES.map((k) => k.posX),
  TIMES
)
const SLOPES_Y = buildSlopes(
  KEYFRAMES.map((k) => k.posY),
  TIMES
)
const SLOPES_S = buildSlopes(
  KEYFRAMES.map((k) => k.scale),
  TIMES
)

/** Cubic Hermite basis evaluated at u ∈ [0,1]. */
function hermite(
  u: number,
  vi: number,
  vf: number,
  si: number,
  sf: number,
  dt: number
): number {
  const u2 = u * u
  const u3 = u2 * u
  const h00 = 2 * u3 - 3 * u2 + 1
  const h10 = u3 - 2 * u2 + u
  const h01 = -2 * u3 + 3 * u2
  const h11 = u3 - u2
  return h00 * vi + h10 * dt * si + h01 * vf + h11 * dt * sf
}

function getCameraState(t: number): CameraState {
  const tc = Math.max(0, Math.min(1, t))
  let i = 0
  for (let k = 0; k < KEYFRAMES.length - 1; k++) {
    if (tc <= KEYFRAMES[k + 1].t) {
      i = k
      break
    }
  }
  const a = KEYFRAMES[i]
  const b = KEYFRAMES[i + 1]
  const dt = b.t - a.t
  const u = (tc - a.t) / dt
  return {
    posX: hermite(u, a.posX, b.posX, SLOPES_X[i], SLOPES_X[i + 1], dt),
    posY: hermite(u, a.posY, b.posY, SLOPES_Y[i], SLOPES_Y[i + 1], dt),
    scale: hermite(u, a.scale, b.scale, SLOPES_S[i], SLOPES_S[i + 1], dt),
  }
}

export function CinematicBackground({ src, rangeVH = 9 }: Props) {
  const [t, setT] = useState(0)
  const [revealed, setRevealed] = useState(false)

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
  const vignette = 0.24 + t * 0.12
  const imageOpacity = revealed ? 1 : 0

  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* Base color floor — never empty */}
      <div className="absolute inset-0 bg-bg-deep" />

      {/* The picture itself — natural cover-fit, panned by object-position,
          gently scaled by transform. Coverage is guaranteed by object-fit:
          cover and scale >= 1.0 (transform never shrinks the canvas). */}
      <div
        className="absolute inset-0"
        style={{
          opacity: imageOpacity,
          transition: revealed
            ? 'opacity 3200ms cubic-bezier(0.87, 0, 0.13, 1), filter 3800ms cubic-bezier(0.87, 0, 0.13, 1)'
            : undefined,
          filter: revealed
            ? 'blur(0px) brightness(1) saturate(1)'
            : 'blur(22px) brightness(0.5) saturate(0.5)',
          willChange: 'opacity, filter',
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            transform: `scale(${camera.scale})`,
            transformOrigin: '50% 50%',
            willChange: 'transform',
          }}
        >
          <Image
            src={src}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{
              objectPosition: `${camera.posX}% ${camera.posY}%`,
              willChange: 'object-position',
            }}
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
            'radial-gradient(ellipse 50% 40% at 25% 22%, rgba(255,238,210,0.14) 0%, transparent 60%)',
        }}
      />

      {/* Cool subtle leak on opposite side */}
      <div
        className="absolute inset-0 light-leak-cold"
        style={{
          background:
            'radial-gradient(ellipse 40% 35% at 78% 75%, rgba(196,168,138,0.09) 0%, transparent 65%)',
        }}
      />

      {/* Cinematic vignette — gentle, deepens slightly with scroll */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 90% 85% at 50% 50%, transparent 45%, rgba(8,7,6,${vignette}) 100%)`,
        }}
      />

      {/* Soft top + bottom darken — kept very gentle so the picture reads */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(10,9,8,0.28) 0%, transparent 18%, transparent 72%, rgba(10,9,8,0.45) 100%)',
        }}
      />

      {/* Subtle continuous shimmer */}
      <div
        className="absolute inset-0 shimmer-slow"
        style={{
          background:
            'linear-gradient(to bottom, rgba(255,248,235,0.02) 0%, transparent 45%)',
        }}
      />
    </div>
  )
}

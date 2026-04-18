'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface Props {
  src: string
  /**
   * Optional fixed range in viewport heights. When omitted (default),
   * the camera maps to the full scrollable height of the document so
   * t=0 is the very top and t=1 is the very bottom of the page —
   * guaranteeing the user reaches the final dezoom by the end of
   * scroll regardless of how tall the page is.
   */
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
 * The journey has 3 distinct ACTS:
 *
 *   ACT I  — Zoom IN  (first 1/3 of scroll)
 *     The camera pulls into the picture. Almost no pan; the world
 *     gets bigger and more intimate.
 *
 *   ACT II — Pan RIGHT (middle 1/2 of scroll, fast)
 *     The camera holds its zoom and slides across the picture from
 *     left to right (and top to bottom on landscape). This is where
 *     the bulk of the spatial movement happens.
 *
 *   ACT III — Zoom OUT (last 15% of scroll)
 *     The camera releases back to natural cover-fit (scale 1.0).
 *
 * `scale` is a CSS transform applied on top of the cover-fit. It is
 * always >= 1.0 so coverage stays guaranteed (scaling outward from
 * the center never exposes edges).
 *
 *   t=0.00  posX=15 posY=15  scale=1.00  — top-left, natural
 *   t=0.20  posX=18 posY=22  scale=1.25  — zoom-in done early, deeper
 *   t=0.45  posX=85 posY=75  scale=1.25  — swept far right + down
 *   t=1.00  posX=75 posY=60  scale=1.00  — long graceful dezoom
 *
 * Keyframes are interpolated with **PCHIP** (Piecewise Cubic Hermite
 * Interpolating Polynomial) for C¹-continuous motion (no velocity
 * stutter at keyframes) with monotonicity (no overshoot).
 */

const KEYFRAMES = [
  { t: 0.0, posX: 15, posY: 15, scale: 1.0 },
  { t: 0.2, posX: 18, posY: 22, scale: 1.25 },
  { t: 0.45, posX: 85, posY: 75, scale: 1.25 },
  { t: 1.0, posX: 75, posY: 60, scale: 1.0 },
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

function smoothstep01(u: number): number {
  const t = Math.max(0, Math.min(1, u))
  return t * t * (3 - 2 * t)
}

function lerpColor(
  a: [number, number, number],
  b: [number, number, number],
  u: number
): [number, number, number] {
  return [
    Math.round(a[0] + (b[0] - a[0]) * u),
    Math.round(a[1] + (b[1] - a[1]) * u),
    Math.round(a[2] + (b[2] - a[2]) * u),
  ]
}

/**
 * Scroll-driven sun color.
 * t=0   → morning  : amber-orange
 * t=0.5 → midday   : warm white-yellow
 * t=1   → sunset   : orange-red bleeding into purple-rose
 */
function getSunColor(t: number) {
  const morning: [number, number, number] = [255, 162, 60]
  const midday: [number, number, number]  = [255, 252, 210]
  const sunset: [number, number, number]  = [220, 130, 80]
  const dusk: [number, number, number]    = [168, 88, 165]

  if (t <= 0.5) {
    const u = smoothstep01(t * 2)
    return {
      core:      lerpColor(morning, midday, u),
      glow:      lerpColor([255, 195, 105] as [number, number, number], [255, 248, 195] as [number, number, number], u),
      accent:    lerpColor([255, 182, 85]  as [number, number, number], [255, 240, 170] as [number, number, number], u),
      duskAlpha: 0,
    }
  } else {
    const u = smoothstep01((t - 0.5) * 2)
    return {
      core:      lerpColor(midday, sunset, u),
      glow:      lerpColor([255, 248, 195] as [number, number, number], dusk, u),
      accent:    lerpColor([255, 240, 170] as [number, number, number], dusk, u),
      duskAlpha: u * 0.42,
    }
  }
}

/** Scroll-driven “sun”: travels corner-to-corner; intensity swings like time of day. */
function getSunLighting(t: number) {
  const tc = Math.max(0, Math.min(1, t))
  /* Upper-left first — matches natural window light in bg-home */
  const path = [
    { x: 0.05, y: 0.08 },
    { x: 0.93, y: 0.1 },
    { x: 0.88, y: 0.78 },
    { x: 0.12, y: 0.84 },
  ] as const
  const n = path.length - 1
  const p = tc * n
  const i = Math.min(n - 1, Math.floor(p))
  const u = smoothstep01(p - i)
  const a = path[i]
  const b = path[i + 1]
  const sunX = a.x + (b.x - a.x) * u
  const sunY = a.y + (b.y - a.y) * u

  const cx = 0.48
  const cy = 0.46
  const vx = sunX - cx
  const vy = sunY - cy
  const lightAngleDeg = (Math.atan2(vy, vx) * 180) / Math.PI
  const shadowAngleDeg = lightAngleDeg + 180

  const heightBoost = 1 - sunY * 0.75
  const pathPulse = 0.5 + 0.5 * Math.sin(tc * Math.PI * 2.25)
  const intensity = Math.max(
    0.38,
    Math.min(1, 0.42 * heightBoost + 0.38 * pathPulse)
  )

  const sxPct = sunX * 100
  const syPct = sunY * 100
  const oppX = (1 - sunX * 0.92) * 100
  const oppY = (1 - sunY * 0.88) * 100

  /** Conic “from” angle so wedges aim from the sun toward the frame interior. */
  const rayFromDeg =
    (Math.atan2(cy - sunY, cx - sunX) * 180) / Math.PI

  return {
    sunX: sxPct,
    sunY: syPct,
    intensity,
    lightAngleDeg,
    shadowAngleDeg,
    oppX,
    oppY,
    rayFromDeg,
  }
}

export function CinematicBackground({ src, rangeVH }: Props) {
  const [t, setT] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setRevealed(true))
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReducedMotion(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    let ticking = false

    function computeRange(): number {
      if (rangeVH != null) return window.innerHeight * rangeVH
      const doc = document.documentElement
      const docHeight = Math.max(
        doc.scrollHeight,
        doc.offsetHeight,
        document.body.scrollHeight,
        document.body.offsetHeight
      )
      return Math.max(1, docHeight - window.innerHeight)
    }

    function onScroll() {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const y = window.scrollY
        const range = computeRange()
        const local = reducedMotion
          ? 0
          : Math.min(1, Math.max(0, y / range))
        setT(local)
        ticking = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [rangeVH, reducedMotion])

  const camera = getCameraState(t)
  const sun = getSunLighting(t)
  const sunColor = getSunColor(t)
  const [cr, cg, cb] = sunColor.core
  const [gr, gg, gb] = sunColor.glow
  const [ar, ag, ab] = sunColor.accent
  const vignette =
    0.22 + t * 0.1 + (1 - sun.intensity) * 0.06 * (reducedMotion ? 0 : 1)
  const imageOpacity = revealed ? 1 : 0

  const warmAlpha = (0.24 + sun.intensity * 0.28) * (reducedMotion ? 0.55 : 1)
  const coolAlpha = (0.07 + sun.intensity * 0.12) * (reducedMotion ? 0.55 : 1)
  const beamBase = 0.065 + sun.intensity * 0.11
  const rayOpacity = (0.22 + sun.intensity * 0.22) * (reducedMotion ? 0.35 : 1)
  const shadowWash = (0.18 + sun.intensity * 0.22) * (reducedMotion ? 0.45 : 1)
  const shadowRadial = (0.32 + sun.intensity * 0.28) * (reducedMotion ? 0.5 : 1)

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
            transform: `scale(${camera.scale}) translate3d(${(t - 0.5) * 2.8}%, ${(t - 0.5) * -2.2}%, 0)`,
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

      {/* Shadow mass — opposite the sun; moves and strengthens with light */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          mixBlendMode: 'multiply',
          opacity: reducedMotion ? 0.48 : 0.58,
          background: `
            radial-gradient(ellipse 82% 74% at ${sun.oppX}% ${sun.oppY}%, rgba(6,5,4,0) 0%, rgba(5,4,3,${shadowRadial * 0.38}) 48%, rgba(3,2,2,${shadowRadial * 0.62}) 100%),
            linear-gradient(${sun.shadowAngleDeg}deg, rgba(8,6,5,${shadowWash}) 0%, rgba(6,5,4,${shadowWash * 0.5}) 26%, transparent 56%)
          `,
        }}
      />

      {/* Key + fill light — sun pool + cooler bounce (still scroll-linked) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={
          reducedMotion
            ? undefined
            : {
                transform: `translate3d(${(sun.sunX - 50) * 0.04}vw, ${(sun.sunY - 50) * -0.03}vh, 0)`,
              }
        }
      >
        {/* No light-leak-* classes here — their keyframes cap opacity and hide the sun pool */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse ${48 + sun.intensity * 14}% ${38 + sun.intensity * 10}% at ${sun.sunX}% ${sun.sunY}%, rgba(${cr},${cg},${cb},${warmAlpha}) 0%, rgba(${gr},${gg},${gb},${warmAlpha * 0.48}) 36%, transparent 64%),
              radial-gradient(ellipse 32% 28% at ${sun.sunX + 5}% ${sun.sunY - 4}%, rgba(${ar},${ag},${ab},${warmAlpha * 0.68}) 0%, transparent 58%)
            `,
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 52% 46% at ${100 - sun.sunX * 0.75}% ${100 - sun.sunY * 0.7}%, rgba(196,168,138,${coolAlpha}) 0%, transparent 70%)`,
          }}
        />
        {/* Sunset bloom — purple-rose halo that bleeds in from t=0.5 */}
        <div
          className="absolute inset-0 pointer-events-none mix-blend-screen"
          style={{
            opacity: sunColor.duskAlpha,
            background: `
              radial-gradient(ellipse 55% 42% at ${sun.sunX}% ${sun.sunY}%, rgba(185,100,200,0.45) 0%, rgba(150,80,175,0.22) 42%, transparent 68%),
              radial-gradient(ellipse 38% 30% at ${sun.sunX + 8}% ${sun.sunY + 6}%, rgba(210,140,90,0.28) 0%, transparent 55%)
            `,
            transition: 'opacity 800ms ease-out',
          }}
        />
      </div>

      {/* Corner sun rays — conic fan from window direction (visible vs keyframes on .light-leak-*) */}
      <div
        className="absolute inset-[-25%] pointer-events-none mix-blend-screen"
        aria-hidden="true"
        style={{
          opacity: rayOpacity,
          background: `
            repeating-conic-gradient(
              from ${sun.rayFromDeg}deg at ${sun.sunX}% ${sun.sunY}%,
              transparent 0deg,
              transparent 6deg,
              rgba(${ar},${ag},${ab}, 0.13) 7deg,
              rgba(${cr},${cg},${cb}, 0.19) 8deg,
              rgba(${ar},${ag},${ab}, 0.11) 9.2deg,
              transparent 11deg,
              transparent 20deg
            )
          `,
        }}
      />

      {/* Directional beams — broad wash + streaks */}
      <div
        className="absolute inset-[-18%] pointer-events-none mix-blend-screen"
        aria-hidden="true"
        style={{
          opacity: reducedMotion ? beamBase * 0.6 : beamBase * 0.88,
          transform: reducedMotion
            ? undefined
            : `rotate(${sun.lightAngleDeg * 0.12}deg)`,
          transformOrigin: `${sun.sunX}% ${sun.sunY}%`,
          willChange: 'transform, opacity',
          background: `
            linear-gradient(${sun.lightAngleDeg}deg, rgba(${cr},${cg},${cb},${0.05 + sun.intensity * 0.07}) 0%, transparent 34%, transparent 54%, rgba(${gr},${gg},${gb},${0.025 + sun.intensity * 0.04}) 74%, transparent 100%),
            linear-gradient(${sun.lightAngleDeg + 22}deg, transparent 38%, rgba(${ar},${ag},${ab}, ${0.055 + sun.intensity * 0.07}) 49%, rgba(${cr},${cg},${cb}, ${0.03 + sun.intensity * 0.045}) 51%, transparent 63%),
            linear-gradient(${sun.lightAngleDeg - 18}deg, transparent 42%, rgba(${gr},${gg},${gb}, ${0.04 + sun.intensity * 0.06}) 50%, transparent 61%)
          `,
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

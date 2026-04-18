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
 * A pinned "stage" element that holds the full source image (its aspect
 * ratio matches the bitmap so `object-cover` renders the whole picture
 * with no internal crop). The stage is sized **larger than the viewport
 * on both axes regardless of orientation** so the camera can pan freely
 * in any direction.
 *
 * Camera = focal point `(fx, fy)` in image-normalized coords + `scale`.
 * The transform that brings (fx, fy) to viewport center after scaling is:
 *
 *   tx = (0.5 - fx) * scale * 100   (% of stage layout width)
 *   ty = (0.5 - fy) * scale * 100   (% of stage layout height)
 *
 * THREE-PHASE JOURNEY (gentle zoom, generous travel):
 *
 *   PHASE 1  (0 → 0.40)   "the subject"
 *     fx 0.72 → 0.55, fy 0.25 → 0.45, scale 1.18 → 1.05
 *     Soft zoom on the right-top (the model in the mirror) — enough to
 *     focus, not so much that we lose context.
 *
 *   PHASE 2  (0.40 → 0.72)  "the room"
 *     fx 0.55 → 0.30, fy 0.45 → 0.55, scale 1.05 → 1.00
 *     Drift LEFT to reveal the woman in the white shirt and the loft.
 *
 *   PHASE 3  (0.72 → 1.00)  "the descent"
 *     fx 0.30 → 0.55, fy 0.55 → 0.80, scale 1.00 → 1.10
 *     Camera tilts DOWN to the legs and floor with a soft re-zoom.
 *
 * Stage size `max(200vw, 240vh)` keeps the picture covering the viewport
 * at every phase boundary on every orientation (16:9, 16:10, 4:3, square,
 * 9:19.5 mobile, 21:9 ultrawide) with comfortable margins.
 */

const IMAGE_W = 980
const IMAGE_H = 1158

function smoothstep(x: number) {
  const t = Math.max(0, Math.min(1, x))
  return t * t * (3 - 2 * t)
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

interface CameraState {
  fx: number
  fy: number
  scale: number
}

function getCameraState(t: number): CameraState {
  // PHASE 1 — soft zoom on the right-top subject
  if (t < 0.4) {
    const e = smoothstep(t / 0.4)
    return {
      fx: lerp(0.72, 0.55, e),
      fy: lerp(0.25, 0.45, e),
      scale: lerp(1.18, 1.05, e),
    }
  }
  // PHASE 2 — drift left to reveal the room, dezoom to natural size
  if (t < 0.72) {
    const e = smoothstep((t - 0.4) / 0.32)
    return {
      fx: lerp(0.55, 0.3, e),
      fy: lerp(0.45, 0.55, e),
      scale: lerp(1.05, 1.0, e),
    }
  }
  // PHASE 3 — descend to the floor with a soft re-zoom
  const e = smoothstep((t - 0.72) / 0.28)
  return {
    fx: lerp(0.3, 0.55, e),
    fy: lerp(0.55, 0.8, e),
    scale: lerp(1.0, 1.1, e),
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
  // Translate amounts (in % of element layout dims) that center the focal
  // point (fx, fy) of the image at the viewport center after scaling.
  const tx = (0.5 - camera.fx) * camera.scale * 100
  const ty = (0.5 - camera.fy) * camera.scale * 100

  const vignette = 0.28 + t * 0.14
  const imageOpacity = revealed ? 1 : 0

  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* Base color floor — never empty */}
      <div className="absolute inset-0 bg-bg-deep" />

      {/* Stage — naturally larger than viewport on both axes regardless of
          orientation. The aspect-ratio matches the bitmap so the FULL image
          is rendered (no internal cropping); the camera is the transform. */}
      <div
        className="absolute"
        style={{
          width: 'max(200vw, 240vh)',
          aspectRatio: `${IMAGE_W} / ${IMAGE_H}`,
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) translate(${tx}%, ${ty}%) scale(${camera.scale})`,
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
          sizes="200vw"
          className="object-cover"
        />
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

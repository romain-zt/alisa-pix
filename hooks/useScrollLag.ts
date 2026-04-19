'use client'

import { useEffect } from 'react'

/**
 * useScrollLag
 *
 * Global scroll inertia. A single `requestAnimationFrame` loop tracks the
 * raw scroll position and an exponentially-smoothed copy of it. The signed
 * difference (raw − smoothed) is written every frame to the CSS variable
 * `--scroll-lag` on the document root, in pixels.
 *
 * Any element that adds `translate3d(0, var(--scroll-lag, 0px), 0)` to its
 * transform will appear to drift slightly behind the rest of the page,
 * exactly the way the cinematic filaments used to lag — but applied to the
 * elements themselves instead of an SVG overlay.
 *
 * The loop is initialised once per session, the first time any client
 * component calls `useScrollLag()`. Subsequent calls are free.
 *
 * `prefers-reduced-motion: reduce` is honored — the variable stays at 0px.
 *
 *   Tuning knobs:
 *     SMOOTH_TAU — heavier value = heavier drag. 0.14s feels intimate; bump
 *                   towards 0.25s for a more cinematic delay.
 *     CLAMP_PX   — caps the maximum apparent lag. Kept small (≤ 32px) so
 *                   surfaces never displace far enough to break the layout
 *                   on a fast flick — the drift should be a whisper, not a
 *                   slide.
 *
 * The lag is rounded to whole pixels before being written to CSS. GPU
 * compositing of `backdrop-filter` at fractional positions otherwise
 * shimmers as the value decays.
 */

const SMOOTH_TAU = 0.14
const CLAMP_PX = 24

let initialized = false

function initScrollLag() {
  if (initialized || typeof window === 'undefined') return
  initialized = true

  const root = document.documentElement
  let smoothed = window.scrollY
  let lastTime = performance.now()

  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  let reducedMotion = mq.matches
  const onReduceChange = (e: MediaQueryListEvent) => {
    reducedMotion = e.matches
    if (reducedMotion) {
      smoothed = window.scrollY
      root.style.setProperty('--scroll-lag', '0px')
    }
  }
  mq.addEventListener('change', onReduceChange)

  // Hard reset on big jumps (anchor jumps, programmatic scrolls) so we
  // don't snap back through hundreds of pixels with visible drag.
  const resetIfTeleported = () => {
    if (Math.abs(window.scrollY - smoothed) > window.innerHeight * 1.5) {
      smoothed = window.scrollY
      root.style.setProperty('--scroll-lag', '0px')
    }
  }
  window.addEventListener('scroll', resetIfTeleported, { passive: true })

  let lastWrittenPx = 0

  const loop = (now: number) => {
    const dt = Math.min(0.05, (now - lastTime) / 1000)
    lastTime = now

    if (reducedMotion) {
      smoothed = window.scrollY
      if (lastWrittenPx !== 0) {
        root.style.setProperty('--scroll-lag', '0px')
        lastWrittenPx = 0
      }
    } else {
      const target = window.scrollY
      const k = 1 - Math.exp(-dt / SMOOTH_TAU)
      smoothed += (target - smoothed) * k
      let lag = target - smoothed
      if (lag > CLAMP_PX) lag = CLAMP_PX
      else if (lag < -CLAMP_PX) lag = -CLAMP_PX
      // Whole-pixel quantisation — kills the sub-pixel shimmer that
      // backdrop-filter exhibits when an element composites at fractional
      // offsets. Skip the DOM write when the value hasn't changed.
      const rounded = Math.round(lag)
      if (rounded !== lastWrittenPx) {
        root.style.setProperty('--scroll-lag', `${rounded}px`)
        lastWrittenPx = rounded
      }
    }

    requestAnimationFrame(loop)
  }
  requestAnimationFrame(loop)
}

export function useScrollLag() {
  useEffect(() => {
    initScrollLag()
  }, [])
}

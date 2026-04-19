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
 *     SMOOTH_TAU — heavier value = heavier drag. 0.18s feels intimate; bump
 *                   towards 0.30s for a more cinematic delay.
 *     CLAMP_PX   — caps the maximum apparent lag so a fast flick doesn't
 *                   shove surfaces off-screen.
 */

const SMOOTH_TAU = 0.18
const CLAMP_PX = 140

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

  const loop = (now: number) => {
    const dt = Math.min(0.05, (now - lastTime) / 1000)
    lastTime = now

    if (reducedMotion) {
      smoothed = window.scrollY
      root.style.setProperty('--scroll-lag', '0px')
    } else {
      const target = window.scrollY
      const k = 1 - Math.exp(-dt / SMOOTH_TAU)
      smoothed += (target - smoothed) * k
      let lag = target - smoothed
      if (lag > CLAMP_PX) lag = CLAMP_PX
      else if (lag < -CLAMP_PX) lag = -CLAMP_PX
      root.style.setProperty('--scroll-lag', `${lag.toFixed(2)}px`)
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

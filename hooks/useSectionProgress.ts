'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface SectionProgressOptions {
  /** Where in the viewport the section "starts" (0 = top, 1 = bottom). Default 1 (enters from bottom). */
  start?: number
  /** Where in the viewport the section "ends" (0 = top). Default 0 (exits at top). */
  end?: number
}

/**
 * Returns a 0→1 progress value representing how far a section has scrolled
 * through the viewport. Useful for driving scale, opacity, translate, sticky timing.
 *
 * progress = 0 means the section just entered from the bottom.
 * progress = 1 means the section has scrolled past the top.
 */
export function useSectionProgress<T extends HTMLElement>(
  options: SectionProgressOptions = {}
) {
  const ref = useRef<T>(null)
  const [progress, setProgress] = useState(0)
  const rafId = useRef<number>(0)
  const currentProgress = useRef(0)

  const { start = 1, end = 0 } = options

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    if (prefersReducedMotion) {
      setProgress(0.5)
      return
    }

    let ticking = false

    function onScroll() {
      if (ticking) return
      ticking = true

      requestAnimationFrame(() => {
        const rect = el!.getBoundingClientRect()
        const vh = window.innerHeight

        const startPx = vh * start
        const endPx = vh * end

        const raw = (startPx - rect.top) / (startPx - endPx + rect.height)
        const clamped = Math.max(0, Math.min(1, raw))

        if (Math.abs(clamped - currentProgress.current) > 0.001) {
          currentProgress.current = clamped
          setProgress(clamped)
        }

        ticking = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => window.removeEventListener('scroll', onScroll)
  }, [start, end])

  return { ref, progress }
}

/**
 * Lightweight ref-only version that applies transforms directly via style
 * for maximum performance (no React re-renders).
 */
export function useSectionTransform<T extends HTMLElement>(
  transformer: (progress: number) => string,
  options: SectionProgressOptions = {}
) {
  const ref = useRef<T>(null)
  const rafId = useRef<number>(0)

  const { start = 1, end = 0 } = options

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    if (prefersReducedMotion) return

    el.style.willChange = 'transform'
    let ticking = false

    function onScroll() {
      if (ticking) return
      ticking = true

      requestAnimationFrame(() => {
        const rect = el!.getBoundingClientRect()
        const vh = window.innerHeight

        const startPx = vh * start
        const endPx = vh * end

        const raw = (startPx - rect.top) / (startPx - endPx + rect.height)
        const clamped = Math.max(0, Math.min(1, raw))

        el!.style.transform = transformer(clamped)
        ticking = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
      el.style.willChange = 'auto'
    }
  }, [transformer, start, end])

  return ref
}

/**
 * Apply both transform AND opacity based on scroll progress.
 * Direct DOM manipulation, no re-renders.
 */
export function useSectionStyle<T extends HTMLElement>(
  styler: (progress: number) => { transform?: string; opacity?: string },
  options: SectionProgressOptions = {}
) {
  const ref = useRef<T>(null)

  const { start = 1, end = 0 } = options

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    if (prefersReducedMotion) return

    el.style.willChange = 'transform, opacity'
    let ticking = false

    function onScroll() {
      if (ticking) return
      ticking = true

      requestAnimationFrame(() => {
        const rect = el!.getBoundingClientRect()
        const vh = window.innerHeight

        const startPx = vh * start
        const endPx = vh * end

        const raw = (startPx - rect.top) / (startPx - endPx + rect.height)
        const clamped = Math.max(0, Math.min(1, raw))

        const styles = styler(clamped)
        if (styles.transform) el!.style.transform = styles.transform
        if (styles.opacity) el!.style.opacity = styles.opacity

        ticking = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
      el.style.willChange = 'auto'
    }
  }, [styler, start, end])

  return ref
}

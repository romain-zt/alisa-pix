'use client'

import { useEffect, useRef } from 'react'

export function useSmoothParallax<T extends HTMLElement>(
  speed: number,
  maxOffset: number = 100
) {
  const ref = useRef<T>(null)
  const current = useRef(0)
  const target = useRef(0)
  const rafId = useRef<number>(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    if (prefersReducedMotion) return

    const isSmall = window.matchMedia('(max-width: 768px)').matches
    const effectiveSpeed = isSmall ? speed * 0.3 + 0.7 : speed

    function onScroll() {
      const rect = el!.getBoundingClientRect()
      const viewportCenter = window.innerHeight / 2
      const elementCenter = rect.top + rect.height / 2
      const raw = (elementCenter - viewportCenter) * (effectiveSpeed - 1)
      target.current = Math.max(-maxOffset, Math.min(maxOffset, raw))
    }

    function tick() {
      current.current += (target.current - current.current) * 0.06
      el!.style.transform = `translate3d(0, ${current.current}px, 0)`
      rafId.current = requestAnimationFrame(tick)
    }

    el.style.willChange = 'transform'
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    rafId.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafId.current) cancelAnimationFrame(rafId.current)
      el.style.willChange = 'auto'
    }
  }, [speed, maxOffset])

  return ref
}

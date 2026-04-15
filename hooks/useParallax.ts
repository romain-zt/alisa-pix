'use client'

import { useEffect, useRef } from 'react'

export function useParallax<T extends HTMLElement>(speed: number = 0.08) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    if (prefersReducedMotion) return

    const isSmall = window.matchMedia('(max-width: 768px)').matches
    const s = isSmall ? speed * 0.3 : speed

    let ticking = false

    function onScroll() {
      if (ticking) return
      ticking = true

      requestAnimationFrame(() => {
        const rect = el!.getBoundingClientRect()
        const center = window.innerHeight / 2
        const elCenter = rect.top + rect.height / 2
        const offset = (elCenter - center) * s

        el!.style.transform = `translateY(${offset}px)`
        ticking = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => window.removeEventListener('scroll', onScroll)
  }, [speed])

  return ref
}

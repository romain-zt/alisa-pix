'use client'

import { useEffect, useRef } from 'react'
import { animate } from 'animejs'

interface RevealOptions {
  translateY?: number
  duration?: number
  delay?: number
  easing?: string
  threshold?: number
}

export function useScrollReveal<T extends HTMLElement>(
  options: RevealOptions = {}
) {
  const ref = useRef<T>(null)
  const hasRevealed = useRef(false)

  const {
    translateY = 30,
    duration = 1000,
    delay = 0,
    easing = 'cubicBezier(0.16, 1, 0.3, 1)',
    threshold = 0.15,
  } = options

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) {
      el.style.opacity = '1'
      return
    }

    el.style.opacity = '0'
    el.style.transform = `translateY(${translateY}px)`

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRevealed.current) {
          hasRevealed.current = true

          animate(el, {
            opacity: [0, 1],
            translateY: [translateY, 0],
            duration,
            delay,
            ease: easing,
          })

          observer.disconnect()
        }
      },
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [translateY, duration, delay, easing, threshold])

  return ref
}

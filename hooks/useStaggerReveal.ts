'use client'

import { useEffect, useRef } from 'react'
import { animate, utils } from 'animejs'

interface StaggerOptions {
  stagger?: number
  translateY?: number
  duration?: number
  easing?: string
  threshold?: number
}

export function useStaggerReveal<T extends HTMLElement>(
  childSelector: string,
  options: StaggerOptions = {}
) {
  const ref = useRef<T>(null)
  const hasRevealed = useRef(false)

  const {
    stagger = 100,
    translateY = 25,
    duration = 900,
    easing = 'cubicBezier(0.16, 1, 0.3, 1)',
    threshold = 0.1,
  } = options

  useEffect(() => {
    const container = ref.current
    if (!container) return

    const children = container.querySelectorAll(childSelector)
    if (!children.length) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) {
      children.forEach((child) => {
        ;(child as HTMLElement).style.opacity = '1'
      })
      return
    }

    children.forEach((child) => {
      ;(child as HTMLElement).style.opacity = '0'
      ;(child as HTMLElement).style.transform = `translateY(${translateY}px)`
    })

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRevealed.current) {
          hasRevealed.current = true

          animate(Array.from(children) as HTMLElement[], {
            opacity: [0, 1],
            translateY: [translateY, 0],
            duration,
            ease: easing,
            delay: utils.stagger(stagger),
          })

          observer.disconnect()
        }
      },
      { threshold }
    )

    observer.observe(container)
    return () => observer.disconnect()
  }, [childSelector, stagger, translateY, duration, easing, threshold])

  return ref
}

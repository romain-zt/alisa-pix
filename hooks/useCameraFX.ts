'use client'

import { useEffect, useRef } from 'react'
import { animate, createTimeline } from 'animejs'

const REDUCED_MOTION = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Focus Pull — blur → sharp, like racking focus on a cinema lens.
 * Use sparingly: max 2× per page.
 */
export function useFocusPull<T extends HTMLElement>(options: {
  blur?: number
  brightness?: [number, number]
  duration?: number
  delay?: number
  autoPlay?: boolean
} = {}) {
  const ref = useRef<T>(null)
  const hasPlayed = useRef(false)

  const {
    blur = 12,
    brightness = [0.8, 1],
    duration = 1800,
    delay = 0,
    autoPlay = true,
  } = options

  const play = () => {
    const el = ref.current
    if (!el || REDUCED_MOTION()) return
    hasPlayed.current = true

    animate(el, {
      filter: [
        `blur(${blur}px) brightness(${brightness[0]})`,
        `blur(0px) brightness(${brightness[1]})`,
      ],
      duration,
      delay,
      ease: 'cubicBezier(0.16, 1, 0.3, 1)',
    })
  }

  useEffect(() => {
    if (autoPlay && !hasPlayed.current) play()
  }, [])

  return { ref, play }
}

/**
 * Lens Zoom — optical zoom-out with deceleration.
 * Combine with .lens-vignette CSS for real lens feel.
 * Use sparingly: max 2× per page.
 */
export function useLensZoom<T extends HTMLElement>(options: {
  from?: number
  to?: number
  duration?: number
  delay?: number
  autoPlay?: boolean
} = {}) {
  const ref = useRef<T>(null)
  const hasPlayed = useRef(false)

  const {
    from = 1.2,
    to = 1,
    duration = 2000,
    delay = 0,
    autoPlay = true,
  } = options

  const play = () => {
    const el = ref.current
    if (!el || REDUCED_MOTION()) return
    hasPlayed.current = true

    animate(el, {
      scale: [from, to],
      duration,
      delay,
      ease: 'cubicBezier(0.16, 1, 0.3, 1)',
    })
  }

  useEffect(() => {
    if (autoPlay && !hasPlayed.current) play()
  }, [])

  return { ref, play }
}

/**
 * Light Reveal — opacity with directional lighting feel.
 * Pair with a radial-gradient light overlay div.
 * Use sparingly: max 3× per page.
 */
export function useLightReveal<T extends HTMLElement>(options: {
  duration?: number
  delay?: number
  autoPlay?: boolean
} = {}) {
  const ref = useRef<T>(null)
  const hasPlayed = useRef(false)

  const {
    duration = 1200,
    delay = 0,
    autoPlay = true,
  } = options

  const play = () => {
    const el = ref.current
    if (!el || REDUCED_MOTION()) return
    hasPlayed.current = true

    animate(el, {
      opacity: [0, 1],
      duration,
      delay,
      ease: 'cubicBezier(0.16, 1, 0.3, 1)',
    })
  }

  useEffect(() => {
    if (autoPlay && !hasPlayed.current) play()
  }, [])

  return { ref, play }
}

/**
 * Frame Reveal — clipPath inset, like opening a shutter or pulling a curtain.
 * Use ONCE per page max.
 */
export function useFrameReveal<T extends HTMLElement>(options: {
  direction?: 'up' | 'down' | 'left' | 'right'
  duration?: number
  delay?: number
  autoPlay?: boolean
  triggerOnScroll?: boolean
} = {}) {
  const ref = useRef<T>(null)
  const hasPlayed = useRef(false)

  const {
    direction = 'up',
    duration = 1400,
    delay = 0,
    autoPlay = false,
    triggerOnScroll = true,
  } = options

  const clipFrom: Record<string, string> = {
    up: 'inset(100% 0 0 0)',
    down: 'inset(0 0 100% 0)',
    left: 'inset(0 100% 0 0)',
    right: 'inset(0 0 0 100%)',
  }

  const play = () => {
    const el = ref.current
    if (!el || hasPlayed.current || REDUCED_MOTION()) return
    hasPlayed.current = true

    animate(el, {
      clipPath: [clipFrom[direction], 'inset(0 0 0 0)'],
      duration,
      delay,
      ease: 'cubicBezier(0.16, 1, 0.3, 1)',
    })
  }

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (REDUCED_MOTION()) {
      el.style.clipPath = 'inset(0 0 0 0)'
      return
    }

    el.style.clipPath = clipFrom[direction]

    if (autoPlay) {
      play()
      return
    }

    if (triggerOnScroll) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            play()
            observer.disconnect()
          }
        },
        { threshold: 0.2 }
      )
      observer.observe(el)
      return () => observer.disconnect()
    }
  }, [])

  return { ref, play }
}

/**
 * Combined Camera Opening — focus + lens + light in a single timeline.
 * For hero/opening sections only. Max 1× per page.
 */
export function useCameraOpening(options: {
  selectors: {
    image: string
    light?: string
    brand?: string
  }
  blur?: number
  scaleFrom?: number
  duration?: number
} = {
  selectors: { image: '.camera-image' },
}) {
  const ref = useRef<HTMLElement>(null)
  const hasPlayed = useRef(false)

  const {
    selectors,
    blur = 10,
    scaleFrom = 1.15,
    duration = 2500,
  } = options

  useEffect(() => {
    if (!ref.current || hasPlayed.current) return
    hasPlayed.current = true

    if (REDUCED_MOTION()) {
      const img = ref.current.querySelector(selectors.image) as HTMLElement
      if (img) {
        img.style.opacity = '1'
        img.style.filter = 'none'
      }
      if (selectors.brand) {
        const brand = ref.current.querySelector(selectors.brand) as HTMLElement
        if (brand) brand.style.opacity = '1'
      }
      return
    }

    const img = ref.current.querySelector(selectors.image) as HTMLElement
    const light = selectors.light
      ? ref.current.querySelector(selectors.light) as HTMLElement
      : null
    const brand = selectors.brand
      ? ref.current.querySelector(selectors.brand) as HTMLElement
      : null

    const tl = createTimeline({
      defaults: { ease: 'cubicBezier(0.16, 1, 0.3, 1)' },
    })

    if (img) {
      tl.add(img, {
        filter: [`blur(${blur}px)`, 'blur(0px)'],
        scale: [scaleFrom, 1],
        opacity: [0, 1],
        duration,
      }, 400)
    }

    if (light) {
      tl.add(light, {
        opacity: [0, 1],
        duration: duration * 0.8,
      }, 200)
    }

    if (brand) {
      tl.add(brand, {
        opacity: [0, 1],
        translateX: [-10, 0],
        duration: 1200,
      }, duration * 0.7)
    }
  }, [])

  return ref
}

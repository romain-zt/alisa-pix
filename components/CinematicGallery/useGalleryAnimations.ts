'use client'

import { useEffect, useRef, type RefObject } from 'react'
import { animate, createTimeline, stagger } from 'animejs'

export function useSlideEntrance(
  isActive: boolean,
  counterRef: RefObject<HTMLSpanElement | null>,
  captionRef: RefObject<HTMLSpanElement | null>,
) {
  const hasPlayed = useRef(false)

  useEffect(() => {
    if (!isActive || hasPlayed.current) return
    hasPlayed.current = true

    const targets: HTMLElement[] = []
    if (counterRef.current) targets.push(counterRef.current)
    if (captionRef.current) targets.push(captionRef.current)

    if (targets.length === 0) return

    const tl = createTimeline({
      defaults: { duration: 800, ease: 'outExpo' },
    })

    tl.add(targets, {
      opacity: [0, 1],
      translateY: [12, 0],
      delay: stagger(120),
    }, 200)

    return () => {
      tl.pause()
    }
  }, [isActive, counterRef, captionRef])
}

export function useCounterScrub(
  counterRef: RefObject<HTMLSpanElement | null>,
  activeIndex: number,
  total: number,
) {
  const prevIndex = useRef(activeIndex)

  useEffect(() => {
    const el = counterRef.current
    if (!el || prevIndex.current === activeIndex) return

    const direction = activeIndex > prevIndex.current ? 1 : -1
    prevIndex.current = activeIndex

    animate(el, {
      opacity: [1, 0],
      translateY: [0, -8 * direction],
      duration: 200,
      ease: 'inQuad',
    }).then(() => {
      el.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`
      animate(el, {
        opacity: [0, 1],
        translateY: [8 * direction, 0],
        duration: 400,
        ease: 'outExpo',
      })
    })
  }, [activeIndex, total, counterRef])
}

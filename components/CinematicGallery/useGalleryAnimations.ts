'use client'

import { useEffect, useRef, type RefObject } from 'react'
import { animate } from 'animejs'

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

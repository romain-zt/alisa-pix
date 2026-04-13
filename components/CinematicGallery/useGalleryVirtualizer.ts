'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { GalleryImage, VirtualWindow } from './types'

const WINDOW_SIZE = 5
const HALF_WINDOW = Math.floor(WINDOW_SIZE / 2)
const PRELOAD_AHEAD = 3

function preloadImage(src: string) {
  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.src = src
}

export function useGalleryVirtualizer(images: GalleryImage[]) {
  const [activeIndex, setActiveIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const preloadedRef = useRef<Set<string>>(new Set())

  const getWindow = useCallback(
    (index: number): VirtualWindow => {
      const total = images.length
      const start = Math.max(0, index - HALF_WINDOW)
      const end = Math.min(total - 1, index + HALF_WINDOW)

      const visibleSlides = []
      for (let i = start; i <= end; i++) {
        visibleSlides.push({ image: images[i], index: i })
      }

      return {
        startIndex: start,
        endIndex: end,
        activeIndex: index,
        visibleSlides,
      }
    },
    [images],
  )

  const [virtualWindow, setVirtualWindow] = useState<VirtualWindow>(() => getWindow(0))

  useEffect(() => {
    const total = images.length
    const preloadEnd = Math.min(total - 1, activeIndex + HALF_WINDOW + PRELOAD_AHEAD)
    for (let i = activeIndex + HALF_WINDOW + 1; i <= preloadEnd; i++) {
      const src = images[i].src
      if (!preloadedRef.current.has(src)) {
        preloadedRef.current.add(src)
        preloadImage(src)
      }
    }
  }, [activeIndex, images])

  useEffect(() => {
    setVirtualWindow(getWindow(activeIndex))
  }, [activeIndex, getWindow])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      (entries) => {
        let bestEntry: IntersectionObserverEntry | null = null
        let bestRatio = 0

        for (const entry of entries) {
          if (entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio
            bestEntry = entry
          }
        }

        if (bestEntry && bestRatio > 0.3) {
          const idx = Number((bestEntry.target as HTMLElement).dataset.slideIndex)
          if (!isNaN(idx)) {
            setActiveIndex(idx)
          }
        }
      },
      {
        root: null,
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    )

    const slides = container.querySelectorAll('[data-slide-index]')
    slides.forEach((slide) => observer.observe(slide))

    return () => observer.disconnect()
  }, [virtualWindow.visibleSlides.length])

  return {
    containerRef,
    virtualWindow,
    activeIndex,
    total: images.length,
    setActiveIndex,
  }
}

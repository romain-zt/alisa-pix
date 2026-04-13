'use client'

import { useRef } from 'react'
import GallerySlide from './GallerySlide'
import HorizontalScroller from './HorizontalScroller'
import { useGalleryVirtualizer } from './useGalleryVirtualizer'
import { useCounterScrub } from './useGalleryAnimations'
import type { CinematicGalleryProps } from './types'

export default function CinematicGallery({
  images,
  mode = 'vertical',
  showCounter = true,
  className = '',
}: CinematicGalleryProps) {
  const { containerRef, virtualWindow, activeIndex, total } = useGalleryVirtualizer(images)
  const globalCounterRef = useRef<HTMLSpanElement>(null)

  useCounterScrub(globalCounterRef, activeIndex, total)

  const slides = virtualWindow.visibleSlides.map(({ image, index }) => (
    <GallerySlide
      key={`${image.src}-${index}`}
      image={image}
      index={index}
      total={total}
      isActive={index === activeIndex}
      showCounter={false}
    />
  ))

  const topSpacerHeight = virtualWindow.startIndex * 100
  const bottomSpacerHeight = (total - 1 - virtualWindow.endIndex) * 100

  if (mode === 'horizontal') {
    return (
      <div className={`relative ${className}`}>
        <HorizontalScroller slideCount={total}>
          <div ref={containerRef} className="flex h-full">
            {images.map((image, index) => (
              <GallerySlide
                key={`${image.src}-${index}`}
                image={image}
                index={index}
                total={total}
                isActive={index === activeIndex}
                showCounter={false}
              />
            ))}
          </div>
        </HorizontalScroller>

        {showCounter && (
          <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 pointer-events-none">
            <span
              ref={globalCounterRef}
              className="font-sans text-xs md:text-sm tracking-[0.25em] text-off-white/40 tabular-nums"
            >
              {`${String(activeIndex + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`}
            </span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <div ref={containerRef}>
        {topSpacerHeight > 0 && (
          <div style={{ height: `${topSpacerHeight}dvh` }} aria-hidden />
        )}
        {slides}
        {bottomSpacerHeight > 0 && (
          <div style={{ height: `${bottomSpacerHeight}dvh` }} aria-hidden />
        )}
      </div>

      {showCounter && (
        <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 pointer-events-none">
          <span
            ref={globalCounterRef}
            className="font-sans text-xs md:text-sm tracking-[0.25em] text-off-white/40 tabular-nums"
          >
            {`${String(activeIndex + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`}
          </span>
        </div>
      )}
    </div>
  )
}

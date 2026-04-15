'use client'

import { useCallback, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useSectionProgress, useSectionStyle } from '@/hooks/useSectionProgress'

interface OverflowImageProps {
  src: string
  text?: string
}

export function OverflowImage({ src, text }: OverflowImageProps) {
  const sectionElRef = useRef<HTMLElement>(null)
  const { ref: progressRef, progress } = useSectionProgress<HTMLElement>()
  const focusRef = useRef<HTMLDivElement>(null)

  const setRef = useCallback(
    (node: HTMLElement | null) => {
      sectionElRef.current = node
      ;(progressRef as React.MutableRefObject<HTMLElement | null>).current =
        node
    },
    [progressRef]
  )

  const imageStyler = useCallback((p: number) => {
    const y = 30 - p * 60
    const scale = 1.15 + p * 0.08
    return { transform: `translate3d(0, ${y}px, 0) scale(${scale})` }
  }, [])
  const imageRef = useSectionStyle<HTMLDivElement>(imageStyler)

  useEffect(() => {
    const el = focusRef.current
    if (!el) return
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      el.style.filter = 'none'
      return
    }

    el.style.filter = 'blur(3px) brightness(0.85)'
    el.style.transition =
      'filter 2200ms cubic-bezier(0.16, 1, 0.3, 1)'

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.filter = 'blur(0px) brightness(1)'
          observer.disconnect()
        }
      },
      { threshold: 0.08 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const textOpacity =
    progress > 0.3 && progress < 0.8
      ? Math.min(0.8, (progress - 0.3) * 1.6)
      : progress >= 0.8
        ? Math.max(0, 0.8 - (progress - 0.8) * 4)
        : 0

  return (
    <section
      ref={setRef}
      className="relative min-h-[130vh] md:min-h-[150vh] overflow-hidden"
      style={{ background: 'var(--color-tone-shadow)' }}
    >
      {/* Oversized image — bigger than viewport, cropped, slow parallax */}
      <div ref={imageRef} className="absolute inset-[-15%] z-[1]">
        <div ref={focusRef} className="relative w-full h-full">
          <Image
            src={src}
            alt=""
            fill
            className="object-cover"
            sizes="130vw"
          />
        </div>
      </div>

      {/* Vignette — dark edges, intimate crop feeling */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 65% 55% at 50% 50%, transparent 30%, rgba(10,9,8,0.7) 100%)',
        }}
      />

      {/* Text overlay — partially on image */}
      {text && (
        <div
          className="absolute z-[3] bottom-[15vh] md:bottom-[20vh] right-6 md:right-[10vw]"
          style={{
            opacity: textOpacity,
            transform: `translate3d(${(0.5 - progress) * 20}px, 0, 0)`,
          }}
        >
          <p className="font-serif italic text-[var(--text-lead)] md:text-[var(--text-title)] text-text-primary/60 select-none">
            {text}
          </p>
        </div>
      )}
    </section>
  )
}

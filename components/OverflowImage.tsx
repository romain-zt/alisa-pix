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
      ;(progressRef as React.MutableRefObject<HTMLElement | null>).current = node
    },
    [progressRef]
  )

  // Gas layer — blurred, counter-drift to subject
  const gasStyler = useCallback((p: number) => {
    const y = -25 + p * 50
    const x = 10 - p * 20
    const opacity = p < 0.1 ? p / 0.1 * 0.16 : p > 0.85 ? (1 - p) / 0.15 * 0.16 : 0.16
    return {
      transform: `translate3d(${x}px, ${y}px, 0) scale(1.35)`,
      opacity: `${opacity}`,
    }
  }, [])
  const gasRef = useSectionStyle<HTMLDivElement>(gasStyler)

  const imageStyler = useCallback((p: number) => {
    const curved = Math.pow(p, 1.6)
    const y = 40 - curved * 80
    const scale = 1.12 + curved * 0.1
    return { transform: `translate3d(0, ${y}px, 0) scale(${scale})` }
  }, [])
  const imageRef = useSectionStyle<HTMLDivElement>(imageStyler)

  const lightStyler = useCallback((p: number) => {
    const x = 20 + p * 50
    const y = 30 + p * 20
    const intensity = p > 0.08 && p < 0.75
      ? Math.min(0.1, Math.pow((p - 0.08) / 0.67, 0.7) * 0.1)
      : 0
    return {
      opacity: `${intensity}`,
      transform: `translate3d(${x - 45}px, ${y - 35}px, 0)`,
    }
  }, [])
  const lightRef = useSectionStyle<HTMLDivElement>(lightStyler)

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

    el.style.filter = 'blur(4px) brightness(0.7) saturate(0.4)'
    el.style.transition =
      'filter 3000ms cubic-bezier(0.87, 0, 0.13, 1)'

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.filter = 'blur(0px) brightness(1) saturate(1)'
          observer.disconnect()
        }
      },
      { threshold: 0.06 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const clipRadius = progress > 0.05
    ? Math.min(85, 5 + Math.pow((progress - 0.05) / 0.95, 0.4) * 80)
    : 5

  const textOpacity =
    progress > 0.35 && progress < 0.85
      ? Math.min(0.85, Math.pow((progress - 0.35) / 0.5, 0.5) * 0.85)
      : progress >= 0.85
        ? Math.max(0, 0.85 - (progress - 0.85) * 5.67)
        : 0

  return (
    <section
      ref={setRef}
      className="relative min-h-[135vh] md:min-h-[155vh] overflow-hidden"
      style={{ background: 'var(--color-tone-shadow)' }}
    >
      {/* Gas layer — blurred, counter-drift, low opacity */}
      <div
        ref={gasRef}
        className="absolute inset-[-35%] z-[0] opacity-0"
      >
        <Image
          src={src}
          alt=""
          fill
          className="object-cover blur-[14px]"
          sizes="170vw"
        />
      </div>

      {/* Subject — oversized image, clip-path circle reveal + parallax */}
      <div
        ref={imageRef}
        className="absolute inset-[-18%] z-[1]"
        style={{
          clipPath: `circle(${clipRadius}% at 48% 45%)`,
          transition: 'clip-path 100ms linear',
        }}
      >
        <div ref={focusRef} className="relative w-full h-full">
          <Image
            src={src}
            alt=""
            fill
            className="object-cover"
            sizes="136vw"
          />
        </div>
      </div>

      {/* Moving directional light — sweeps across image */}
      <div
        ref={lightRef}
        className="absolute inset-0 z-[2] pointer-events-none opacity-0"
        style={{
          background:
            'radial-gradient(ellipse 40% 50% at 35% 40%, rgba(255,245,230,0.15) 0%, transparent 60%)',
        }}
      />

      {/* Deep vignette — more aggressive, asymmetric */}
      <div
        className="absolute inset-0 z-[3] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 55% 45% at 48% 45%, transparent 25%, rgba(10,9,8,0.75) 100%)',
        }}
      />

      {/* Text — appears BEFORE image is fully revealed */}
      {text && (
        <div
          className="absolute z-[4] bottom-[18vh] md:bottom-[22vh] right-8 md:right-[8vw]"
          style={{
            opacity: textOpacity,
            transform: `translate3d(${(0.6 - progress) * 30}px, ${(0.5 - progress) * -10}px, 0)`,
          }}
        >
          <p className="font-serif italic text-[var(--text-lead)] md:text-[var(--text-title)] text-text-primary/70 select-none">
            {text}
          </p>
        </div>
      )}
    </section>
  )
}

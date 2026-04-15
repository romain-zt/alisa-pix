'use client'

import { useCallback } from 'react'
import Image from 'next/image'
import { useSectionProgress, useSectionStyle } from '@/hooks/useSectionProgress'

export function ImpactImage({ src }: { src: string }) {
  const { ref, progress } = useSectionProgress<HTMLElement>()

  // Image: very slow zoom OUT (1.08 → 1.0), creates a receding feeling
  const imageStyler = useCallback((p: number) => {
    const scale = 1.08 - p * 0.08
    return { transform: `scale(${scale})` }
  }, [])
  const imageRef = useSectionStyle<HTMLDivElement>(imageStyler)

  // B&W → color reveal: starts desaturated, gains color as you scroll through
  const grayscale = Math.max(0, 0.85 - progress * 1.1)
  const brightness = 0.85 + progress * 0.15

  // Opacity: fade in from darkness, hold, fade to darkness
  const opacity = progress < 0.08
    ? progress * 12.5
    : progress > 0.88
      ? (1 - progress) * 8.33
      : 1

  return (
    <section
      ref={ref}
      className="relative h-[120vh] md:h-[130vh] overflow-hidden"
    >
      {/* Deep vignette frame — the image sits inside darkness */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 65% 55% at 50% 48%, transparent 30%, rgba(10,9,8,0.5) 65%, rgba(10,9,8,0.95) 100%)',
        }}
      />

      {/* Top/bottom gradient bleed into surrounding void */}
      <div className="absolute inset-x-0 top-0 h-[15vh] z-10 pointer-events-none bg-gradient-to-b from-bg-deep to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[15vh] z-10 pointer-events-none bg-gradient-to-t from-bg-deep to-transparent" />

      {/* The image — full bleed, slow zoom, B&W reveal */}
      <div
        ref={imageRef}
        className="absolute inset-[-5%]"
        style={{
          opacity: Math.max(0, opacity),
          filter: `grayscale(${grayscale}) brightness(${brightness}) contrast(1.05)`,
          transition: 'filter 150ms linear',
        }}
      >
        <Image
          src={src}
          alt=""
          fill
          className="object-cover"
          sizes="110vw"
        />
      </div>
    </section>
  )
}

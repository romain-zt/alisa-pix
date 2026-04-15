'use client'

import { useCallback } from 'react'
import Image from 'next/image'
import { useSectionProgress, useSectionStyle } from '@/hooks/useSectionProgress'

export function Intimacy({ src }: { src: string }) {
  const { ref: sectionRef, progress } = useSectionProgress<HTMLElement>()

  // Image: very slow zoom IN (1.0 → 1.06) — growing intimacy
  const imageStyler = useCallback((p: number) => {
    const scale = 1.0 + p * 0.06
    return { transform: `scale(${scale})` }
  }, [])
  const imageRef = useSectionStyle<HTMLDivElement>(imageStyler)

  // Text: independent of image — drifts upward at a different rate
  const textStyler = useCallback((p: number) => {
    const y = 30 - p * 50
    const opacity = p < 0.25 ? p * 4 : p > 0.85 ? (1 - p) * 6.67 : 1
    return {
      transform: `translate3d(0, ${y}px, 0)`,
      opacity: `${Math.min(1, opacity)}`,
    }
  }, [])
  const textRef = useSectionStyle<HTMLDivElement>(textStyler)

  // Puncture: whisper that appears before the text, independent timing
  const punctureOpacity = progress > 0.1 && progress < 0.5
    ? Math.min(0.35, (progress - 0.1) * 0.875)
    : progress >= 0.5
      ? Math.max(0, 0.35 - (progress - 0.5) * 0.7)
      : 0

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[120vh] md:min-h-[140vh] overflow-hidden"
    >
      {/* Warm atmosphere — denser, more intimate than other sections */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 45% 40%, #100d0a 0%, #0d0907 55%, #0a0908 100%)',
        }}
      />

      {/* Emotional puncture — arrives before anything else */}
      <span
        className="absolute z-30
          top-[8vh] left-6
          md:top-[10vh] md:left-[14vw]
          font-serif italic text-[var(--text-body)] text-text-muted/25 select-none pointer-events-none"
        style={{
          opacity: punctureOpacity,
          transform: `translate3d(${progress * -8}px, 0, 0)`,
        }}
      >
        breathe
      </span>

      {/* Image — zoom IN, centered, mask dissolves edges */}
      <div className="relative z-10 flex items-center justify-center pt-[16vh] md:pt-[22vh]">
        <div
          ref={imageRef}
          className="w-[84vw] md:w-[40vw] max-w-[560px]"
        >
          <div className="relative aspect-[4/5] overflow-hidden mask-soft-edges">
            <Image
              src={src}
              alt=""
              fill
              className="object-cover"
              sizes="(min-width: 768px) 40vw, 84vw"
            />
          </div>
        </div>
      </div>

      {/* Contact whisper — moves independently of image */}
      <div
        ref={textRef}
        className="relative z-10 mt-10 md:mt-14 px-6
          md:ml-[52vw] md:text-left text-center"
      >
        <p className="text-[var(--text-micro)] tracking-[0.25em] uppercase text-text-muted mb-4">
          By appointment
        </p>
        <a
          href="mailto:hello@vasilisa.com"
          className="font-serif font-light text-[var(--text-lead)] text-accent underline underline-offset-4 decoration-accent-soft transition-opacity duration-700 hover:opacity-60"
        >
          hello@vasilisa.com
        </a>
      </div>

      {/* Final puncture — softer, at the very end of the experience */}
      <span
        className="absolute z-20
          bottom-[6vh] right-8
          md:bottom-[10vh] md:right-[16vw]
          text-[var(--text-micro)] tracking-[0.4em] uppercase text-text-muted/20 select-none pointer-events-none"
        style={{
          opacity: progress > 0.7 ? Math.min(0.3, (progress - 0.7) * 1) : 0,
        }}
      >
        again
      </span>
    </section>
  )
}

'use client'

import { useCallback } from 'react'
import Image from 'next/image'
import { useSectionProgress, useSectionStyle } from '@/hooks/useSectionProgress'

export function Intimacy({ src }: { src: string }) {
  const { ref: sectionRef, progress } = useSectionProgress<HTMLElement>()

  // Image: slow zoom IN (0.98 → 1.07) — approaching intimacy
  const imageStyler = useCallback((p: number) => {
    const scale = 0.98 + p * 0.09
    const x = 3 - p * 6
    return { transform: `translate3d(${x}px, 0, 0) scale(${scale})` }
  }, [])
  const imageRef = useSectionStyle<HTMLDivElement>(imageStyler)

  // Background atmospheric layer — drifts slowly in opposite direction
  const bgStyler = useCallback((p: number) => {
    const y = 20 - p * 40
    const x = -10 + p * 20
    const opacity = p < 0.1 ? p * 10 * 0.18 : p > 0.85 ? (1 - p) * 6.67 * 0.18 : 0.18
    return {
      transform: `translate3d(${x}px, ${y}px, 0) scale(1.25)`,
      opacity: `${opacity}`,
    }
  }, [])
  const bgRef = useSectionStyle<HTMLDivElement>(bgStyler)

  // Text: independent — drifts from right, not up
  const textStyler = useCallback((p: number) => {
    const x = 20 - p * 30
    const y = 10 - p * 20
    const opacity = p < 0.3 ? (p / 0.3) : p > 0.85 ? (1 - p) * 6.67 : 1
    return {
      transform: `translate3d(${x}px, ${y}px, 0)`,
      opacity: `${Math.min(1, opacity)}`,
    }
  }, [])
  const textRef = useSectionStyle<HTMLDivElement>(textStyler)

  // Puncture "breathe": serif italic, title size — appears before anything else
  const breatheOpacity = progress > 0.05 && progress < 0.4
    ? Math.min(0.5, (progress - 0.05) * 1.43)
    : progress >= 0.4
      ? Math.max(0, 0.5 - (progress - 0.4) * 0.83)
      : 0

  // Puncture "again": appears at the very end, small, tracked
  const againOpacity = progress > 0.75
    ? Math.min(0.3, (progress - 0.75) * 1.2)
    : 0

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[140vh] md:min-h-[170vh] overflow-hidden"
      style={{ marginTop: 'clamp(-4rem, -6vh, -8rem)' }}
    >
      {/* Warm radial atmosphere */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 35% 35%, #110e0b 0%, #0d0907 50%, #0a0908 100%)',
        }}
      />

      {/* Background depth layer — same image blurred, opposed drift */}
      <div
        ref={bgRef}
        className="absolute inset-[-30%] z-[1]"
      >
        <Image
          src={src}
          alt=""
          fill
          className="object-cover blur-[10px]"
          sizes="160vw"
        />
      </div>

      {/* Puncture "breathe" — serif italic, title size, arrives first */}
      <span
        className="absolute z-30
          top-[6vh] left-6
          md:top-[8vh] md:left-[12vw]
          font-serif italic text-[var(--text-title)] text-text-muted/20 select-none pointer-events-none"
        style={{
          opacity: breatheOpacity,
          transform: `translate3d(${progress * -18}px, ${progress * 8}px, 0)`,
        }}
      >
        breathe
      </span>

      {/* Image — off-center on desktop (left-biased), soft edges */}
      <div className="relative z-10 pt-[14vh] md:pt-[18vh]">
        <div
          ref={imageRef}
          className="
            w-[88vw] mx-auto
            md:w-[42vw] md:ml-[8vw] md:mr-0
          "
        >
          <div className="relative aspect-[4/5] overflow-hidden mask-soft-edges">
            <Image
              src={src}
              alt=""
              fill
              className="object-cover"
              sizes="(min-width: 768px) 42vw, 88vw"
            />
          </div>
        </div>
      </div>

      {/* Contact — approaches from the right, independent drift */}
      <div
        ref={textRef}
        className="relative z-10 mt-12 md:mt-16 px-6
          md:ml-[55vw] md:text-left text-center"
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

      {/* Puncture "again" — end of experience, opposite corner */}
      <span
        className="absolute z-20
          bottom-[5vh] right-8
          md:bottom-[8vh] md:right-[14vw]
          text-[var(--text-micro)] tracking-[0.4em] uppercase text-text-muted/15 select-none pointer-events-none"
        style={{
          opacity: againOpacity,
          transform: `translate3d(${(1 - progress) * 10}px, 0, 0)`,
        }}
      >
        again
      </span>

      {/* Foreground accent — diagonal line, late appearance, independent */}
      <div
        className="hidden md:block absolute z-20 right-[20vw] bottom-[22vh] w-16 h-px bg-accent-soft pointer-events-none"
        style={{
          opacity: progress > 0.6 && progress < 0.9
            ? Math.min(0.2, (progress - 0.6) * 0.67)
            : 0,
          transform: `rotate(12deg) scaleX(${0.4 + progress * 0.6})`,
          transformOrigin: 'right center',
        }}
      />
    </section>
  )
}

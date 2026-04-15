'use client'

import { useCallback } from 'react'
import Image from 'next/image'
import { useSectionProgress, useSectionStyle } from '@/hooks/useSectionProgress'

export function FragmentCluster({ images }: { images: readonly string[] }) {
  const { ref: sectionRef, progress } = useSectionProgress()

  // Fragment 1: sticky-feeling via slow parallax, slight zoom OUT (1.03 → 1.0)
  const f1Styler = useCallback((p: number) => {
    const scale = 1.03 - p * 0.03
    const y = 20 - p * 40
    return { transform: `translate3d(0, ${y}px, 0) scale(${scale})` }
  }, [])
  const f1Ref = useSectionStyle<HTMLDivElement>(f1Styler)

  // Fragment 2: drifts right + down, very slow — feels autonomous
  const f2Styler = useCallback((p: number) => {
    const x = -8 + p * 16
    const y = 10 - p * 5
    return { transform: `translate3d(${x}px, ${y}px, 0)` }
  }, [])
  const f2Ref = useSectionStyle<HTMLDivElement>(f2Styler)

  // Fragment 3: slow zoom IN (1.0 → 1.05) — still, growing presence
  const f3Styler = useCallback((p: number) => {
    const scale = 1.0 + p * 0.05
    return { transform: `scale(${scale})` }
  }, [])
  const f3Ref = useSectionStyle<HTMLDivElement>(f3Styler)

  // Fragment 4: opposed — moves UP while others drift down
  const f4Styler = useCallback((p: number) => {
    const y = 40 - p * 80
    return { transform: `translate3d(0, ${y}px, 0)` }
  }, [])
  const f4Ref = useSectionStyle<HTMLDivElement>(f4Styler)

  // Fragment 5: near-stillness — barely moves, just opacity breathes
  const f5Styler = useCallback((p: number) => {
    const opacity = p > 0.4 && p < 0.9
      ? Math.min(1, (p - 0.4) * 2)
      : p >= 0.9
        ? Math.max(0.3, 1 - (p - 0.9) * 7)
        : 0.2
    return {
      transform: `translate3d(0, ${(0.5 - p) * 6}px, 0)`,
      opacity: `${opacity}`,
    }
  }, [])
  const f5Ref = useSectionStyle<HTMLDivElement>(f5Styler)

  // Puncture text — appears between fragments
  const punctureOpacity = progress > 0.25 && progress < 0.65
    ? Math.min(0.5, (progress - 0.25) * 1.25)
    : progress >= 0.65
      ? Math.max(0, 0.5 - (progress - 0.65) * 1.43)
      : 0

  if (images.length < 5) return null

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[160vh] md:min-h-[200vh] overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, var(--color-tone-shadow), var(--color-tone-smoke) 40%, var(--color-tone-shadow) 100%)',
      }}
    >
      {/* Fragment 1 — Large portrait, bleeds left, zoom OUT */}
      <div
        ref={f1Ref}
        className="
          relative w-[88%] -ml-4 z-[2] pt-[4vh]
          md:absolute md:w-[38vw] md:-left-[3vw] md:top-[6vh] md:ml-0 md:pt-0
        "
      >
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={images[0]}
            alt=""
            fill
            className="object-cover"
            sizes="(min-width: 768px) 38vw, 88vw"
          />
        </div>
      </div>

      {/* Fragment 2 — Landscape, drifts autonomously, overlaps f1 */}
      <div
        ref={f2Ref}
        className="
          relative w-[58%] ml-auto mr-4 -mt-24 z-[4]
          md:absolute md:w-[28vw] md:left-[38vw] md:top-[12vh] md:mt-0 md:mr-0
        "
      >
        <div className="relative aspect-[3/2] overflow-hidden">
          <Image
            src={images[1]}
            alt=""
            fill
            className="object-cover"
            sizes="(min-width: 768px) 28vw, 58vw"
          />
        </div>
      </div>

      {/* Puncture text — between fragments, diagonal placement */}
      <span
        className="
          hidden md:block
          absolute z-30
          left-[72vw] top-[34vh]
          text-[var(--text-micro)] tracking-[0.35em] uppercase text-text-muted select-none pointer-events-none
        "
        style={{
          opacity: punctureOpacity,
          transform: `translate3d(0, ${(0.5 - progress) * 12}px, 0)`,
        }}
      >
        not yet
      </span>

      {/* Mobile puncture — positioned for mobile flow */}
      <span
        className="
          block md:hidden
          relative z-30 ml-6 mt-6 mb-2
          text-[var(--text-micro)] tracking-[0.35em] uppercase text-text-muted select-none pointer-events-none
        "
        style={{ opacity: punctureOpacity }}
      >
        not yet
      </span>

      {/* Fragment 3 — Portrait, zoom IN, right side */}
      <div
        ref={f3Ref}
        className="
          relative w-[72%] ml-auto mr-2 -mt-4 z-[3]
          md:absolute md:w-[30vw] md:right-[2vw] md:top-[42vh] md:mt-0 md:ml-0 md:mr-0
        "
      >
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image
            src={images[2]}
            alt=""
            fill
            className="object-cover"
            sizes="(min-width: 768px) 30vw, 72vw"
          />
        </div>
      </div>

      {/* Fragment 4 — Wide landscape, moves OPPOSED (upward), center-left */}
      <div
        ref={f4Ref}
        className="
          relative w-[92%] mx-auto -mt-10 z-[5]
          md:absolute md:w-[44vw] md:left-[8vw] md:top-[62vh] md:mt-0
        "
      >
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={images[3]}
            alt=""
            fill
            className="object-cover"
            sizes="(min-width: 768px) 44vw, 92vw"
          />
          {/* Soft edge bleed into void below */}
          <div className="absolute bottom-0 left-0 right-0 h-[20%] bg-gradient-to-t from-tone-shadow/50 to-transparent" />
        </div>
      </div>

      {/* Fragment 5 — Small, near-still, breathes in opacity, bleeds right edge */}
      <div
        ref={f5Ref}
        className="
          relative w-[48%] ml-auto -mr-6 -mt-16 z-[6]
          md:absolute md:w-[22vw] md:right-[-2vw] md:top-[88vh] md:mt-0 md:mr-0
        "
      >
        <div className="relative aspect-[2/3] overflow-hidden">
          <Image
            src={images[4]}
            alt=""
            fill
            className="object-cover"
            sizes="(min-width: 768px) 22vw, 48vw"
          />
        </div>
      </div>
    </section>
  )
}

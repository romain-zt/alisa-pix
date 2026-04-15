'use client'

import { useCallback } from 'react'
import Image from 'next/image'
import { useSectionProgress, useSectionStyle } from '@/hooks/useSectionProgress'

export function FragmentCluster({ images }: { images: readonly string[] }) {
  const { ref: sectionRef, progress } = useSectionProgress<HTMLElement>()

  // Fragment 1: slow zoom OUT (1.06 → 1.0) + slight leftward drift
  const f1Styler = useCallback((p: number) => {
    const scale = 1.06 - p * 0.06
    const y = 25 - p * 50
    const x = 5 - p * 10
    return { transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})` }
  }, [])
  const f1Ref = useSectionStyle<HTMLDivElement>(f1Styler)

  // Fragment 2: drifts right + down — autonomous horizontal motion
  const f2Styler = useCallback((p: number) => {
    const x = -12 + p * 24
    const y = 15 - p * 8
    const scale = 1.0 + p * 0.02
    return { transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})` }
  }, [])
  const f2Ref = useSectionStyle<HTMLDivElement>(f2Styler)

  // Fragment 3: zoom IN (0.96 → 1.04) — growing presence, slight right drift
  const f3Styler = useCallback((p: number) => {
    const scale = 0.96 + p * 0.08
    const x = 8 - p * 16
    return { transform: `translate3d(${x}px, 0, 0) scale(${scale})` }
  }, [])
  const f3Ref = useSectionStyle<HTMLDivElement>(f3Styler)

  // Fragment 4: strong OPPOSED vertical — moves UP fast while others drift down
  const f4Styler = useCallback((p: number) => {
    const y = 60 - p * 120
    return { transform: `translate3d(0, ${y}px, 0)` }
  }, [])
  const f4Ref = useSectionStyle<HTMLDivElement>(f4Styler)

  // Fragment 5: near-stillness — opacity breathes, barely moves, horizontal drift
  const f5Styler = useCallback((p: number) => {
    const opacity = p > 0.35 && p < 0.9
      ? Math.min(1, (p - 0.35) * 1.82)
      : p >= 0.9
        ? Math.max(0.2, 1 - (p - 0.9) * 8)
        : 0.15
    const x = -6 + p * 12
    return {
      transform: `translate3d(${x}px, ${(0.5 - p) * 8}px, 0)`,
      opacity: `${opacity}`,
    }
  }, [])
  const f5Ref = useSectionStyle<HTMLDivElement>(f5Styler)

  // Foreground accent line — moves counter to everything, slow horizontal sweep
  const accentStyler = useCallback((p: number) => {
    const x = -30 + p * 60
    const opacity = p > 0.3 && p < 0.8
      ? Math.min(0.25, (p - 0.3) * 0.5)
      : 0
    return {
      transform: `translate3d(${x}px, 0, 0)`,
      opacity: `${opacity}`,
    }
  }, [])
  const accentRef = useSectionStyle<HTMLDivElement>(accentStyler)

  // Puncture: "not yet" — serif italic, display size
  const puncture1Opacity = progress > 0.2 && progress < 0.55
    ? Math.min(0.5, (progress - 0.2) * 1.43)
    : progress >= 0.55
      ? Math.max(0, 0.5 - (progress - 0.55) * 1.11)
      : 0

  if (images.length < 5) return null

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[180vh] md:min-h-[220vh] overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, var(--color-tone-shadow), var(--color-tone-smoke) 35%, var(--color-tone-shadow) 100%)',
      }}
    >
      {/* Fragment 1 — Large portrait, bleeds left, zoom OUT, soft bottom */}
      <div
        ref={f1Ref}
        className="
          relative w-[92%] -ml-6 z-[2] pt-[3vh]
          md:absolute md:w-[40vw] md:-left-[4vw] md:top-[4vh] md:ml-0 md:pt-0
        "
      >
        <div className="relative aspect-[3/4] overflow-hidden mask-soft-bottom mask-bleed-left">
          <Image
            src={images[0]}
            alt=""
            fill
            className="object-cover"
            sizes="(min-width: 768px) 40vw, 92vw"
          />
        </div>
      </div>

      {/* Fragment 2 — Landscape, autonomous horizontal drift, overlaps f1 */}
      <div
        ref={f2Ref}
        className="
          relative w-[55%] ml-auto mr-3 -mt-28 z-[4]
          md:absolute md:w-[30vw] md:left-[36vw] md:top-[10vh] md:mt-0 md:mr-0
        "
      >
        <div className="relative aspect-[3/2] overflow-hidden">
          <Image
            src={images[1]}
            alt=""
            fill
            className="object-cover"
            sizes="(min-width: 768px) 30vw, 55vw"
          />
        </div>
      </div>

      {/* Puncture 1 — "not yet": serif italic, DISPLAY size, diagonal placement */}
      <span
        className="
          hidden md:block
          absolute z-30
          left-[68vw] top-[30vh]
          font-serif italic text-[var(--text-title)] text-text-muted/30 select-none pointer-events-none
        "
        style={{
          opacity: puncture1Opacity,
          transform: `translate3d(${(0.4 - progress) * 20}px, ${(0.4 - progress) * 15}px, 0)`,
        }}
      >
        not yet
      </span>

      {/* Mobile puncture 1 */}
      <span
        className="
          block md:hidden
          relative z-30 ml-6 mt-8 mb-2
          font-serif italic text-[var(--text-lead)] text-text-muted/30 select-none pointer-events-none
        "
        style={{ opacity: puncture1Opacity }}
      >
        not yet
      </span>

      {/* Fragment 3 — Portrait, zoom IN, right side, soft edges */}
      <div
        ref={f3Ref}
        className="
          relative w-[70%] ml-auto mr-1 -mt-6 z-[3]
          md:absolute md:w-[32vw] md:right-[1vw] md:top-[40vh] md:mt-0 md:ml-0 md:mr-0
        "
      >
        <div className="relative aspect-[4/5] overflow-hidden mask-bleed-right">
          <Image
            src={images[2]}
            alt=""
            fill
            className="object-cover"
            sizes="(min-width: 768px) 32vw, 70vw"
          />
        </div>
      </div>

      {/* Foreground accent — diagonal line sweeping across, independent rhythm */}
      <div
        ref={accentRef}
        className="
          hidden md:block
          absolute z-[7] left-[15vw] top-[58vh]
          w-24 h-px bg-accent-soft
          pointer-events-none
        "
        style={{ transform: 'rotate(-5deg)' }}
      />

      {/* Fragment 4 — Wide landscape, OPPOSED vertical, center-left, soft mask */}
      <div
        ref={f4Ref}
        className="
          relative w-[94%] mx-auto -mt-12 z-[5]
          md:absolute md:w-[46vw] md:left-[6vw] md:top-[60vh] md:mt-0
        "
      >
        <div className="relative aspect-[16/9] overflow-hidden mask-soft-edges">
          <Image
            src={images[3]}
            alt=""
            fill
            className="object-cover"
            sizes="(min-width: 768px) 46vw, 94vw"
          />
        </div>
      </div>

      {/* Fragment 5 — Small, near-still, breathes, bleeds right edge */}
      <div
        ref={f5Ref}
        className="
          relative w-[46%] ml-auto -mr-8 -mt-20 z-[6]
          md:absolute md:w-[24vw] md:right-[-3vw] md:top-[86vh] md:mt-0 md:mr-0
        "
      >
        <div className="relative aspect-[2/3] overflow-hidden mask-bleed-right">
          <Image
            src={images[4]}
            alt=""
            fill
            className="object-cover"
            sizes="(min-width: 768px) 24vw, 46vw"
          />
        </div>
      </div>
    </section>
  )
}

'use client'

import Image from 'next/image'
import { useSectionProgress } from '@/hooks/useSectionProgress'
import { Surface } from './Surface'

/**
 * Threshold — second act of the homepage.
 *
 * The section enters fully opaque, sticks briefly while the user scrolls
 * (just enough to feel a beat), and during that pin only the *text card*
 * animates. The portrait stays perfectly still; the background keeps moving.
 */

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value))
}

function lerp(start: number, end: number, amount: number) {
  return start + (end - start) * amount
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

const SECTION_VH = 3.2
const TEXT_REVEAL_END = 0.28

export function Threshold({ src }: { src: string }) {
  const { ref, progress: sectionProgress } = useSectionProgress<HTMLElement>()

  const stickyStart = 1 / (1 + SECTION_VH)
  const stickyEnd = SECTION_VH / (1 + SECTION_VH)
  const stuck = clamp01(
    (sectionProgress - stickyStart) / (stickyEnd - stickyStart)
  )

  const cardReveal = clamp01(stuck / TEXT_REVEAL_END)
  const eased = easeOutCubic(cardReveal)
  const cardY = lerp(28, 0, eased)

  return (
    <section
      ref={ref}
      className="relative z-10"
      style={{ height: `${(1 + SECTION_VH) * 100}svh` }}
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* PORTRAIT — static, fully opaque */}
        <div className="absolute inset-0 flex items-center justify-end pr-[5vw] md:pr-[8vw] pl-6">
          <div
            className="relative h-[64vh] md:h-[78vh] aspect-[3/4] overflow-hidden rounded-[1.5rem]"
            style={{
              boxShadow:
                '0 60px 120px -30px rgba(0,0,0,0.7), 0 0 0 1px rgba(196,168,138,0.08)',
            }}
          >
            <Image
              src={src}
              alt="A boudoir portrait — quiet, composed, intimate"
              fill
              sizes="(max-width: 768px) 90vw, 45vw"
              className="object-cover"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 90% 90% at 50% 50%, transparent 55%, rgba(8,7,6,0.55) 100%)',
              }}
            />
          </div>
        </div>

        {/* TEXT — only this animates during the sticky beat */}
        <div className="absolute inset-0 flex items-center pointer-events-none">
          <div
            className="px-6 md:pl-[6vw] md:pr-0 max-w-md md:max-w-[34vw] w-full"
            style={{
              transform: `translate3d(0, ${cardY}px, 0)`,
              willChange: 'transform',
            }}
          >
            <Surface weight="soft" padding="loose" radius="lg" className="pointer-events-auto">
              <p className="text-[var(--text-micro)] tracking-[0.4em] uppercase text-text-muted/60 mb-6">
                I.   Threshold
              </p>

              <h2
                className="font-serif font-light text-text-primary leading-[1.05]"
                style={{ fontSize: 'clamp(1.875rem, 5vw, 3.25rem)' }}
              >
                You arrive
                <br />
                <span className="italic text-text-muted/85">someone else</span>
                <span className="text-accent">.</span>
              </h2>

              <div className="mt-8 mb-6 h-px w-12 bg-accent-soft" />

              <p className="text-[var(--text-caption)] text-text-muted/75 leading-relaxed max-w-xs">
                Boudoir, the way it should feel.
                <br />
                Slow. Considered. Yours.
              </p>
            </Surface>
          </div>
        </div>
      </div>
    </section>
  )
}

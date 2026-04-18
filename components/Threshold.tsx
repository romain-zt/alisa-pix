'use client'

import Image from 'next/image'
import { useSectionProgress } from '@/hooks/useSectionProgress'
import { Surface } from './Surface'

/**
 * Threshold — second act of the homepage.
 *
 * The section enters fully opaque, sticks while the user scrolls a short
 * distance, animates *inside* (subtle scale + drift on the portrait, gentle
 * Y shift on the card), then releases with the scroll. No fades.
 */

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value))
}

function lerp(start: number, end: number, amount: number) {
  return start + (end - start) * amount
}

function easeInOutSine(t: number) {
  return -(Math.cos(Math.PI * t) - 1) / 2
}

export function Threshold({ src }: { src: string }) {
  const { ref, progress: sectionProgress } = useSectionProgress<HTMLElement>()

  const sectionHeight = 2.6
  const stickyStart = 1 / (1 + sectionHeight)
  const stickyEnd = sectionHeight / (1 + sectionHeight)
  const stuck = clamp01(
    (sectionProgress - stickyStart) / (stickyEnd - stickyStart)
  )
  const eased = easeInOutSine(stuck)

  const portraitScale = lerp(1, 1.045, eased)
  const portraitY = lerp(0, -18, eased)
  const cardY = lerp(20, -10, eased)

  return (
    <section ref={ref} className="relative z-10 h-[260svh]">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* PORTRAIT — floats over the cinematic bg, off-center right */}
        <div
          className="absolute inset-0 flex items-center justify-end pr-[5vw] md:pr-[8vw] pl-6"
          style={{
            transform: `translate3d(0, ${portraitY}px, 0) scale(${portraitScale})`,
            willChange: 'transform',
          }}
        >
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

        {/* TEXT — glass card on the left, deliberately asymmetric */}
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

'use client'

import Image from 'next/image'
import { useSectionProgress } from '@/hooks/useSectionProgress'
import { Surface } from './Surface'

/**
 * Threshold — second act of the homepage.
 *
 * Beat structure (single sticky stage):
 *   1. Section enters: only the b/w portrait, centered in the viewport.
 *   2. We pin the portrait at center while the user keeps scrolling. During
 *      this pin, the *card alone* animates: it slides in from the right and
 *      reveals its content in stages (eyebrow → headline → divider+body).
 *   3. Once everything is on screen, we hold for a beat, then release the
 *      pin so the whole composition scrolls off naturally with the page.
 *
 * The portrait stays put through the entire pin. Only the cinematic background
 * keeps moving behind it (handled by <CinematicBackground/>).
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

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

// Total section height = (1 + SECTION_VH) * 100svh.
// SECTION_VH controls how long the portrait stays pinned. Bumped up so the
// staged reveal has room to breathe before we release the pin.
const SECTION_VH = 4

// Sub-stage windows, expressed as fractions of the *sticky* progress (0→1).
// Order: card slides in, then content reveals top-down, then a hold.
const STAGE_CARD_IN = [0.0, 0.18] as const
const STAGE_EYEBROW = [0.12, 0.3] as const
const STAGE_HEADLINE_1 = [0.22, 0.46] as const
const STAGE_HEADLINE_2 = [0.34, 0.58] as const
const STAGE_DIVIDER = [0.5, 0.66] as const
const STAGE_BODY = [0.58, 0.78] as const
// Above 0.85 we hold the full state until the pin releases.

function progressIn(value: number, [start, end]: readonly [number, number]) {
  if (end <= start) return value >= end ? 1 : 0
  return clamp01((value - start) / (end - start))
}

interface RevealStyle {
  opacity: number
  transform: string
}

function reveal(p: number, dy = 18, ease = easeOutCubic): RevealStyle {
  const e = ease(p)
  return {
    opacity: e,
    transform: `translate3d(0, ${lerp(dy, 0, e)}px, 0)`,
  }
}

export function Threshold({ src }: { src: string }) {
  const { ref, progress: sectionProgress } = useSectionProgress<HTMLElement>()

  // Map the global section progress to the sticky window: the portrait pins
  // as soon as the section reaches the top, and unpins right before the
  // section bottom leaves the viewport.
  const stickyStart = 1 / (1 + SECTION_VH)
  const stickyEnd = SECTION_VH / (1 + SECTION_VH)
  const stuck = clamp01(
    (sectionProgress - stickyStart) / (stickyEnd - stickyStart)
  )

  // Card transport — slides in from the right and lifts up while it does.
  const cardIn = progressIn(stuck, STAGE_CARD_IN)
  const cardEase = easeInOutCubic(cardIn)
  const cardX = lerp(48, 0, cardEase)
  const cardY = lerp(20, 0, cardEase)
  const cardOpacity = cardEase

  const eyebrow = reveal(progressIn(stuck, STAGE_EYEBROW), 14)
  const headline1 = reveal(progressIn(stuck, STAGE_HEADLINE_1), 22)
  const headline2 = reveal(progressIn(stuck, STAGE_HEADLINE_2), 22)
  const divider = reveal(progressIn(stuck, STAGE_DIVIDER), 8)
  const body = reveal(progressIn(stuck, STAGE_BODY), 18)

  // The portrait does one tiny bit of choreography: a barely-perceptible
  // breath (1.0 → 1.02 → 1.0) tied to the staged reveal. It still reads
  // as "pinned and still" but the frame doesn't feel dead.
  const breath = 1 + Math.sin(stuck * Math.PI) * 0.02

  return (
    <section
      ref={ref}
      className="relative z-10"
      style={{ height: `${(1 + SECTION_VH) * 100}svh` }}
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* PORTRAIT — centered in the viewport, b/w, completely still. */}
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div
            className="relative h-[58vh] sm:h-[64vh] md:h-[74vh] aspect-[3/4] overflow-hidden rounded-[1.5rem]"
            style={{
              transform: `scale(${breath})`,
              transformOrigin: '50% 50%',
              transition: 'transform 600ms cubic-bezier(0.45, 0, 0.55, 1)',
              boxShadow:
                '0 60px 120px -30px rgba(0,0,0,0.7), 0 0 0 1px rgba(196,168,138,0.08)',
              willChange: 'transform',
            }}
          >
            <Image
              src={src}
              alt="A boudoir portrait — quiet, composed, intimate"
              fill
              sizes="(max-width: 768px) 80vw, (max-width: 1024px) 50vw, 38vw"
              className="object-cover"
              style={{
                filter: 'grayscale(1) contrast(1.04) brightness(0.96)',
              }}
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

        {/* CARD — overlays from the right, content reveals in stages. */}
        <div className="absolute inset-0 flex items-end md:items-center justify-center md:justify-end pointer-events-none">
          <div
            className="px-6 pb-10 md:pb-0 md:pr-[5vw] lg:pr-[8vw] w-full max-w-md md:max-w-[30rem]"
            style={{
              transform: `translate3d(${cardX}px, ${cardY}px, 0)`,
              opacity: cardOpacity,
              willChange: 'transform, opacity',
            }}
          >
            <Surface weight="soft" padding="loose" radius="lg" className="pointer-events-auto">
              <p
                className="text-[var(--text-micro)] tracking-[0.4em] uppercase text-text-muted/60 mb-6"
                style={{
                  opacity: eyebrow.opacity,
                  transform: eyebrow.transform,
                  willChange: 'transform, opacity',
                }}
              >
                I.   Threshold
              </p>

              <h2
                className="font-serif font-light text-text-primary leading-[1.05]"
                style={{ fontSize: 'clamp(1.875rem, 5vw, 3.25rem)' }}
              >
                <span
                  className="block"
                  style={{
                    opacity: headline1.opacity,
                    transform: headline1.transform,
                    willChange: 'transform, opacity',
                  }}
                >
                  You arrive
                </span>
                <span
                  className="block"
                  style={{
                    opacity: headline2.opacity,
                    transform: headline2.transform,
                    willChange: 'transform, opacity',
                  }}
                >
                  <span className="italic text-text-muted/85">someone else</span>
                  <span className="text-accent">.</span>
                </span>
              </h2>

              <div
                className="mt-8 mb-6 h-px w-12 bg-accent-soft origin-left"
                style={{
                  opacity: divider.opacity,
                  transform: `${divider.transform} scaleX(${easeOutCubic(progressIn(stuck, STAGE_DIVIDER))})`,
                  willChange: 'transform, opacity',
                }}
              />

              <p
                className="text-[var(--text-caption)] text-text-muted/75 leading-relaxed max-w-xs"
                style={{
                  opacity: body.opacity,
                  transform: body.transform,
                  willChange: 'transform, opacity',
                }}
              >
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

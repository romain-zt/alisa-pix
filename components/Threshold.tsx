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
// SECTION_VH controls how long the portrait stays pinned (in viewports).
// At 5 viewports of pin, the user gets ~2vh of reveal + ~3vh of "hold full
// state" before the pin releases — that's the beat we want.
const SECTION_VH = 5

// Sub-stage windows, expressed as fractions of the *sticky* progress (0→1).
// Everything is packed into the first ~55% of the pin so the user gets a
// clear hold of the full composition before the section releases and starts
// scrolling away.
const STAGE_CARD_IN = [0.02, 0.16] as const
const STAGE_EYEBROW = [0.1, 0.22] as const
const STAGE_HEADLINE_1 = [0.18, 0.32] as const
const STAGE_HEADLINE_2 = [0.28, 0.42] as const
const STAGE_DIVIDER = [0.4, 0.5] as const
const STAGE_BODY = [0.46, 0.58] as const
// Above 0.58 → full hold. The pin releases at stuck = 1 and the section
// scrolls off as part of the normal page flow.

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

  // Map the global section progress to the sticky window.
  //   useSectionProgress (start=1, end=0) gives:
  //     - sectionProgress = 1 / (2 + SECTION_VH)  when the section top hits
  //       the viewport top (i.e. CSS `position: sticky` engages).
  //     - sectionProgress = 1                     when the section bottom
  //       hits the viewport top (the pin releases).
  //   We remap that whole window to stuck ∈ [0, 1] so all the staged reveals
  //   are spent *during* the pin, not before it.
  const stickyStart = 1 / (2 + SECTION_VH)
  const stickyEnd = 1
  const stuck = clamp01(
    (sectionProgress - stickyStart) / (stickyEnd - stickyStart)
  )

  // Card transport — rises into view from below (works mobile-first, where
  // the card sits below the portrait, and stays graceful on desktop too).
  const cardIn = progressIn(stuck, STAGE_CARD_IN)
  const cardEase = easeInOutCubic(cardIn)
  const cardY = lerp(36, 0, cardEase)
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
        {/* PORTRAIT — pinned, b/w, still.
            On mobile we anchor it to the upper third so the card has its
            own breathing room in the lower half once it animates in.
            On desktop the card lives off to the right, so the portrait
            can sit perfectly centered. */}
        <div className="absolute inset-0 flex items-start md:items-center justify-center px-6 pt-[8svh] md:pt-0">
          <div
            className="relative h-[74svh] aspect-[3/4] overflow-hidden rounded-[1.5rem]"
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
              // sizes="(max-width: 768px) 80vw, (max-width: 1024px) 50vw, 38vw"
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

        {/* CARD — slides in from the right (desktop) / from below (mobile).
            Content reveals stage by stage during the pin. */}
        <div className="absolute inset-0 flex items-end md:items-center justify-center md:justify-end pointer-events-none">
          <div
            className="px-6 pb-[6svh] md:pb-0 md:pr-[5vw] lg:pr-[8vw] w-full max-w-md md:max-w-[30rem]"
            style={{
              transform: `translate3d(0, ${cardY}px, 0)`,
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

'use client'

import dynamic from 'next/dynamic'
import { Hero } from './Hero'
import { Navigation } from './Navigation'
import { CinematicBackground } from './CinematicBackground'
import { OverlayChapter } from './OverlayChapter'

/**
 * Homepage — one cinematic stage that never disappears.
 *
 * The bg image is pinned and pans/breathes through the entire page. Every
 * section is transparent; text is revealed inside soft glass surfaces so the
 * picture remains the visual constant of the visit.
 *
 * Flow:
 *   1. Hero          — wordmark assembles, no card (the type is the surface)
 *   2. Whisper I     — "you don't see yourself like this"   (whisper card)
 *   3. Manifesto     — two-line credo                        (soft card)
 *   4. Whisper II    — "closer than expected"                (whisper card)
 *   5. Threshold     — portrait floats, copy in soft card
 *   6. MicroStory    — three short lines, each in a whisper card
 *   7. SessionGate   — invitation in solid card
 */

const Threshold = dynamic(
  () => import('./Threshold').then((m) => ({ default: m.Threshold })),
  { loading: () => <div className="min-h-[260vh]" /> }
)

const MicroStory = dynamic(
  () => import('./MicroStory').then((m) => ({ default: m.MicroStory })),
  { loading: () => <div className="min-h-[80vh]" /> }
)

const SessionGate = dynamic(
  () => import('./SessionGate').then((m) => ({ default: m.SessionGate })),
  { loading: () => <div className="min-h-[90vh]" /> }
)

export function HomeContent() {
  return (
    <>
      <Navigation />

      {/* Pinned cinematic stage — visible for the entire page. */}
      <CinematicBackground src="/assets/images/bg-home.jpg" rangeVH={9} />

      {/* 1. HERO — wordmark, no card */}
      <Hero />

      {/* 2. WHISPER I */}
      <OverlayChapter
        align="right"
        justify="center"
        height="90svh"
        surface="whisper"
        surfacePadding="normal"
        maxWidth="22rem"
      >
        <p
          className="font-serif italic text-text-primary leading-[1.05] text-right"
          style={{ fontSize: 'clamp(1.625rem, 4vw, 2.5rem)' }}
        >
          you don&apos;t see yourself
          <br />
          <span className="text-text-muted/85">like this</span>
        </p>
      </OverlayChapter>

      {/* 3. MANIFESTO */}
      <OverlayChapter
        align="left"
        justify="center"
        height="100svh"
        surface="soft"
        surfacePadding="loose"
        maxWidth="32rem"
      >
        <p className="text-[var(--text-micro)] tracking-[0.45em] uppercase text-accent/85 mb-7">
          On the work
        </p>
        <p
          className="font-serif font-light text-text-primary leading-[1.15]"
          style={{ fontSize: 'clamp(1.625rem, 4vw, 2.5rem)' }}
        >
          Light is the conversation.
          <br />
          <span className="italic text-text-muted/85">
            Skin is the answer.
          </span>
        </p>
        <div className="mt-9 h-px w-12 bg-accent-soft" />
        <p className="mt-7 text-[var(--text-caption)] text-text-muted/75 leading-relaxed max-w-xs">
          One subject, one room, two hours.
          <br />
          No retouching beyond the natural.
        </p>
      </OverlayChapter>

      {/* 4. WHISPER II */}
      <OverlayChapter
        align="center"
        justify="center"
        height="90svh"
        surface="whisper"
        surfacePadding="normal"
        maxWidth="26rem"
      >
        <p
          className="font-serif italic text-text-primary leading-tight text-center"
          style={{ fontSize: 'clamp(1.875rem, 4.5vw, 2.75rem)' }}
        >
          closer than expected
        </p>
      </OverlayChapter>

      {/* 5. THRESHOLD — portrait floats over the bg */}
      <Threshold src="/assets/images/portrait.webp" />

      {/* 6. MICROSTORY — three short lines */}
      <MicroStory
        lines={['she arrived nervous', 'left different', "didn't say why"]}
      />

      {/* 7. SESSION GATE — conversion */}
      <SessionGate />
    </>
  )
}

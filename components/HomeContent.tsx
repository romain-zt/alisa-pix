'use client'

import dynamic from 'next/dynamic'
import { Hero } from './Hero'
import { Navigation } from './Navigation'
import { CinematicBackground } from './CinematicBackground'
import { OverlayChapter } from './OverlayChapter'
import { LightThreadProvider } from './LightThread'

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
 *   3. Manifesto     — light / ease / honest retouch          (soft card)
 *   4. Whisper II    — "closer than expected"                (whisper card)
 *   5. Threshold     — portrait floats, copy in soft card
 *   6. MicroStory    — three short lines, each in a whisper card
 *   7. SessionGate   — invitation in solid card
 */

const Threshold = dynamic(
  () => import('./Threshold').then((m) => ({ default: m.Threshold })),
  { loading: () => <div className="min-h-[500vh]" /> }
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
  // LightThread segments — short, intimate filaments between *some* surfaces.
  // Not a continuous river through the page. Each sub-array lists the anchor
  // `order` values that one braid connects, in order. Anchors not listed are
  // simply not threaded — those sections breathe on their own.
  //
  //   [2, 3]      — Whisper I to the Manifesto: the question reaches the answer.
  //   [5, 6]      — Threshold to the first MicroStory line: the portrait
  //                  hands the thread to her story.
  //   [8, 9]      — Last MicroStory line to SessionGate: the story closes
  //                  by inviting the visitor in.
  const threadSegments: ReadonlyArray<ReadonlyArray<number>> = [
    [2, 3],
    [5, 6],
    [8, 9],
  ]

  return (
    <LightThreadProvider segments={threadSegments}>
      <Navigation />

      {/* Pinned cinematic stage — visible for the entire page. */}
      <CinematicBackground src="/assets/images/bg-home.jpg" rangeVH={7.25} />

      {/* 1. HERO — wordmark, no card */}
      <Hero threadOrder={1} />

      {/* 2. WHISPER I */}
      <OverlayChapter
        align="right"
        justify="center"
        height="90svh"
        surface="whisper"
        surfacePadding="normal"
        maxWidth="22rem"
        threadOrder={2}
        threadSide="left"
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
        threadOrder={3}
        threadSide="right"
      >
        <p className="text-[var(--text-micro)] tracking-[0.45em] uppercase text-accent/85 mb-7">
          On the work
        </p>
        <p
          className="font-serif font-light text-text-primary leading-[1.15]"
          style={{ fontSize: 'clamp(1.625rem, 4vw, 2.5rem)' }}
        >
          She&apos;ll find the light
          <br />
          <span className="italic text-text-muted/85">on the best of you.</span>
        </p>
        <div className="mt-9 h-px w-12 bg-accent-soft" />
        <p className="mt-7 text-[var(--text-caption)] text-text-muted/75 leading-relaxed max-w-sm">
          You&apos;ll feel at home in the room.
          <br />
          And together, you&apos;ll capture who you already are —
          <br />
          with your natural beauty, nothing rewritten.
        </p>
      </OverlayChapter>

      {/* 4. WHISPER II */}
      <OverlayChapter
        align="center"
        justify="center"
        height="90svh"
        surface="whisper"
        surfacePadding="normal"
        maxWidth="28rem"
        threadOrder={4}
        threadSide="center"
      >
        <p
          className="font-serif italic text-text-primary leading-tight text-center"
          style={{ fontSize: 'clamp(1.875rem, 4.5vw, 2.75rem)' }}
        >
          you don&apos;t need to prepare.
          <br />
          <span className="text-text-muted/70" style={{ fontSize: 'clamp(1.25rem, 2.8vw, 1.75rem)' }}>
            just show up.
          </span>
        </p>
      </OverlayChapter>

      {/* 5. THRESHOLD — portrait floats over the bg */}
      <Threshold src="/assets/images/portrait.webp" threadOrder={5} />

      {/* 6. MICROSTORY — three short lines (anchors 6, 7, 8) */}
      <MicroStory
        lines={['she arrived unsure', 'left carrying something', "she couldn't name it yet"]}
        threadStartOrder={6}
      />

      {/* 7. SESSION GATE — conversion */}
      <SessionGate threadOrder={9} />
    </LightThreadProvider>
  )
}

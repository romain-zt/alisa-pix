'use client'

import dynamic from 'next/dynamic'
import { Opening } from './Opening'
import { VoidTransition } from './VoidTransition'
import { Navigation } from './Navigation'
import { SCENE_IMAGES } from '@/lib/images'

const DepthScene = dynamic(
  () => import('./DepthScene').then((m) => ({ default: m.DepthScene })),
  { loading: () => <div className="min-h-[180vh]" /> }
)

const ImpactImage = dynamic(
  () => import('./ImpactImage').then((m) => ({ default: m.ImpactImage })),
  { loading: () => <div className="min-h-[120vh]" /> }
)

const FragmentCluster = dynamic(
  () => import('./FragmentCluster').then((m) => ({ default: m.FragmentCluster })),
  { loading: () => <div className="min-h-[180vh]" /> }
)

const Intimacy = dynamic(
  () => import('./Intimacy').then((m) => ({ default: m.Intimacy })),
  { loading: () => <div className="min-h-[140vh]" /> }
)

const SessionGate = dynamic(
  () => import('./SessionGate').then((m) => ({ default: m.SessionGate })),
  { loading: () => <div className="min-h-[90vh]" /> }
)

export function HomeContent() {
  return (
    <>
      <Navigation />

      {/* ═══ OPENING (slow) — 300svh sticky, veil lifts, image emerges ═══ */}
      <Opening src={SCENE_IMAGES.threshold} />

      {/* ─── VOID: pressure — silence, tonal shift ─── */}
      <VoidTransition
        fromTone="deep"
        toTone="silk"
        height="8vh"
        character="pressure"
        bleedTop
      />

      {/* ═══ DESCENT (slow) — layered depth, zoom-in ═══ */}
      <DepthScene
        atmosphereSrc={SCENE_IMAGES.descent.atmosphere}
        mainSrc={SCENE_IMAGES.descent.main}
        label="Boudoir"
      />

      {/* ─── VOID: breathing — long silence, pure darkness ─── */}
      <div
        className="min-h-[40vh] md:min-h-[50vh]"
        aria-hidden="true"
        style={{
          background: 'linear-gradient(to bottom, var(--color-tone-shadow), var(--color-bg-deep) 50%, var(--color-bg-deep))',
        }}
      />

      {/* ═══ IMPACT (brutal) — full viewport, no UI, B&W→color ═══ */}
      <ImpactImage src={SCENE_IMAGES.impact} />

      {/* ─── VOID: whisper — "softer" floats in the darkness ─── */}
      <VoidTransition
        fromTone="deep"
        toTone="smoke"
        height="35vh"
        character="whisper"
        word="softer"
      />

      {/* ═══ FRAGMENTS (chaos) — editorial cluster, overlapping ═══ */}
      <FragmentCluster images={SCENE_IMAGES.fragments} />

      {/* ─── VOID: rift — tense transition ─── */}
      <VoidTransition
        fromTone="shadow"
        toTone="ember"
        height="18vh"
        character="rift"
        bleedTop
      />

      {/* ═══ INTIMACY (slow) — off-center, private ═══ */}
      <Intimacy src={SCENE_IMAGES.intimacy} />

      {/* ─── VOID: long silence before conversion ─── */}
      <div
        className="min-h-[35vh] md:min-h-[45vh]"
        aria-hidden="true"
        style={{
          background: 'linear-gradient(to bottom, var(--color-bg-deep), var(--color-tone-shadow))',
        }}
      />

      {/* ═══ SESSION GATE (conversion) — luxury entry point ═══ */}
      <SessionGate />
    </>
  )
}

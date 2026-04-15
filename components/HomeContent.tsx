'use client'

import dynamic from 'next/dynamic'
import { Opening } from './Opening'
import { VoidTransition } from './VoidTransition'
import { SCENE_IMAGES } from '@/lib/images'

const DepthScene = dynamic(
  () => import('./DepthScene').then((m) => ({ default: m.DepthScene })),
  { loading: () => <div className="min-h-[180vh]" /> }
)

const FragmentCluster = dynamic(
  () => import('./FragmentCluster').then((m) => ({ default: m.FragmentCluster })),
  { loading: () => <div className="min-h-[180vh]" /> }
)

const Intimacy = dynamic(
  () => import('./Intimacy').then((m) => ({ default: m.Intimacy })),
  { loading: () => <div className="min-h-[140vh]" /> }
)

export function HomeContent() {
  return (
    <>
      {/* ═══ Threshold — sticky trap, dramatic zoom-out, held presence ═══ */}
      <Opening src={SCENE_IMAGES.threshold} />

      {/* Void 1: PRESSURE — no content, just tonal shift + warm glow */}
      <VoidTransition
        fromTone="deep"
        toTone="silk"
        height="10vh"
        character="pressure"
        bleedTop
      />

      {/* ═══ Descent — opposed layers, zoom-in, emotional punctures ═══ */}
      <DepthScene
        atmosphereSrc={SCENE_IMAGES.descent.atmosphere}
        mainSrc={SCENE_IMAGES.descent.main}
        label="Boudoir"
      />

      {/* Void 2: WHISPER — a word at display size, serif, emotional moment */}
      <VoidTransition
        fromTone="shadow"
        toTone="smoke"
        height="22vh"
        character="whisper"
        word="softer"
        bleedTop
        bleedBottom
      />

      {/* ═══ Fragments — drift, scale, opposed motion, punctures ═══ */}
      <FragmentCluster images={SCENE_IMAGES.fragments} />

      {/* Void 3: RIFT — diagonal accent + tracked word, tense and brief */}
      <VoidTransition
        fromTone="shadow"
        toTone="ember"
        height="16vh"
        character="rift"
        word="soon"
        bleedTop
      />

      {/* ═══ Intimacy — zoom-in, off-center, independent text, whisper close ═══ */}
      <Intimacy src={SCENE_IMAGES.intimacy} />
    </>
  )
}

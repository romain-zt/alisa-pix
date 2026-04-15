'use client'

import dynamic from 'next/dynamic'
import { Opening } from './Opening'
import { VoidTransition } from './VoidTransition'
import { SCENE_IMAGES } from '@/lib/images'

const DepthScene = dynamic(
  () => import('./DepthScene').then((m) => ({ default: m.DepthScene })),
  { loading: () => <div className="min-h-[160vh]" /> }
)

const FragmentCluster = dynamic(
  () => import('./FragmentCluster').then((m) => ({ default: m.FragmentCluster })),
  { loading: () => <div className="min-h-[160vh]" /> }
)

const Intimacy = dynamic(
  () => import('./Intimacy').then((m) => ({ default: m.Intimacy })),
  { loading: () => <div className="min-h-[120vh]" /> }
)

export function HomeContent() {
  return (
    <>
      {/* ═══ Threshold — sticky trap, zoom-out, held presence ═══ */}
      <Opening src={SCENE_IMAGES.threshold} />

      {/* Bleed-through void — scene endings contaminate beginnings */}
      <VoidTransition
        fromTone="deep"
        toTone="silk"
        height="12vh"
        bleedTop
      />

      {/* ═══ Descent — opposed layers, zoom-in, emotional puncture ═══ */}
      <DepthScene
        atmosphereSrc={SCENE_IMAGES.descent.atmosphere}
        mainSrc={SCENE_IMAGES.descent.main}
        label="Boudoir"
      />

      {/* Alive void — word drifts through tonal pressure */}
      <VoidTransition
        fromTone="shadow"
        toTone="smoke"
        height="18vh"
        word="softer"
        bleedTop
        bleedBottom
      />

      {/* ═══ Fragments — drift, scale, opposed motion, puncture ═══ */}
      <FragmentCluster images={SCENE_IMAGES.fragments} />

      {/* Stillness void — almost nothing, just a held breath */}
      <VoidTransition
        fromTone="shadow"
        toTone="ember"
        height="14vh"
        line
        bleedTop
      />

      {/* ═══ Intimacy — zoom-in, independent text, whisper close ═══ */}
      <Intimacy src={SCENE_IMAGES.intimacy} />
    </>
  )
}

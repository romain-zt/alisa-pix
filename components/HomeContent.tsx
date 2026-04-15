'use client'

import dynamic from 'next/dynamic'
import { Opening } from './Opening'
import { VoidTransition } from './VoidTransition'
import { SCENE_IMAGES } from '@/lib/images'

const DepthScene = dynamic(
  () => import('./DepthScene').then((m) => ({ default: m.DepthScene })),
  { loading: () => <div className="min-h-[120vh]" /> }
)

const FragmentCluster = dynamic(
  () => import('./FragmentCluster').then((m) => ({ default: m.FragmentCluster })),
  { loading: () => <div className="min-h-[80vh]" /> }
)

const Intimacy = dynamic(
  () => import('./Intimacy').then((m) => ({ default: m.Intimacy })),
  { loading: () => <div className="min-h-[90vh]" /> }
)

export function HomeContent() {
  return (
    <>
      {/* Act 1 — Threshold: dark entry, image barely sensed */}
      <Opening src={SCENE_IMAGES.threshold} />

      {/* Void → tone shift into descent */}
      <VoidTransition fromTone="deep" toTone="silk" height="20vh" />

      {/* Act 2 — Descent: layered depth scene, spatial tension */}
      <DepthScene
        atmosphereSrc={SCENE_IMAGES.descent.atmosphere}
        mainSrc={SCENE_IMAGES.descent.main}
        label="Boudoir"
      />

      {/* Void → tone shift with word */}
      <VoidTransition fromTone="silk" toTone="shadow" height="28vh" word="Portfolio" />

      {/* Act 3 — Fragments: non-linear cluster, overlaps, bleeds */}
      <FragmentCluster images={SCENE_IMAGES.fragments} />

      {/* Void → warm shift into intimacy */}
      <VoidTransition fromTone="shadow" toTone="ember" height="22vh" line />

      {/* Act 4 — Intimacy: close, warm, discreet invitation */}
      <Intimacy src={SCENE_IMAGES.intimacy} />
    </>
  )
}

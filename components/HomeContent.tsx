'use client'

import dynamic from 'next/dynamic'
import { Opening } from './Opening'
import { BreathingPause } from './BreathingPause'
import { BOUDOIR_IMAGES } from '@/lib/images'

const ImageReveal = dynamic(
  () => import('./ImageReveal').then((m) => ({ default: m.ImageReveal })),
  { loading: () => <div className="w-full aspect-[3/4]" /> }
)

const AsymmetricPair = dynamic(
  () => import('./AsymmetricPair').then((m) => ({ default: m.AsymmetricPair })),
  { loading: () => <div className="min-h-[55vh]" /> }
)

const EditorialGrid = dynamic(
  () => import('./EditorialGrid').then((m) => ({ default: m.EditorialGrid })),
  { loading: () => <div className="min-h-[80vh]" /> }
)

const Invitation = dynamic(
  () => import('./Invitation').then((m) => ({ default: m.Invitation })),
  { loading: () => <div className="min-h-[40vh]" /> }
)

export function HomeContent() {
  return (
    <>
      {/* Act I: Mystery — the opening */}
      <Opening src={BOUDOIR_IMAGES.hero} />

      {/* Pause */}
      <BreathingPause variant="empty" />

      {/* Act II: Reveal — first full image */}
      <ImageReveal src={BOUDOIR_IMAGES.reveal} aspect="3/4" />

      {/* Pause with word */}
      <BreathingPause variant="word" label="Portfolio" />

      {/* Act III: Detail — asymmetric composition */}
      <AsymmetricPair
        src={BOUDOIR_IMAGES.featured}
        title="Every detail speaks"
        subtitle="Boudoir"
      />

      {/* Pause */}
      <BreathingPause variant="line" />

      {/* Act IV: Immersion — editorial gallery */}
      <EditorialGrid images={BOUDOIR_IMAGES.gallery} />

      {/* Pause */}
      <BreathingPause variant="empty" />

      {/* Act V: Full-bleed immersion */}
      <ImageReveal src={BOUDOIR_IMAGES.immersion} aspect="16/9" />

      {/* Pause */}
      <BreathingPause variant="line" />

      {/* Act VI: Invitation */}
      <Invitation />
    </>
  )
}

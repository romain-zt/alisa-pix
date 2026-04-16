'use client'

import dynamic from 'next/dynamic'
import { Opening } from './Opening'
import { VoidTransition } from './VoidTransition'
import { Navigation } from './Navigation'
import { SCENE_IMAGES } from '@/lib/images'

const HorizontalFilmStrip = dynamic(
  () =>
    import('./HorizontalFilmStrip').then((m) => ({
      default: m.HorizontalFilmStrip,
    })),
  { loading: () => <div className="min-h-[600vh]" /> }
)

const ZoomScene = dynamic(
  () => import('./ZoomScene').then((m) => ({ default: m.ZoomScene })),
  { loading: () => <div className="min-h-[320vh]" /> }
)

const DelayedReveal = dynamic(
  () => import('./DelayedReveal').then((m) => ({ default: m.DelayedReveal })),
  { loading: () => <div className="min-h-[240vh]" /> }
)

const FullSilence = dynamic(
  () => import('./FullSilence').then((m) => ({ default: m.FullSilence })),
  { loading: () => <div className="min-h-[90vh]" /> }
)

const DepthScene = dynamic(
  () => import('./DepthScene').then((m) => ({ default: m.DepthScene })),
  { loading: () => <div className="min-h-[180vh]" /> }
)

const MicroStory = dynamic(
  () => import('./MicroStory').then((m) => ({ default: m.MicroStory })),
  { loading: () => <div className="min-h-[60vh]" /> }
)

const OverflowImage = dynamic(
  () =>
    import('./OverflowImage').then((m) => ({ default: m.OverflowImage })),
  { loading: () => <div className="min-h-[130vh]" /> }
)

const HardCut = dynamic(
  () => import('./HardCut').then((m) => ({ default: m.HardCut })),
  { loading: () => <div className="min-h-[80vh]" /> }
)

const SplitTension = dynamic(
  () =>
    import('./SplitTension').then((m) => ({ default: m.SplitTension })),
  { loading: () => <div className="min-h-[80vh]" /> }
)

const ImmersiveStack = dynamic(
  () =>
    import('./ImmersiveStack').then((m) => ({
      default: m.ImmersiveStack,
    })),
  { loading: () => <div className="min-h-[540vh]" /> }
)

const Intimacy = dynamic(
  () => import('./Intimacy').then((m) => ({ default: m.Intimacy })),
  { loading: () => <div className="min-h-[140vh]" /> }
)

const SessionGate = dynamic(
  () => import('./SessionGate').then((m) => ({ default: m.SessionGate })),
  { loading: () => <div className="min-h-[90vh]" /> }
)

const HorizontalDrift = dynamic(
  () =>
    import('./HorizontalDrift').then((m) => ({
      default: m.HorizontalDrift,
    })),
  { loading: () => <div className="min-h-[450vh]" /> }
)

export function HomeContent() {
  return (
    <>
      <Navigation />

      {/* ═══ SCENE 1: OPENING — darkness first, delayed focus pull, dead zone scroll ═══ */}
      <Opening src={SCENE_IMAGES.threshold} />

      {/* ═══ SCENE 2: SLAM — hard cut text, no fade, instant threshold ═══ */}
      <FullSilence text="you don't see yourself like this" mode="slam" />

      {/* ═══ SCENE 3: DEPTH — layered parallax, liquid light, non-linear curves ═══ */}
      <DepthScene
        atmosphereSrc={SCENE_IMAGES.descent.atmosphere}
        mainSrc={SCENE_IMAGES.descent.main}
        label="Boudoir"
      />

      {/* ─── VOID: pressure shift, overlaps into next ─── */}
      <VoidTransition
        fromTone="shadow"
        toTone="deep"
        height="35vh"
        character="pressure"
        bleedBottom
      />

      {/* ═══ SCENE 4: MICRO STORY — each line enters differently ═══ */}
      <MicroStory
        lines={['she arrived nervous', 'left different', "didn't say why"]}
      />

      {/* ─── VOID: whisper ─── */}
      <VoidTransition
        fromTone="deep"
        toTone="shadow"
        height="28vh"
        character="whisper"
        word="linger"
      />

      {/* ═══ SCENE 5: OVERFLOW — clip-path circle reveal + directional light ═══ */}
      <OverflowImage src={SCENE_IMAGES.overflow} text="remember this" />

      {/* ═══ SCENE 6: HARD CUT — flash burn, instant bright, no transition ═══ */}
      <HardCut src={SCENE_IMAGES.hardcut} />

      {/* ═══ SCENE 6.5: ZOOM — single image grows from nothing, overwhelms ═══ */}
      <ZoomScene src={SCENE_IMAGES.zoom} text="too close" />

      {/* ─── VOID: rift, bleed from hard cut ─── */}
      <VoidTransition
        fromTone="deep"
        toTone="ember"
        height="22vh"
        character="rift"
        bleedTop
      />

      {/* ═══ SCENE 7: SPLIT TENSION — asymmetric, image bleeds ═══ */}
      <SplitTension src={SCENE_IMAGES.split} text="softer than you think" />

      {/* ─── VOID: breath, line extends ─── */}
      <VoidTransition
        fromTone="deep"
        toTone="shadow"
        height="30vh"
        character="breath"
        line
      />

      {/* ═══ SCENE 8: HORIZONTAL DRIFT — breaks vertical linearity ═══ */}
      <HorizontalDrift images={SCENE_IMAGES.drift} />

      {/* ─── VOID: recovery, minimal ─── */}
      <div
        className="min-h-[30vh] md:min-h-[40vh]"
        aria-hidden="true"
        style={{ background: 'var(--color-tone-shadow)' }}
      />

      {/* ═══ SCENE 9: IMMERSIVE STACK — each layer unique behavior ═══ */}
      <ImmersiveStack images={SCENE_IMAGES.stack} />

      {/* ═══ SCENE 10: DISSOLVE — atmospheric, blurred text, bleeding from edge ═══ */}
      <FullSilence text="what you keep hidden" align="off-right" mode="dissolve" />

      {/* ═══ SCENE 11: INTIMACY — expanding mask, breathing light ═══ */}
      <Intimacy src={SCENE_IMAGES.intimacy} />

      {/* ═══ SCENE 11.5: DELAYED REVEAL — long void, image arrives late ═══ */}
      <DelayedReveal
        src={SCENE_IMAGES.late}
        text="she never looked like this before"
        delay={0.72}
      />

      {/* ═══ SCENE 12: SESSION GATE — conversion ═══ */}
      <SessionGate />
    </>
  )
}

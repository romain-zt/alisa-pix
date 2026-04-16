'use client'

import dynamic from 'next/dynamic'
import { Opening } from './Opening'
import { VoidTransition } from './VoidTransition'
import { Navigation } from './Navigation'
import { WhisperBlock } from './WhisperBlock'
import { SCENE_IMAGES } from '@/lib/images'

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
  { loading: () => <div className="min-h-[520vh]" /> }
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

      {/* ═══ SCENE 1: OPENING — sticky focus-pull, cinematic entrance ═══ */}
      <Opening src={SCENE_IMAGES.threshold} />

      <WhisperBlock text="you hesitate" align="right" opacity={0.32} height="45vh" />

      {/* ═══ SCENE 2: FULL SILENCE — hard reset, darkness + one sentence ═══ */}
      <FullSilence text="you don't see yourself like this" />

      {/* ═══ SCENE 3: DEPTH — layered parallax, atmospheric descent ═══ */}
      <DepthScene
        atmosphereSrc={SCENE_IMAGES.descent.atmosphere}
        mainSrc={SCENE_IMAGES.descent.main}
        label="Boudoir"
      />

      {/* ─── VOID + WHISPER: breathing with emotional anchor ─── */}
      <div
        className="min-h-[25vh]"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(to bottom, var(--color-tone-shadow), var(--color-bg-deep))',
        }}
      />
      <WhisperBlock text="this is private" align="left" opacity={0.38} height="45vh" />

      {/* ═══ SCENE 4: MICRO STORY — narrative rhythm, broken lines ═══ */}
      <MicroStory
        lines={['she arrived nervous', 'left different', "didn't say why"]}
      />

      {/* ═══ SCENE 5: OVERFLOW — intimate, too close, break the frame ═══ */}
      <OverflowImage src={SCENE_IMAGES.overflow} text="remember this" />

      <WhisperBlock text="not for everyone" align="off-right" opacity={0.3} height="40vh" />

      {/* ═══ SCENE 6: HARD CUT — bright shock, instant switch ═══ */}
      <HardCut src={SCENE_IMAGES.hardcut} />

      {/* ─── VOID: recovery rift ─── */}
      <VoidTransition
        fromTone="deep"
        toTone="ember"
        height="25vh"
        character="rift"
      />

      {/* ═══ SCENE 7: SPLIT TENSION — 70/30 asymmetric, image bleeds ═══ */}
      <SplitTension src={SCENE_IMAGES.split} text="softer than you think" />

      {/* ─── VOID + WHISPER: breathing before gallery ─── */}
      <div
        className="min-h-[20vh]"
        aria-hidden="true"
        style={{ background: 'var(--color-bg-deep)' }}
      />
      <WhisperBlock text="then you stay" align="off-left" opacity={0.35} height="48vh" />

      {/* ═══ SCENE 8: IMMERSIVE STACK — sticky layered gallery ═══ */}
      <ImmersiveStack images={SCENE_IMAGES.stack} />

      {/* ═══ SCENE 9: FULL SILENCE — emotional anchor, off-right ═══ */}
      <FullSilence text="what you keep hidden" align="off-right" />

      {/* ═══ SCENE 10: INTIMACY — off-center, private, atmospheric ═══ */}
      <Intimacy src={SCENE_IMAGES.intimacy} />

      {/* ─── VOID + WHISPER: silence before conversion ─── */}
      <div
        className="min-h-[20vh]"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(to bottom, var(--color-bg-deep), var(--color-tone-shadow))',
        }}
      />
      <WhisperBlock text="closer than expected" align="left" opacity={0.3} height="55vh" />

      {/* ═══ SCENE 11: SESSION GATE — conversion ═══ */}
      <SessionGate />
    </>
  )
}

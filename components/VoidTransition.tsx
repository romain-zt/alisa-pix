'use client'

import { useSectionProgress } from '@/hooks/useSectionProgress'

const TONE_MAP: Record<string, string> = {
  deep: 'var(--color-bg-deep)',
  silk: 'var(--color-tone-silk)',
  shadow: 'var(--color-tone-shadow)',
  ember: 'var(--color-tone-ember)',
  velvet: 'var(--color-tone-velvet)',
  smoke: 'var(--color-tone-smoke)',
}

type VoidCharacter = 'pressure' | 'whisper' | 'breath' | 'rift'

interface VoidProps {
  fromTone?: string
  toTone?: string
  height?: string
  /** Each void has a distinct character — no two behave the same */
  character?: VoidCharacter
  word?: string
  line?: boolean
  bleedTop?: boolean
  bleedBottom?: boolean
}

export function VoidTransition({
  fromTone = 'deep',
  toTone = 'deep',
  height = '25vh',
  character = 'pressure',
  word,
  line,
  bleedTop,
  bleedBottom,
}: VoidProps) {
  const from = TONE_MAP[fromTone] || TONE_MAP.deep
  const to = TONE_MAP[toTone] || TONE_MAP.deep

  const { ref, progress } = useSectionProgress<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className="relative flex items-center justify-center overflow-hidden"
      style={{
        minHeight: height,
        marginTop: bleedTop ? 'clamp(-6rem, -8vh, -10rem)' : undefined,
        marginBottom: bleedBottom ? 'clamp(-3rem, -5vh, -8rem)' : undefined,
        background: `linear-gradient(to bottom, ${from}, ${to})`,
        zIndex: bleedTop || bleedBottom ? 2 : undefined,
      }}
      aria-hidden={!word}
    >
      {/* Each character type renders differently */}
      {character === 'pressure' && (
        <PressureVoid progress={progress} />
      )}

      {character === 'whisper' && word && (
        <WhisperVoid progress={progress} word={word} />
      )}

      {character === 'breath' && (
        <BreathVoid progress={progress} line={line} />
      )}

      {character === 'rift' && (
        <RiftVoid progress={progress} word={word} />
      )}
    </div>
  )
}

/** Pressure: no visible content — just tonal atmosphere shifting, a radial glow pulses */
function PressureVoid({ progress }: { progress: number }) {
  const glowOpacity = progress > 0.2 && progress < 0.8
    ? Math.min(0.08, (progress - 0.2) * 0.133)
    : 0

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background: `radial-gradient(ellipse 50% 60% at ${45 + progress * 10}% 50%, rgba(196,168,138,${glowOpacity}), transparent 70%)`,
      }}
    />
  )
}

/** Whisper: a word appears large, serif italic — an emotional moment, not a label */
function WhisperVoid({ progress, word }: { progress: number; word: string }) {
  const opacity = progress > 0.15 && progress < 0.75
    ? Math.min(0.55, (progress - 0.15) * 0.92)
    : progress >= 0.75
      ? Math.max(0, 0.55 - (progress - 0.75) * 2.2)
      : 0

  const x = -15 + progress * 30

  return (
    <p
      className="font-serif italic text-[var(--text-display)] text-text-muted select-none pointer-events-none"
      style={{
        opacity,
        transform: `translate3d(${x}px, ${(0.5 - progress) * 12}px, 0)`,
      }}
    >
      {word}
    </p>
  )
}

/** Breath: a thin line that extends and dissolves — asymmetric, not centered */
function BreathVoid({ progress, line }: { progress: number; line?: boolean }) {
  const lineOpacity = progress > 0.25 && progress < 0.75
    ? Math.min(0.35, (progress - 0.25) * 0.7)
    : progress >= 0.75
      ? Math.max(0, 0.35 - (progress - 0.75) * 1.4)
      : 0

  const lineWidth = 20 + progress * 40

  return (
    <div
      className="relative flex items-center"
      style={{
        marginLeft: '35%',
      }}
    >
      <div
        className="h-px bg-accent-soft"
        style={{
          width: `${lineWidth}px`,
          opacity: lineOpacity,
          transform: `translate3d(${(0.5 - progress) * -20}px, 0, 0)`,
        }}
      />
    </div>
  )
}

/** Rift: a crack in the darkness — word splits or a diagonal accent appears */
function RiftVoid({ progress, word }: { progress: number; word?: string }) {
  const opacity = progress > 0.3 && progress < 0.7
    ? Math.min(0.4, (progress - 0.3) * 1)
    : progress >= 0.7
      ? Math.max(0, 0.4 - (progress - 0.7) * 1.33)
      : 0

  return (
    <>
      <div
        className="absolute left-[20%] md:left-[30%] top-1/2 w-16 md:w-24 h-px bg-accent-soft pointer-events-none"
        style={{
          opacity: opacity * 0.5,
          transform: `translate3d(0, -50%, 0) rotate(-8deg) scaleX(${0.3 + progress * 0.7})`,
          transformOrigin: 'left center',
        }}
      />
      {word && (
        <span
          className="relative z-10 text-[var(--text-caption)] tracking-[0.3em] uppercase text-text-muted/30 select-none pointer-events-none"
          style={{
            opacity,
            transform: `translate3d(${10 + progress * -20}px, 0, 0)`,
          }}
        >
          {word}
        </span>
      )}
    </>
  )
}

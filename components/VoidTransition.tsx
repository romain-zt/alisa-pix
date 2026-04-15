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

interface VoidProps {
  fromTone?: string
  toTone?: string
  height?: string
  word?: string
  line?: boolean
  /** If true, reduces top margin to let previous scene bleed in */
  bleedTop?: boolean
  /** If true, reduces bottom margin to let next scene start earlier */
  bleedBottom?: boolean
}

export function VoidTransition({
  fromTone = 'deep',
  toTone = 'deep',
  height = '25vh',
  word,
  line,
  bleedTop,
  bleedBottom,
}: VoidProps) {
  const from = TONE_MAP[fromTone] || TONE_MAP.deep
  const to = TONE_MAP[toTone] || TONE_MAP.deep

  const { ref, progress } = useSectionProgress<HTMLDivElement>()

  // Word fades in mid-progress and drifts slightly
  const wordOpacity = word
    ? progress > 0.2 && progress < 0.8
      ? Math.min(0.5, (progress - 0.2) * 0.83)
      : progress >= 0.8
        ? Math.max(0, 0.5 - (progress - 0.8) * 2.5)
        : 0
    : 0

  const lineOpacity = line
    ? progress > 0.3 && progress < 0.7
      ? Math.min(0.3, (progress - 0.3) * 0.75)
      : 0
    : 0

  return (
    <div
      ref={ref}
      className="relative flex items-center justify-center"
      style={{
        minHeight: height,
        marginTop: bleedTop ? 'clamp(-4rem, -6vh, -8rem)' : undefined,
        marginBottom: bleedBottom ? 'clamp(-2rem, -4vh, -6rem)' : undefined,
        background: `linear-gradient(to bottom, ${from}, ${to})`,
        zIndex: bleedTop || bleedBottom ? 2 : undefined,
      }}
      aria-hidden={!word}
    >
      {word && (
        <p
          className="text-[var(--text-micro)] tracking-[0.3em] uppercase text-text-muted select-none"
          style={{
            opacity: wordOpacity,
            transform: `translate3d(0, ${(0.5 - progress) * 8}px, 0)`,
          }}
        >
          {word}
        </p>
      )}
      {line && !word && (
        <div
          className="w-10 h-px bg-accent-soft"
          style={{
            opacity: lineOpacity,
            transform: `scaleX(${0.5 + progress * 0.5})`,
          }}
        />
      )}
    </div>
  )
}

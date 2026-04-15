'use client'

const TONE_MAP: Record<string, string> = {
  deep: 'var(--color-bg-deep)',
  silk: 'var(--color-tone-silk)',
  shadow: 'var(--color-tone-shadow)',
  ember: 'var(--color-tone-ember)',
  velvet: 'var(--color-tone-velvet)',
  smoke: 'var(--color-tone-smoke)',
}

export function VoidTransition({
  fromTone = 'deep',
  toTone = 'deep',
  height = '25vh',
  word,
  line,
}: {
  fromTone?: string
  toTone?: string
  height?: string
  word?: string
  line?: boolean
}) {
  const from = TONE_MAP[fromTone] || TONE_MAP.deep
  const to = TONE_MAP[toTone] || TONE_MAP.deep

  return (
    <div
      className="relative flex items-center justify-center"
      style={{
        minHeight: height,
        background: `linear-gradient(to bottom, ${from}, ${to})`,
      }}
      aria-hidden={!word}
    >
      {word && (
        <p className="text-[var(--text-micro)] tracking-[0.3em] uppercase text-text-muted opacity-60">
          {word}
        </p>
      )}
      {line && !word && (
        <div className="w-10 h-px bg-accent-soft opacity-40" />
      )}
    </div>
  )
}

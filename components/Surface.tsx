import { ReactNode, CSSProperties } from 'react'

interface Props {
  children: ReactNode
  /** Visual weight. Whisper = barely there, soft = subtle, solid = readable for paragraphs. */
  weight?: 'whisper' | 'soft' | 'solid'
  /** Padding scale. */
  padding?: 'tight' | 'normal' | 'loose'
  /** Optional rounding override. */
  radius?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  style?: CSSProperties
}

/**
 * Surface — a glass card that reveals text over the cinematic background.
 *
 * Three weights:
 *   - whisper: barely-there frosted veil — for short poetic lines
 *   - soft:    standard reading surface — for short paragraphs / labels
 *   - solid:   denser frost for longer copy or important calls-to-action
 *
 * No hard borders; only the faintest champagne hairline. No box shadow that
 * looks "tech" — only diffuse warm ambient. Always backed by backdrop-blur so
 * the picture remains visible through it as a soft impression.
 */
export function Surface({
  children,
  weight = 'soft',
  padding = 'normal',
  radius = 'lg',
  className = '',
  style,
}: Props) {
  const weightStyles: Record<NonNullable<Props['weight']>, CSSProperties> = {
    whisper: {
      background: [
        'linear-gradient(180deg, rgba(255,248,235,0.11) 0%, rgba(255,255,255,0.03) 22%, transparent 48%)',
        'linear-gradient(125deg, rgba(255,255,255,0.04) 0%, transparent 42%)',
        'linear-gradient(135deg, rgba(13,11,9,0.32) 0%, rgba(10,9,8,0.22) 100%)',
      ].join(', '),
      backdropFilter: 'blur(10px) saturate(1.05)',
      WebkitBackdropFilter: 'blur(10px) saturate(1.05)',
      boxShadow:
        '0 30px 60px -25px rgba(0,0,0,0.45), inset 0 1px 0 0 rgba(255,248,235,0.06)',
      border: '1px solid rgba(196,168,138,0.1)',
    },
    soft: {
      background: [
        'linear-gradient(180deg, rgba(255,248,235,0.13) 0%, rgba(255,240,220,0.04) 24%, transparent 50%)',
        'linear-gradient(130deg, rgba(255,255,255,0.06) 0%, transparent 45%)',
        'linear-gradient(135deg, rgba(13,11,9,0.55) 0%, rgba(10,9,8,0.42) 100%)',
      ].join(', '),
      backdropFilter: 'blur(16px) saturate(1.1)',
      WebkitBackdropFilter: 'blur(16px) saturate(1.1)',
      boxShadow:
        '0 40px 80px -25px rgba(0,0,0,0.55), inset 0 1px 0 0 rgba(255,238,210,0.07)',
      border: '1px solid rgba(196,168,138,0.14)',
    },
    solid: {
      background: [
        'linear-gradient(180deg, rgba(255,248,235,0.08) 0%, transparent 38%)',
        'linear-gradient(135deg, rgba(10,9,8,0.92) 0%, rgba(6,5,4,0.86) 100%)',
      ].join(', '),
      backdropFilter: 'blur(28px) saturate(1.2)',
      WebkitBackdropFilter: 'blur(28px) saturate(1.2)',
      boxShadow:
        '0 50px 100px -25px rgba(0,0,0,0.75), inset 0 1px 0 0 rgba(255,238,210,0.08)',
      border: '1px solid rgba(196,168,138,0.18)',
    },
  }

  const paddingClass =
    padding === 'tight'
      ? 'p-6 md:p-8'
      : padding === 'loose'
        ? 'p-10 md:p-16'
        : 'p-8 md:p-12'

  const radiusClass =
    radius === 'sm'
      ? 'rounded-xl'
      : radius === 'md'
        ? 'rounded-2xl'
        : radius === 'xl'
          ? 'rounded-[2rem]'
          : 'rounded-3xl'

  // Breath layer = a slow warm/cold pool that drifts inside the surface,
  // making the glass feel like it's holding light rather than sitting flat.
  // Sheen layer = a very low-opacity diagonal swipe that crosses every ~18s.
  // Both respect prefers-reduced-motion via the global override in globals.css.
  const breatheOpacity = weight === 'whisper' ? 0.5 : weight === 'soft' ? 0.7 : 0.85
  const sheenOpacity = weight === 'whisper' ? 0.05 : weight === 'soft' ? 0.07 : 0.09

  return (
    <div
      className={`relative overflow-hidden ${paddingClass} ${radiusClass} ${className}`}
      style={{ ...weightStyles[weight], ...style }}
    >
      <div
        aria-hidden="true"
        className="surface-breathe absolute -inset-[20%]"
        style={{
          opacity: breatheOpacity,
          background: `
            radial-gradient(ellipse 55% 45% at 30% 30%, rgba(255,232,200,0.10) 0%, transparent 60%),
            radial-gradient(ellipse 45% 50% at 75% 70%, rgba(196,168,138,0.08) 0%, transparent 60%)
          `,
          mixBlendMode: 'screen',
        }}
      />

      <div
        aria-hidden="true"
        className="surface-sheen absolute -inset-[60%]"
        style={{
          opacity: sheenOpacity,
          background:
            'linear-gradient(115deg, transparent 38%, rgba(255,242,215,0.55) 50%, transparent 62%)',
          mixBlendMode: 'screen',
        }}
      />

      <div className="relative">{children}</div>
    </div>
  )
}

'use client'

import { useSectionProgress } from '@/hooks/useSectionProgress'

interface FullSilenceProps {
  text: string
  align?: 'center' | 'off-right'
  mode?: 'slam' | 'dissolve' | 'materialize'
}

export function FullSilence({ text, align = 'center', mode = 'slam' }: FullSilenceProps) {
  const { ref, progress } = useSectionProgress<HTMLElement>()

  const words = text.split(' ')

  return (
    <section
      ref={ref}
      className="relative min-h-[90vh] md:min-h-[100vh] flex items-center overflow-hidden"
      style={{ background: '#050504' }}
    >
      {mode === 'slam' && (
        <SlamText words={words} progress={progress} align={align} />
      )}
      {mode === 'dissolve' && (
        <DissolveText text={text} progress={progress} align={align} />
      )}
      {mode === 'materialize' && (
        <MaterializeText text={text} progress={progress} align={align} />
      )}
    </section>
  )
}

function SlamText({
  words,
  progress,
  align,
}: {
  words: string[]
  progress: number
  align: string
}) {
  const threshold = 0.22
  const isVisible = progress > threshold
  const exitFade = progress > 0.75 ? Math.pow((1 - progress) / 0.25, 0.5) : 1

  return (
    <p
      className={`font-serif italic text-[var(--text-title)] md:text-[var(--text-display)] text-text-primary select-none leading-snug max-w-[18ch] ${
        align === 'center'
          ? 'mx-auto text-center px-8'
          : 'ml-auto mr-[8vw] md:mr-[12vw] text-right px-8'
      }`}
      style={{
        opacity: isVisible ? exitFade : 0,
        transform: isVisible
          ? `translate3d(0, ${progress > threshold ? -2 : 8}px, 0)`
          : 'translate3d(0, 0, 0)',
        transition: isVisible ? 'none' : undefined,
      }}
    >
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block"
          style={{
            opacity: progress > threshold + i * 0.03 ? 1 : 0,
            transform: progress > threshold + i * 0.03
              ? 'translate3d(0, 0, 0)'
              : 'translate3d(0, 12px, 0)',
            transition: `opacity 80ms ${i * 40}ms, transform 120ms ${i * 40}ms cubic-bezier(0.76, 0, 0.24, 1)`,
          }}
        >
          {word}{i < words.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </p>
  )
}

function DissolveText({
  text,
  progress,
  align,
}: {
  text: string
  progress: number
  align: string
}) {
  const opacity = progress > 0.15
    ? Math.min(0.35, Math.pow((progress - 0.15) / 0.85, 3) * 0.35)
    : 0

  const blurAmount = progress < 0.4
    ? 6 - (progress / 0.4) * 6
    : 0

  const exitOpacity = progress > 0.85 ? (1 - progress) / 0.15 : 1

  return (
    <p
      className={`font-serif italic text-[var(--text-title)] md:text-[var(--text-display)] text-text-primary select-none leading-snug max-w-[18ch] ${
        align === 'center'
          ? 'mx-auto text-center px-8'
          : 'ml-auto mr-[8vw] md:mr-[12vw] text-right px-8'
      }`}
      style={{
        opacity: opacity * exitOpacity,
        filter: blurAmount > 0.1 ? `blur(${blurAmount}px)` : 'none',
        transform: `translate3d(${align === 'off-right' ? 30 - progress * 40 : 0}px, 0, 0)`,
      }}
    >
      {text}
    </p>
  )
}

function MaterializeText({
  text,
  progress,
  align,
}: {
  text: string
  progress: number
  align: string
}) {
  const chars = text.split('')
  const threshold = 0.2

  return (
    <p
      className={`font-serif italic text-[var(--text-title)] md:text-[var(--text-display)] text-text-primary select-none leading-snug max-w-[18ch] ${
        align === 'center'
          ? 'mx-auto text-center px-8'
          : 'ml-auto mr-[8vw] md:mr-[12vw] text-right px-8'
      }`}
      aria-label={text}
    >
      {chars.map((char, i) => {
        const charProgress = Math.max(0, Math.min(1,
          (progress - threshold - i * 0.008) / 0.15
        ))
        const exitFade = progress > 0.8 ? (1 - progress) / 0.2 : 1

        return (
          <span
            key={i}
            className="inline"
            style={{
              opacity: Math.pow(charProgress, 0.3) * 0.7 * Math.max(0, exitFade),
            }}
          >
            {char}
          </span>
        )
      })}
    </p>
  )
}

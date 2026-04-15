'use client'

import { useScrollReveal } from '@/hooks/useScrollReveal'

export function BreathingPause({
  label,
  variant = 'line',
}: {
  label?: string
  variant?: 'empty' | 'line' | 'word'
}) {
  const ref = useScrollReveal<HTMLDivElement>({
    translateY: 0,
    duration: 1400,
    delay: 0,
  })

  if (variant === 'empty') {
    return <div className="min-h-[20vh]" aria-hidden="true" />
  }

  if (variant === 'word' && label) {
    return (
      <div
        ref={ref}
        className="flex items-center justify-center min-h-[25vh] py-12"
      >
        <p className="text-[var(--text-micro)] tracking-[0.3em] uppercase text-text-muted">
          {label}
        </p>
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className="flex items-center justify-center min-h-[15vh] py-8"
      aria-hidden="true"
    >
      <div className="w-10 h-px bg-accent-soft" />
    </div>
  )
}

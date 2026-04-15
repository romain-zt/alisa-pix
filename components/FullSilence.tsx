'use client'

import { useSectionProgress } from '@/hooks/useSectionProgress'

interface FullSilenceProps {
  text: string
  align?: 'center' | 'off-right'
}

export function FullSilence({ text, align = 'center' }: FullSilenceProps) {
  const { ref, progress } = useSectionProgress<HTMLElement>()

  const opacity =
    progress < 0.3
      ? (progress / 0.3) * 0.7
      : progress > 0.7
        ? ((1 - progress) / 0.3) * 0.7
        : 0.7

  return (
    <section
      ref={ref}
      className="relative min-h-[90vh] md:min-h-[100vh] flex items-center overflow-hidden"
      style={{ background: '#050504' }}
    >
      <p
        className={`font-serif italic text-[var(--text-title)] md:text-[var(--text-display)] text-text-primary select-none leading-snug max-w-[18ch] ${
          align === 'center'
            ? 'mx-auto text-center px-8'
            : 'ml-auto mr-[8vw] md:mr-[12vw] text-right px-8'
        }`}
        style={{ opacity }}
      >
        {text}
      </p>
    </section>
  )
}

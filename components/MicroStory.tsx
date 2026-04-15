'use client'

import { useSectionProgress } from '@/hooks/useSectionProgress'

export function MicroStory({ lines }: { lines: string[] }) {
  const { ref, progress } = useSectionProgress<HTMLElement>()

  return (
    <section
      ref={ref}
      className="relative min-h-[60vh] md:min-h-[75vh] flex items-center"
      style={{ background: 'var(--color-bg-deep)' }}
    >
      <div className="px-8 md:pl-[18vw] space-y-5 md:space-y-8">
        {lines.map((line, i) => {
          const delay = i * 0.1
          const enterStart = 0.15 + delay
          const enterEnd = 0.35 + delay
          const lineProgress = Math.max(
            0,
            Math.min(1, (progress - enterStart) / (enterEnd - enterStart))
          )
          const exitFade =
            progress > 0.8 ? (1 - progress) / 0.2 : 1
          const y = (1 - lineProgress) * 12

          return (
            <p
              key={i}
              className="font-serif italic text-[var(--text-lead)] md:text-[var(--text-title)] text-text-primary/60 select-none"
              style={{
                opacity: Math.max(0, lineProgress * 0.6 * exitFade),
                transform: `translate3d(0, ${y}px, 0)`,
                lineHeight: '1.6',
              }}
            >
              {line}
            </p>
          )
        })}
      </div>
    </section>
  )
}

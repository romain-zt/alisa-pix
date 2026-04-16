'use client'

import { useSectionProgress } from '@/hooks/useSectionProgress'

type EntryDirection = 'fromLeft' | 'fromRight' | 'fadeOnly' | 'fromBelow'

const ENTRY_SEQUENCE: EntryDirection[] = ['fromLeft', 'fadeOnly', 'fromRight']

const ENTRY_CONFIGS: Record<EntryDirection, {
  getTransform: (lineProgress: number) => string
  getOpacity: (lineProgress: number) => number
  textAlign?: string
  indent?: string
}> = {
  fromLeft: {
    getTransform: (p) => `translate3d(${(1 - p) * -40}px, 0, 0)`,
    getOpacity: (p) => Math.pow(p, 0.6) * 0.65,
  },
  fromRight: {
    getTransform: (p) => `translate3d(${(1 - p) * 35}px, 0, 0)`,
    getOpacity: (p) => Math.pow(p, 0.8) * 0.55,
    indent: 'ml-[15vw] md:ml-[30vw]',
  },
  fadeOnly: {
    getTransform: () => 'translate3d(0, 0, 0)',
    getOpacity: (p) => p > 0.3 ? Math.min(0.7, Math.pow((p - 0.3) / 0.7, 2) * 0.7) : 0,
    indent: 'ml-[5vw] md:ml-[22vw]',
  },
  fromBelow: {
    getTransform: (p) => `translate3d(0, ${(1 - p) * 25}px, 0)`,
    getOpacity: (p) => Math.pow(p, 0.5) * 0.6,
  },
}

export function MicroStory({ lines }: { lines: string[] }) {
  const { ref, progress } = useSectionProgress<HTMLElement>()

  return (
    <section
      ref={ref}
      className="relative min-h-[65vh] md:min-h-[80vh] flex items-center"
      style={{ background: 'var(--color-bg-deep)' }}
    >
      <div className="px-8 md:pl-[14vw] space-y-6 md:space-y-10 w-full">
        {lines.map((line, i) => {
          const entry = ENTRY_SEQUENCE[i % ENTRY_SEQUENCE.length]
          const config = ENTRY_CONFIGS[entry]

          const delays = [0, 0.18, 0.08]
          const speeds = [0.2, 0.25, 0.18]

          const enterStart = 0.12 + (delays[i] || 0)
          const enterEnd = enterStart + (speeds[i] || 0.2)
          const lineProgress = Math.max(
            0,
            Math.min(1, (progress - enterStart) / (enterEnd - enterStart))
          )

          const exitFade = progress > 0.82
            ? Math.pow((1 - progress) / 0.18, 0.7)
            : 1

          return (
            <p
              key={i}
              className={`font-serif italic text-[var(--text-lead)] md:text-[var(--text-title)] text-text-primary select-none ${config.indent || ''}`}
              style={{
                opacity: Math.max(0, config.getOpacity(lineProgress) * exitFade),
                transform: config.getTransform(lineProgress),
                lineHeight: '1.7',
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

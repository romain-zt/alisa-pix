'use client'

import { useSectionProgress } from '@/hooks/useSectionProgress'
import { Surface } from './Surface'

type EntryDirection = 'fromLeft' | 'fromRight' | 'fadeOnly'

const ENTRY_SEQUENCE: EntryDirection[] = ['fromLeft', 'fadeOnly', 'fromRight']

const ENTRY_CONFIGS: Record<
  EntryDirection,
  {
    getTransform: (lineProgress: number) => string
    getOpacity: (lineProgress: number) => number
    align: string
  }
> = {
  fromLeft: {
    getTransform: (p) => `translate3d(${(1 - p) * -36}px, 0, 0)`,
    getOpacity: (p) => Math.pow(p, 0.6),
    align: 'self-start',
  },
  fromRight: {
    getTransform: (p) => `translate3d(${(1 - p) * 36}px, 0, 0)`,
    getOpacity: (p) => Math.pow(p, 0.7),
    align: 'self-end',
  },
  fadeOnly: {
    getTransform: () => 'translate3d(0, 0, 0)',
    getOpacity: (p) =>
      p > 0.25 ? Math.min(1, Math.pow((p - 0.25) / 0.75, 1.4)) : 0,
    align: 'self-center md:ml-[18vw]',
  },
}

/**
 * MicroStory — three short lines, each entering from a different direction,
 * each in its own whisper-weight glass surface. No section background; the
 * cinematic stage shows through.
 */
export function MicroStory({ lines }: { lines: string[] }) {
  const { ref, progress } = useSectionProgress<HTMLElement>()

  return (
    <section
      ref={ref}
      className="relative z-10 min-h-[80vh] md:min-h-[100vh] flex items-center"
    >
      <div className="px-6 md:pl-[10vw] md:pr-[10vw] flex flex-col gap-10 md:gap-14 w-full">
        {lines.map((line, i) => {
          const entry = ENTRY_SEQUENCE[i % ENTRY_SEQUENCE.length]
          const config = ENTRY_CONFIGS[entry]

          const delays = [0, 0.18, 0.08]
          const speeds = [0.22, 0.26, 0.2]

          const enterStart = 0.12 + (delays[i] || 0)
          const enterEnd = enterStart + (speeds[i] || 0.22)
          const lineProgress = Math.max(
            0,
            Math.min(1, (progress - enterStart) / (enterEnd - enterStart))
          )

          const exitFade =
            progress > 0.82
              ? Math.pow((1 - progress) / 0.18, 0.7)
              : 1

          return (
            <div
              key={i}
              className={`${config.align} max-w-[24ch]`}
              style={{
                opacity: Math.max(0, config.getOpacity(lineProgress) * exitFade),
                transform: config.getTransform(lineProgress),
                willChange: 'transform, opacity',
              }}
            >
              <Surface weight="whisper" padding="tight" radius="md">
                <p
                  className="font-serif italic text-text-primary/95 select-none leading-snug"
                  style={{ fontSize: 'clamp(1.125rem, 2.6vw, 1.5rem)' }}
                >
                  {line}
                </p>
              </Surface>
            </div>
          )
        })}
      </div>
    </section>
  )
}

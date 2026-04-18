'use client'

import { useSectionProgress } from '@/hooks/useSectionProgress'
import { Surface } from './Surface'

/**
 * SessionGate — quiet conversion.
 *
 * No background of its own; the cinematic stage shows through. The CTA lives
 * inside a "solid" glass surface so the call-to-action reads clearly while the
 * picture remains the visual constant of the page.
 */
export function SessionGate() {
  const { ref, progress } = useSectionProgress<HTMLElement>()

  const cardOpacity =
    progress > 0.15 ? Math.min(1, (progress - 0.15) * 1.6) : 0
  const cardY = (1 - Math.min(1, progress * 1.4)) * 20
  const lineScale =
    progress > 0.28 ? Math.min(1, (progress - 0.28) * 2) : 0

  return (
    <section
      ref={ref}
      id="sessions"
      className="relative z-10 min-h-[100svh] flex items-center justify-center px-6 md:px-12 py-20 md:py-24"
    >
      <div
        className="w-full max-w-md"
        style={{
          opacity: cardOpacity,
          transform: `translate3d(0, ${cardY}px, 0)`,
          willChange: 'transform, opacity',
        }}
      >
        <Surface weight="solid" padding="loose" radius="lg">
          <p className="text-[var(--text-micro)] tracking-[0.4em] uppercase text-text-muted/65 mb-10">
            Private sessions
          </p>

          <div
            className="w-10 h-px bg-accent-soft mb-10 origin-left"
            style={{
              transform: `scaleX(${lineScale})`,
            }}
          />

          <h2 className="font-serif font-light text-[var(--text-display)] text-text-primary leading-[1.05] mb-8">
            By appointment
            <br />
            <span className="italic text-text-muted/80">only</span>
            <span className="text-accent">.</span>
          </h2>

          <p className="text-[var(--text-caption)] text-text-muted/70 leading-relaxed mb-2">
            Boudoir sessions in Paris.
          </p>
          <p className="text-[var(--text-caption)] text-text-muted/70 leading-relaxed mb-12">
            Starting from €480.
          </p>

          <a
            href="mailto:hello@vasilisa.com"
            className="inline-flex items-center gap-4 group min-h-[44px]"
          >
            <span className="text-[var(--text-caption)] tracking-[0.2em] uppercase text-accent transition-all duration-700 group-hover:tracking-[0.28em]">
              Request access
            </span>
            <span className="w-8 h-px bg-accent/60 transition-all duration-700 origin-left group-hover:w-12 group-hover:bg-accent" />
          </a>
        </Surface>
      </div>
    </section>
  )
}

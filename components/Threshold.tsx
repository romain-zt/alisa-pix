'use client'

import Image from 'next/image'
import { useSectionProgress } from '@/hooks/useSectionProgress'
import { Surface } from './Surface'

/**
 * Threshold — second act of the homepage.
 *
 * No section background — the cinematic stage shows through. A single portrait
 * (the subject) emerges from blur, framed softly. Beside it, a glass surface
 * holds the headline copy.
 *
 * Sticky scroll-driven: the portrait scales/drifts, the text fades in.
 */
function curve(t: number, exp: number) {
  return Math.pow(t, exp)
}

export function Threshold({ src }: { src: string }) {
  const { ref, progress } = useSectionProgress<HTMLElement>()

  const p = curve(progress, 1.4)

  // Portrait
  const portraitScale = 0.94 + p * 0.1
  const portraitY = 30 - p * 70
  const portraitOpacity =
    progress < 0.18
      ? Math.max(0, (progress - 0.05) / 0.13)
      : progress > 0.84
        ? Math.max(0, 1 - (progress - 0.84) * 4)
        : 1
  const portraitBlur =
    progress < 0.32 ? Math.max(0, 7 - progress * 22) : 0

  // Text card
  const cardOpacity =
    progress > 0.22 && progress < 0.86
      ? Math.min(1, (progress - 0.22) * 1.8)
      : progress >= 0.86
        ? Math.max(0, 1 - (progress - 0.86) * 5)
        : 0
  const cardY = (1 - Math.min(1, progress * 1.4)) * 24

  return (
    <section ref={ref} className="relative z-10 h-[260svh]">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* PORTRAIT — floats over the cinematic bg, off-center right */}
        <div
          className="absolute inset-0 flex items-center justify-end pr-[5vw] md:pr-[8vw] pl-6"
          style={{
            transform: `translate3d(0, ${portraitY}px, 0) scale(${portraitScale})`,
            opacity: portraitOpacity,
            willChange: 'transform, opacity',
          }}
        >
          <div
            className="relative h-[64vh] md:h-[78vh] aspect-[3/4] overflow-hidden rounded-[1.5rem]"
            style={{
              filter: `blur(${portraitBlur}px) brightness(0.97)`,
              boxShadow:
                '0 60px 120px -30px rgba(0,0,0,0.7), 0 0 0 1px rgba(196,168,138,0.08)',
            }}
          >
            <Image
              src={src}
              alt="A boudoir portrait — quiet, composed, intimate"
              fill
              sizes="(max-width: 768px) 90vw, 45vw"
              className="object-cover"
            />
            {/* Inner soft vignette so edges dissolve into the scene */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 90% 90% at 50% 50%, transparent 55%, rgba(8,7,6,0.55) 100%)',
              }}
            />
          </div>
        </div>

        {/* TEXT — glass card on the left, deliberately asymmetric */}
        <div className="absolute inset-0 flex items-center pointer-events-none">
          <div
            className="px-6 md:pl-[6vw] md:pr-0 max-w-md md:max-w-[34vw] w-full"
            style={{
              opacity: cardOpacity,
              transform: `translate3d(0, ${cardY}px, 0)`,
              willChange: 'transform, opacity',
            }}
          >
            <Surface weight="soft" padding="loose" radius="lg" className="pointer-events-auto">
              <p className="text-[var(--text-micro)] tracking-[0.4em] uppercase text-text-muted/60 mb-6">
                I.   Threshold
              </p>

              <h2
                className="font-serif font-light text-text-primary leading-[1.05]"
                style={{ fontSize: 'clamp(1.875rem, 5vw, 3.25rem)' }}
              >
                You arrive
                <br />
                <span className="italic text-text-muted/85">someone else</span>
                <span className="text-accent">.</span>
              </h2>

              <div className="mt-8 mb-6 h-px w-12 bg-accent-soft" />

              <p className="text-[var(--text-caption)] text-text-muted/75 leading-relaxed max-w-xs">
                Boudoir, the way it should feel.
                <br />
                Slow. Considered. Yours.
              </p>
            </Surface>
          </div>
        </div>
      </div>
    </section>
  )
}

'use client'

import { useEffect, useRef } from 'react'
import { animate, createTimeline, cubicBezier, stagger } from 'animejs'
import { useSectionProgress } from '@/hooks/useSectionProgress'

/**
 * Hero — first viewport of the cinematic act.
 *
 * Bg image is owned by <CinematicBackground />; this component is purely the
 * type performance:
 *   - micro eyebrow ("Paris · Boudoir")
 *   - serif "Vasilisa" wordmark assembling letter-by-letter (anime.js stagger)
 *   - champagne hairline rule
 *   - italic tagline drifting up
 *   - scroll cue breathing at the bottom
 *
 * Continuous breathing letter-spacing on the wordmark gives the title life.
 * On scroll the type drifts up and dissolves so the cinematic stage takes over.
 */

const BRAND = 'Vasilisa'.split('')

export function Hero() {
  const rootRef = useRef<HTMLElement>(null)
  const hasPlayed = useRef(false)
  const { ref: sectionRef, progress } = useSectionProgress<HTMLElement>()

  // Type drifts up + dissolves as we scroll past
  const wordY = -progress * 90
  const wordOpacity =
    progress < 0.45 ? 1 : Math.max(0, 1 - (progress - 0.45) * 2.4)
  const tagOpacity =
    progress < 0.32 ? 1 : Math.max(0, 1 - (progress - 0.32) * 2.8)
  const cueOpacity = Math.max(0, 0.65 - progress * 4)

  useEffect(() => {
    if (!rootRef.current || hasPlayed.current) return
    hasPlayed.current = true

    const el = rootRef.current
    const eyebrow = el.querySelector('.hero-eyebrow') as HTMLElement
    const letters = el.querySelectorAll('.hero-letter')
    const rule = el.querySelector('.hero-tag-rule') as HTMLElement
    const tagline = el.querySelector('.hero-tagline') as HTMLElement
    const cue = el.querySelector('.hero-cue') as HTMLElement

    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (reduce) {
      ;[eyebrow, rule, tagline, cue].forEach((n) => {
        if (n) n.style.opacity = '1'
      })
      letters.forEach((l) => {
        ;(l as HTMLElement).style.opacity = '1'
        ;(l as HTMLElement).style.transform = 'none'
      })
      return
    }

    const easeDefault = cubicBezier(0.87, 0, 0.13, 1)
    const easeOutExpo = cubicBezier(0.16, 1, 0.3, 1)

    const tl = createTimeline({
      defaults: { ease: easeDefault },
    })

    // Eyebrow first — quiet annunciation
    tl.add(
      eyebrow,
      {
        opacity: [0, 1],
        translateY: ['12px', '0px'],
        duration: 1200,
      },
      1400
    )
      // Wordmark letters cascade in — translateY + rotate + blur lift
      .add(
        letters,
        {
          opacity: [0, 1],
          translateY: [
            { from: '50px', to: '0px' },
          ],
          rotate: [
            { from: 5, to: 0 },
          ],
          filter: [
            { from: 'blur(10px)', to: 'blur(0px)' },
          ],
          duration: 1500,
          delay: stagger(85, { start: 0 }),
        },
        1900
      )
      // Champagne rule draws in
      .add(
        rule,
        {
          opacity: [0, 1],
          scaleX: [0, 1],
          duration: 1300,
          ease: easeOutExpo,
        },
        3100
      )
      // Italic tagline lifts in
      .add(
        tagline,
        {
          opacity: [0, 1],
          translateY: ['18px', '0px'],
          duration: 1500,
        },
        3300
      )
      // Scroll cue last — invitation
      .add(
        cue,
        {
          opacity: [0, 0.65],
          translateY: ['10px', '0px'],
          duration: 1400,
        },
        4100
      )

    // Subtle continuous breathing on the wordmark — almost imperceptible.
    const breathe = animate('.hero-wordmark', {
      letterSpacing: [
        { to: '0.085em', duration: 5400, ease: 'inOutSine' },
        { to: '0.06em', duration: 5400, ease: 'inOutSine' },
      ],
      loop: true,
      delay: 4600,
    })

    return () => {
      breathe.pause()
    }
  }, [])

  return (
    <section
      ref={(node) => {
        ;(rootRef as React.MutableRefObject<HTMLElement | null>).current = node
        ;(sectionRef as React.MutableRefObject<HTMLElement | null>).current =
          node
      }}
      className="relative z-10 h-[100svh] flex items-center justify-center overflow-hidden"
      aria-label="Vasilisa — Boudoir Photography"
    >
      <div
        className="flex flex-col items-center text-center px-5 sm:px-6 w-full max-w-[min(100%,42rem)] mx-auto"
        style={{
          transform: `translate3d(0, ${wordY}px, 0)`,
        }}
      >
        <div
          className="hero-type-plate w-full rounded-[1.5rem] sm:rounded-[1.75rem] border border-[rgba(196,168,138,0.14)] px-6 py-9 sm:px-9 sm:py-10 md:px-11 md:py-12"
          style={{
            background:
              'linear-gradient(165deg, rgba(10,9,8,0.52) 0%, rgba(6,5,4,0.62) 45%, rgba(5,4,3,0.68) 100%)',
            backdropFilter: 'blur(14px) saturate(1.08)',
            WebkitBackdropFilter: 'blur(14px) saturate(1.08)',
            boxShadow:
              '0 36px 72px -28px rgba(0,0,0,0.55), inset 0 1px 0 0 rgba(255,248,235,0.06)',
          }}
        >
          <p
            className="hero-eyebrow text-[var(--text-micro)] tracking-[0.5em] uppercase text-text-muted/80 mb-7 md:mb-9 opacity-0"
            style={{ opacity: tagOpacity }}
          >
            Paris · Boudoir
          </p>

          <h1
            className="hero-wordmark font-serif font-light leading-[0.95] text-text-primary"
            style={{
              fontSize: 'clamp(3.25rem, 12vw, 9rem)',
              letterSpacing: '0.06em',
              opacity: wordOpacity,
            }}
          >
            {BRAND.map((char, i) => (
              <span
                key={i}
                className="hero-letter inline-block opacity-0"
                style={{
                  willChange: 'transform, opacity, filter',
                  transform: 'translateY(50px)',
                }}
              >
                {char}
              </span>
            ))}
          </h1>

          <div
            className="hero-tag-rule mt-9 md:mt-11 mb-5 md:mb-6 h-px w-12 bg-accent-soft origin-center mx-auto opacity-0"
            style={{ transform: 'scaleX(0)', opacity: tagOpacity }}
          />
          <p
            className="hero-tagline font-serif italic text-[var(--text-lead)] text-text-muted max-w-md leading-relaxed mx-auto opacity-0"
            style={{ opacity: tagOpacity }}
          >
            A bright trace of your personality.
          </p>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        className="hero-cue absolute z-[10] bottom-10 md:bottom-14 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-0"
        style={{ opacity: cueOpacity }}
        aria-hidden="true"
      >
        <span className="text-[var(--text-micro)] tracking-[0.4em] uppercase text-text-muted/60">
          Scroll
        </span>
        <span className="block w-px h-10 bg-gradient-to-b from-text-muted/50 to-transparent" />
      </div>
    </section>
  )
}

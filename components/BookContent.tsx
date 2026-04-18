'use client'

import { useEffect, useRef, useState } from 'react'
import { CinematicBackground } from './CinematicBackground'
import { Navigation } from './Navigation'
import { Surface } from './Surface'

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.12 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return { ref, visible }
}

export function BookContent() {
  const hero = useReveal<HTMLElement>()
  const offer = useReveal<HTMLElement>()
  const details = useReveal<HTMLElement>()
  const contact = useReveal<HTMLElement>()

  return (
    <>
      <Navigation alwaysVisible />
      <CinematicBackground src="/assets/images/bg-home.jpg" rangeVH={4} />

      {/* HERO — price + title */}
      <section
        ref={hero.ref}
        className="relative z-10 min-h-[100svh] flex items-center justify-center px-6 md:px-12 py-24"
      >
        <div
          className="w-full max-w-lg text-center"
          style={{
            opacity: hero.visible ? 1 : 0,
            transform: `translateY(${hero.visible ? 0 : 24}px)`,
            transition:
              'opacity 1600ms cubic-bezier(0.16,1,0.3,1), transform 1600ms cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          <p
            className="text-[var(--text-micro)] tracking-[0.5em] uppercase text-text-muted/65 mb-10"
            style={{
              opacity: hero.visible ? 1 : 0,
              transition: 'opacity 1200ms 200ms cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            Paris · Private sessions
          </p>

          <h1
            className="font-serif font-light leading-[0.95] text-text-primary mb-8"
            style={{ fontSize: 'clamp(4rem, 14vw, 9rem)', letterSpacing: '0.04em' }}
          >
            700<span className="text-accent">€</span>
          </h1>

          <div className="h-px w-10 bg-accent-soft mx-auto mb-8" />

          <p
            className="font-serif italic text-text-muted/80 leading-relaxed"
            style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)' }}
          >
            One session.
            <br />
            Every image that matters.
          </p>
        </div>
      </section>

      {/* WHAT THIS IS — emotional copy */}
      <section
        ref={offer.ref}
        className="relative z-10 min-h-[90svh] flex items-center px-6 md:px-[10vw] py-24"
      >
        <div
          className="w-full max-w-xl"
          style={{
            opacity: offer.visible ? 1 : 0,
            transform: `translateY(${offer.visible ? 0 : 32}px)`,
            transition:
              'opacity 1800ms cubic-bezier(0.16,1,0.3,1), transform 1800ms cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          <Surface weight="soft" padding="loose" radius="lg">
            <p className="text-[var(--text-micro)] tracking-[0.45em] uppercase text-accent/85 mb-8">
              The session
            </p>

            <p
              className="font-serif font-light text-text-primary leading-[1.15] mb-10"
              style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)' }}
            >
              You don&apos;t need to know
              <br />
              <span className="italic text-text-muted/80">how to pose.</span>
            </p>

            <div className="h-px w-10 bg-accent-soft mb-10" />

            <p
              className="text-[var(--text-caption)] text-text-muted/70 leading-[1.8] max-w-md"
              style={{ fontSize: 'clamp(0.9rem, 1.6vw, 1.05rem)' }}
            >
              Two hours, just the two of you.
              <br className="hidden sm:block" />
              No instructions. No pressure to look a certain way.
            </p>
            <p
              className="text-[var(--text-caption)] text-text-muted/70 leading-[1.8] max-w-md mt-5"
              style={{ fontSize: 'clamp(0.9rem, 1.6vw, 1.05rem)' }}
            >
              Vasilisa will find the light that suits you.
              <br className="hidden sm:block" />
              You&apos;ll feel at home in the room.
            </p>
            <p
              className="font-serif italic text-text-primary/85 leading-relaxed mt-8"
              style={{ fontSize: 'clamp(1.1rem, 2vw, 1.35rem)' }}
            >
              Together, you&apos;ll capture who you already are —<br />
              natural, honest, yours.
            </p>
          </Surface>
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section
        ref={details.ref}
        className="relative z-10 min-h-[70svh] flex items-center justify-end px-6 md:px-[10vw] py-24"
      >
        <div
          className="w-full max-w-md"
          style={{
            opacity: details.visible ? 1 : 0,
            transform: `translateY(${details.visible ? 0 : 28}px)`,
            transition:
              'opacity 1600ms cubic-bezier(0.16,1,0.3,1), transform 1600ms cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          <Surface weight="whisper" padding="loose" radius="lg">
            <p className="text-[var(--text-micro)] tracking-[0.45em] uppercase text-text-muted/60 mb-8">
              What&apos;s included
            </p>

            <ul className="space-y-5">
              {[
                'Two hours together in Paris',
                'Your complete set of retouched images',
                'Honest retouching — never a rewrite of who you are',
                'A print, if you want one',
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-4"
                  style={{
                    opacity: details.visible ? 1 : 0,
                    transition: `opacity 1200ms ${300 + i * 120}ms cubic-bezier(0.16,1,0.3,1)`,
                  }}
                >
                  <span className="mt-2.5 block w-4 h-px bg-accent/60 flex-shrink-0" />
                  <span
                    className="text-text-muted/70 leading-relaxed"
                    style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1rem)' }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </Surface>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section
        ref={contact.ref}
        className="relative z-10 min-h-[80svh] flex items-center justify-center px-6 md:px-12 py-24"
      >
        <div
          className="w-full max-w-md text-center"
          style={{
            opacity: contact.visible ? 1 : 0,
            transform: `translateY(${contact.visible ? 0 : 24}px)`,
            transition:
              'opacity 1800ms cubic-bezier(0.16,1,0.3,1), transform 1800ms cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          <Surface weight="solid" padding="loose" radius="lg">
            <p className="text-[var(--text-micro)] tracking-[0.45em] uppercase text-text-muted/60 mb-10">
              Book your session
            </p>

            <p
              className="font-serif font-light text-text-primary leading-[1.1] mb-3"
              style={{ fontSize: 'clamp(1.875rem, 5vw, 3rem)' }}
            >
              Write when
              <br />
              <span className="italic text-text-muted/80">you&apos;re ready.</span>
            </p>

            <div className="h-px w-8 bg-accent-soft mx-auto my-9" />

            <p
              className="text-text-muted/60 leading-relaxed mb-10"
              style={{ fontSize: 'clamp(0.8rem, 1.4vw, 0.9rem)' }}
            >
              Paris · By appointment only
            </p>

            <a
              href="mailto:hello@vasilisa.com"
              className="inline-flex items-center gap-4 group min-h-[44px] mx-auto"
            >
              <span className="text-[var(--text-caption)] tracking-[0.2em] uppercase text-accent transition-all duration-700 group-hover:tracking-[0.28em]">
                hello@vasilisa.com
              </span>
              <span className="w-8 h-px bg-accent/60 transition-all duration-700 origin-left group-hover:w-12 group-hover:bg-accent" />
            </a>
          </Surface>
        </div>
      </section>
    </>
  )
}

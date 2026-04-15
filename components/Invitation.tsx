'use client'

import { useScrollReveal } from '@/hooks/useScrollReveal'

export function Invitation() {
  const ref = useScrollReveal<HTMLDivElement>({
    translateY: 20,
    duration: 1100,
    delay: 100,
  })

  return (
    <section className="flex items-center justify-center min-h-[40vh] py-16 px-6">
      <div ref={ref} className="text-center max-w-md">
        <p className="text-[var(--text-micro)] tracking-[0.25em] uppercase text-text-muted mb-6">
          By appointment
        </p>
        <a
          href="mailto:hello@vasilisa.com"
          className="font-serif font-light text-[var(--text-lead)] text-accent underline underline-offset-4 decoration-accent-soft transition-opacity duration-500 hover:opacity-70"
        >
          hello@vasilisa.com
        </a>
      </div>
    </section>
  )
}

'use client'

import { useSectionProgress } from '@/hooks/useSectionProgress'

export function Colophon() {
  const { ref, progress } = useSectionProgress<HTMLElement>()

  const textOpacity = progress > 0.1
    ? Math.min(1, (progress - 0.1) * 1.5)
    : 0

  const glowOpacity = progress > 0.2
    ? Math.min(0.06, (progress - 0.2) * 0.075)
    : 0

  return (
    <footer
      ref={ref}
      className="relative pt-28 md:pt-40 pb-12 md:pb-16 px-6 min-h-[40vh] overflow-hidden"
    >
      {/* Atmospheric glow — warm radial that appears on approach */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 40% 50% at 20% 60%, rgba(196,168,138,${glowOpacity}), transparent 70%)`,
        }}
      />

      <div
        className="relative z-10 max-w-sm"
        style={{
          opacity: textOpacity,
          transform: `translate3d(${(1 - progress) * 8}px, 0, 0)`,
        }}
      >
        <p className="text-[var(--text-micro)] tracking-[0.25em] uppercase text-text-muted mb-5">
          Vasilisa
        </p>
        <p className="text-[var(--text-caption)] text-text-muted leading-relaxed mb-1">
          Boudoir photography
        </p>
        <p className="text-[var(--text-caption)] text-text-muted leading-relaxed mb-4">
          Paris
        </p>
        <a
          href="mailto:hello@vasilisa.com"
          className="text-[var(--text-caption)] text-accent underline underline-offset-4 decoration-accent-soft transition-opacity duration-700 hover:opacity-60"
        >
          hello@vasilisa.com
        </a>
      </div>

      {/* Thin accent line — fades in at the very end */}
      <div
        className="absolute bottom-6 right-6 md:right-10 w-12 h-px bg-accent-soft pointer-events-none"
        style={{
          opacity: progress > 0.6 ? Math.min(0.2, (progress - 0.6) * 0.5) : 0,
          transform: `scaleX(${0.3 + progress * 0.7})`,
          transformOrigin: 'right center',
        }}
      />
    </footer>
  )
}

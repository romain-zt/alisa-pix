'use client'

import { useSectionProgress } from '@/hooks/useSectionProgress'

export function Colophon() {
  const { ref, progress } = useSectionProgress<HTMLElement>()

  const textOpacity = progress > 0.15
    ? Math.min(0.6, (progress - 0.15) * 0.8)
    : 0

  return (
    <footer
      ref={ref}
      className="relative px-6 md:px-10  overflow-hidden"
    >
      <div
        className="relative z-10 max-w-xs"
        style={{
          opacity: textOpacity,
          transform: `translate3d(${(1 - progress) * 6}px, 0, 0)`,
        }}
      >
        <p className="text-[var(--text-micro)] tracking-[0.35em] uppercase text-text-muted/40 mb-5">
          Vasilisa
        </p>
        <p className="text-[var(--text-micro)] text-text-muted/25 leading-relaxed">
          Paris
        </p>
      </div>

      {/* Thin accent line at the very bottom */}
      <div
        className="absolute bottom-8 right-8 md:right-12 w-10 h-px bg-accent-soft/20 pointer-events-none"
        style={{
          opacity: progress > 0.5 ? Math.min(0.3, (progress - 0.5) * 0.6) : 0,
          transform: `scaleX(${0.2 + progress * 0.8})`,
          transformOrigin: 'right center',
        }}
      />
    </footer>
  )
}

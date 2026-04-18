'use client'

import { ReactNode } from 'react'
import { useSectionProgress } from '@/hooks/useSectionProgress'
import { Surface } from './Surface'

interface Props {
  children: ReactNode
  /** Horizontal placement of the text within the viewport. */
  align?: 'center' | 'left' | 'right'
  /** Vertical placement of the text within the viewport. */
  justify?: 'center' | 'top' | 'bottom'
  /** Section height (default 100svh). */
  height?: string
  /** Optional extra classes for the inner content wrapper. */
  className?: string
  /** Wrap the content in a glass surface. Defaults to false (raw text over bg). */
  surface?: false | 'whisper' | 'soft' | 'solid'
  /** Padding for the surface (when enabled). */
  surfacePadding?: 'tight' | 'normal' | 'loose'
  /** Max-width override for the inner content. */
  maxWidth?: string
}

/**
 * OverlayChapter
 *
 * A transparent, full-viewport text "chapter" intended to scroll OVER a
 * pinned cinematic background. The inner content fades in, holds, and fades
 * out smoothly as the chapter passes through the viewport.
 *
 * No background of its own — never breaks the cinematic stage below.
 */
export function OverlayChapter({
  children,
  align = 'center',
  justify = 'center',
  height = '100svh',
  className = '',
  surface = false,
  surfacePadding = 'normal',
  maxWidth = '36rem',
}: Props) {
  const { ref, progress } = useSectionProgress<HTMLElement>()

  // Smooth fade-in 12-32%, hold 32-66%, fade-out 66-92%
  const opacity = (() => {
    if (progress < 0.12) return 0
    if (progress < 0.32) return (progress - 0.12) / 0.2
    if (progress < 0.66) return 1
    if (progress < 0.92) return 1 - (progress - 0.66) / 0.26
    return 0
  })()

  // Subtle drift — content rises into place, then drifts away
  const enterY = progress < 0.32 ? (1 - progress / 0.32) * 18 : 0
  const exitY = progress > 0.66 ? (progress - 0.66) * 50 : 0
  const y = enterY - exitY

  const alignClasses =
    align === 'left'
      ? 'justify-start text-left pl-6 md:pl-[8vw]'
      : align === 'right'
        ? 'justify-end text-right pr-6 md:pr-[8vw]'
        : 'justify-center text-center px-6'

  const justifyClasses =
    justify === 'top'
      ? 'items-start pt-[18vh]'
      : justify === 'bottom'
        ? 'items-end pb-[18vh]'
        : 'items-center'

  const inner = surface ? (
    <Surface weight={surface} padding={surfacePadding} radius="lg" className={className}>
      {children}
    </Surface>
  ) : (
    <div className={className}>{children}</div>
  )

  return (
    <section
      ref={ref}
      style={{ height }}
      className={`relative z-10 flex ${alignClasses} ${justifyClasses}`}
    >
      <div
        style={{
          opacity,
          transform: `translate3d(0, ${y}px, 0)`,
          willChange: 'transform, opacity',
          maxWidth,
          width: '100%',
        }}
      >
        {inner}
      </div>
    </section>
  )
}

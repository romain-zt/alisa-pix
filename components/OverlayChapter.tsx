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
  /** When set, the inner Surface registers as a LightThread anchor at this order. */
  threadOrder?: number
  threadSide?: 'left' | 'right' | 'center'
  /**
   * Direction the chapter drifts in from. Defaults to derive from `align`:
   *   - align="left"   → enters from the left (slides in horizontally)
   *   - align="right"  → enters from the right
   *   - align="center" → rises from below
   * Pass an explicit value to override.
   */
  enterFrom?: 'left' | 'right' | 'bottom'
  /**
   * Distance the chapter travels during its entrance, in pixels.
   * Lateral entrances ride a longer distance than the vertical default,
   * so the sideways arrival reads clearly.
   */
  enterDistance?: number
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
  threadOrder,
  threadSide,
  enterFrom,
  enterDistance,
}: Props) {
  const { ref, progress } = useSectionProgress<HTMLElement>()

  // Default entrance direction derived from horizontal alignment so each
  // chapter has its own gesture without the consumer having to think about
  // it. left-aligned text drifts in from the left, right-aligned from the
  // right, centered text rises from below.
  const direction =
    enterFrom ?? (align === 'left' ? 'left' : align === 'right' ? 'right' : 'bottom')

  // Smooth fade-in 12-32%, hold 32-66%, fade-out 66-92%
  const opacity = (() => {
    if (progress < 0.12) return 0
    if (progress < 0.32) return (progress - 0.12) / 0.2
    if (progress < 0.66) return 1
    if (progress < 0.92) return 1 - (progress - 0.66) / 0.26
    return 0
  })()

  // Easing for the entrance. progress within [0, 0.32] → 0..1, eased so the
  // last 30% of the travel slows to a settle (cubic ease-out feel).
  const enterT = progress < 0.32 ? progress / 0.32 : 1
  const easedEnter = 1 - Math.pow(1 - enterT, 3)
  const enterDist = enterDistance ?? (direction === 'bottom' ? 18 : 64)
  const remaining = (1 - easedEnter) * enterDist

  // Exit always drifts upward — a gentle release, not a re-trip across the
  // viewport. Keeps the horizontal entrance from feeling like a slideshow.
  const exitY = progress > 0.66 ? (progress - 0.66) * 50 : 0

  let translateX = 0
  let translateY = 0
  if (direction === 'left') translateX = -remaining
  else if (direction === 'right') translateX = remaining
  else translateY = remaining
  translateY -= exitY

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
    <Surface
      weight={surface}
      padding={surfacePadding}
      radius="lg"
      className={className}
      threadOrder={threadOrder}
      threadSide={threadSide}
    >
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
          transform: `translate3d(${translateX}px, ${translateY}px, 0)`,
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

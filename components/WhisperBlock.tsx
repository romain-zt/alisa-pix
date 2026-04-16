'use client'

import { useEffect, useRef } from 'react'

type Alignment = 'left' | 'right' | 'off-left' | 'off-right'

interface WhisperBlockProps {
  text: string
  align?: Alignment
  opacity?: number
  height?: string
}

// [initial transform, final transform, flex alignment]
const alignMap: Record<Alignment, [string, string, string]> = {
  'left':      ['translateX(calc(8vw - 20px))',  'translateX(8vw)',   'justify-start'],
  'right':     ['translateX(calc(-8vw + 20px))', 'translateX(-8vw)',  'justify-end'],
  'off-left':  ['translateX(calc(-7vw - 20px))', 'translateX(-7vw)',  'justify-start'],
  'off-right': ['translateX(calc(7vw + 20px))',  'translateX(7vw)',   'justify-end'],
}

export function WhisperBlock({
  text,
  align = 'left',
  opacity = 0.35,
  height = '50vh',
}: WhisperBlockProps) {
  const ref = useRef<HTMLParagraphElement>(null)
  const [initial, final, flex] = alignMap[align]

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transition = 'opacity 1.6s ease, transform 2s ease'
          el.style.opacity = String(opacity)
          el.style.transform = final
        }
      },
      { threshold: 0.25 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [final, opacity])

  return (
    <div
      className={`flex items-center overflow-hidden ${flex}`}
      style={{ minHeight: height }}
      aria-hidden="true"
    >
      <p
        ref={ref}
        className="font-serif italic text-[clamp(0.85rem,1.8vw,1.25rem)] text-[var(--color-text-base)] leading-none tracking-[0.15em] select-none"
        style={{
          opacity: 0,
          transform: initial,
          willChange: 'opacity, transform',
        }}
      >
        {text}
      </p>
    </div>
  )
}

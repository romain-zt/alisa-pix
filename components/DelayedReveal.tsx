'use client'

import Image from 'next/image'
import { useSectionProgress } from '@/hooks/useSectionProgress'

interface DelayedRevealProps {
  src: string
  text?: string
  /** 0–1: scroll fraction before content begins appearing. Default 0.72 */
  delay?: number
}

export function DelayedReveal({
  src,
  text,
  delay = 0.72,
}: DelayedRevealProps) {
  const { ref, progress } = useSectionProgress<HTMLDivElement>()

  // Map progress after the delay threshold into a 0→1 local value
  const revealSpan = 1 - delay
  const local = Math.max(0, Math.min(1, (progress - delay) / revealSpan))

  const imgOpacity = local
  const imgScale = 0.96 + local * 0.06
  const textOpacity = Math.max(0, (local - 0.45) / 0.55)

  return (
    <div
      ref={ref}
      className="relative"
      style={{ height: '240vh', background: 'var(--color-bg-deep)' }}
    >
      {/* Void indicator — barely visible breathing dot */}
      <div
        className="absolute top-[30vh] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
        style={{
          background: 'rgba(255,255,255,0.06)',
          opacity: progress < delay ? 1 : 0,
        }}
        aria-hidden="true"
      />

      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Late-appearing image */}
        <div
          className="absolute inset-0"
          style={{
            opacity: imgOpacity,
            transform: `scale(${imgScale})`,
            willChange: 'opacity, transform',
          }}
        >
          <Image
            src={src}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-deep/70 via-transparent to-bg-deep/20" />
        </div>

        {/* Text — arrives even later, after image */}
        {text && (
          <div
            className="absolute inset-0 z-10 flex items-end pb-14 md:pb-20 pl-6 md:pl-14"
            style={{ opacity: textOpacity }}
          >
            <p className="font-serif italic text-[var(--text-lead)] text-white/65 max-w-[70vw] md:max-w-[45vw]">
              {text}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

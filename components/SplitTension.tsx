'use client'

import { useCallback } from 'react'
import Image from 'next/image'
import { useSectionProgress, useSectionStyle } from '@/hooks/useSectionProgress'

interface SplitTensionProps {
  src: string
  text: string
}

export function SplitTension({ src, text }: SplitTensionProps) {
  const { ref: sectionRef, progress } = useSectionProgress<HTMLElement>()

  const imageStyler = useCallback((p: number) => {
    const scale = 1.0 + p * 0.05
    return { transform: `scale(${scale})` }
  }, [])
  const imageRef = useSectionStyle<HTMLDivElement>(imageStyler)

  const textOpacity =
    progress > 0.2 && progress < 0.85
      ? Math.min(1, (progress - 0.2) * 1.54)
      : progress >= 0.85
        ? (1 - progress) * 6.67
        : 0

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[80vh] md:min-h-[100vh] md:grid md:grid-cols-10 overflow-hidden"
      style={{ background: '#050504' }}
    >
      {/* Image — 70% with bleed into void */}
      <div className="relative h-[55vh] md:h-full md:col-span-7 overflow-hidden md:overflow-visible">
        <div
          ref={imageRef}
          className="absolute inset-0 md:right-[-8%]"
        >
          <Image
            src={src}
            alt=""
            fill
            className="object-cover"
            sizes="(min-width: 768px) 78vw, 100vw"
          />
          {/* Soft bleed edge — desktop only */}
          <div
            className="hidden md:block absolute inset-y-0 right-0 w-[20%] pointer-events-none"
            style={{
              background: 'linear-gradient(to right, transparent, #050504)',
            }}
          />
        </div>
      </div>

      {/* Void — 30%, text lives here */}
      <div className="md:col-span-3 md:col-start-8 flex items-center px-8 py-16 md:py-0 md:pl-4 md:pr-[4vw]">
        <p
          className="font-serif italic text-[var(--text-lead)] md:text-[var(--text-title)] text-text-primary/50 select-none leading-snug"
          style={{ opacity: textOpacity }}
        >
          {text}
        </p>
      </div>
    </section>
  )
}

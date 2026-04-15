'use client'

import Image from 'next/image'
import { useSmoothParallax } from '@/hooks/useSmoothParallax'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export function Intimacy({ src }: { src: string }) {
  const imageRef = useSmoothParallax<HTMLDivElement>(0.92, 30)
  const textRef = useScrollReveal<HTMLDivElement>({
    translateY: 12,
    duration: 1200,
    delay: 200,
  })

  return (
    <section className="relative min-h-[90vh] md:min-h-[100vh] flex flex-col items-center justify-center py-16 md:py-24 px-6 overflow-hidden">
      {/* Warm atmospheric gradient — not flat */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 40% 45%, #0f0d0a 0%, #0d0907 60%, #0a0908 100%)',
        }}
      />

      {/* Image with soft-edge dissolution */}
      <div
        ref={imageRef}
        className="relative z-10 w-[82vw] md:w-[42vw] max-w-[580px]"
      >
        <div className="relative aspect-[4/5] overflow-hidden mask-soft-edges">
          <Image
            src={src}
            alt=""
            fill
            className="object-cover"
            sizes="(min-width: 768px) 42vw, 82vw"
          />
        </div>
      </div>

      {/* Contact whisper */}
      <div ref={textRef} className="relative z-10 text-center mt-12 md:mt-16">
        <p className="text-[var(--text-micro)] tracking-[0.25em] uppercase text-text-muted mb-5">
          By appointment
        </p>
        <a
          href="mailto:hello@vasilisa.com"
          className="font-serif font-light text-[var(--text-lead)] text-accent underline underline-offset-4 decoration-accent-soft transition-opacity duration-700 hover:opacity-60"
        >
          hello@vasilisa.com
        </a>
      </div>
    </section>
  )
}

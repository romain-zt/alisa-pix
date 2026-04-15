'use client'

import Image from 'next/image'
import { useSmoothParallax } from '@/hooks/useSmoothParallax'

interface DepthSceneProps {
  atmosphereSrc: string
  mainSrc: string
  label?: string
}

export function DepthScene({ atmosphereSrc, mainSrc, label }: DepthSceneProps) {
  const bgRef = useSmoothParallax<HTMLDivElement>(0.4, 80)
  const midRef = useSmoothParallax<HTMLDivElement>(0.88, 50)
  const fgRef = useSmoothParallax<HTMLDivElement>(1.2, 35)

  return (
    <section className="relative min-h-[120vh] md:min-h-[140vh] overflow-hidden tone-silk">
      {/* Layer 1 — Background atmosphere: slow, blurred, dim */}
      <div
        ref={bgRef}
        className="absolute inset-[-15%] z-[1]"
      >
        <Image
          src={atmosphereSrc}
          alt=""
          fill
          className="object-cover blur-[4px] opacity-25"
          sizes="130vw"
        />
      </div>

      {/* Layer 2 — Main image: sharp, asymmetric placement */}
      <div
        ref={midRef}
        className="
          relative z-10
          pt-[12vh] md:pt-[18vh]
          w-[88%] -ml-2
          md:w-[48vw] md:ml-[8vw]
        "
      >
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={mainSrc}
            alt=""
            fill
            className="object-cover"
            sizes="(min-width: 768px) 48vw, 88vw"
          />
        </div>
      </div>

      {/* Layer 3 — Foreground accent: fast, floating label */}
      {label && (
        <div
          ref={fgRef}
          className="
            absolute z-20
            bottom-[10vh] right-6
            md:bottom-[16vh] md:right-[10vw]
            flex items-center gap-4
          "
        >
          <div className="w-8 h-px bg-accent-soft opacity-40" />
          <p className="text-[var(--text-micro)] tracking-[0.3em] uppercase text-text-muted opacity-60">
            {label}
          </p>
        </div>
      )}
    </section>
  )
}

'use client'

import Image from 'next/image'
import { useSectionProgress } from '@/hooks/useSectionProgress'
import { useFrameReveal } from '@/hooks/useCameraFX'

export function ImpactImage({ src }: { src: string }) {
  const { ref: sectionRef, progress } = useSectionProgress<HTMLElement>()
  const { ref: frameRef } = useFrameReveal<HTMLDivElement>({
    direction: 'up',
    duration: 1400,
    triggerOnScroll: true,
  })

  const scale = 1.04 - progress * 0.04

  return (
    <section
      ref={sectionRef}
      className="relative h-[100svh] md:h-[110vh] overflow-hidden"
    >
      <div
        ref={frameRef}
        className="absolute inset-0"
        style={{
          transform: `scale(${scale})`,
        }}
      >
        <Image
          src={src}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
        {/* Subtle lens vignette on full-bleed impact */}
        <div className="lens-vignette-soft absolute inset-0" />
      </div>
    </section>
  )
}

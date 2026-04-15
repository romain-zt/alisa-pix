'use client'

import Image from 'next/image'

export function HardCut({ src }: { src: string }) {
  return (
    <section className="relative h-[80svh] md:h-[90vh] overflow-hidden">
      <Image
        src={src}
        alt=""
        fill
        className="object-cover"
        sizes="100vw"
        style={{
          filter: 'brightness(1.2) contrast(0.92)',
        }}
      />
      {/* Warm overexposure tint */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(255,250,240,0.06), transparent 40%, rgba(10,9,8,0.15) 100%)',
        }}
      />
    </section>
  )
}

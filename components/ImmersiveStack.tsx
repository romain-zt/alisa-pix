'use client'

import Image from 'next/image'
import { useSectionProgress } from '@/hooks/useSectionProgress'

// Light positions cycle per layer — each layer has a different atmospheric origin
const LIGHT_ORIGINS = [
  '20% 18%',  // top-left
  '78% 25%',  // top-right
  '30% 75%',  // bottom-left
  '72% 70%',  // bottom-right
]


export function ImmersiveStack({
  images,
}: {
  images: readonly string[]
}) {
  return (
    <section style={{ background: 'var(--color-bg-deep)' }}>
      {images.map((src, i) => (
        <StackLayer
          key={src}
          src={src}
          index={i}
          total={images.length}
        />
      ))}
    </section>
  )
}

function StackLayer({
  src,
  index,
  total,
}: {
  src: string
  index: number
  total: number
}) {
  const { ref, progress } = useSectionProgress<HTMLDivElement>()

  const scale = 1.0 + progress * 0.08
  const x = (index % 2 === 0 ? 1 : -1) * (4 - progress * 8)
  const isLast = index === total - 1

  const opacity =
    progress < 0.1
      ? progress / 0.1
      : !isLast && progress > 0.7
        ? 1 - ((progress - 0.7) / 0.3) * 0.6
        : 1

  // Gas counter-drift: opposite direction to subject
  const gasX = (index % 2 === 0 ? -1 : 1) * (6 - progress * 12)
  const gasY = (index % 2 === 0 ? 1 : -1) * (8 - progress * 16)
  const gasOpacity = progress < 0.08 ? 0 : Math.min(0.18, (progress - 0.08) * 0.22)

  // Liquid light intensity — peaks at mid-scroll
  const lightIntensity = progress > 0.1 && progress < 0.9
    ? Math.min(0.065, Math.sin((progress - 0.1) / 0.8 * Math.PI) * 0.065)
    : 0

  const lightOrigin = LIGHT_ORIGINS[index % LIGHT_ORIGINS.length]

  return (
    <div
      ref={ref}
      className="h-[130vh] relative"
      style={{ zIndex: index + 1 }}
    >
      <div
        className="sticky top-0 h-[100svh] overflow-hidden"
        style={{
          transform: `scale(${scale}) translate3d(${x}px, 0, 0)`,
          opacity,
        }}
      >
        {/* Gas layer — blurred, counter-drift driven by scroll progress */}
        <div
          className="absolute inset-[-25%]"
          style={{
            opacity: gasOpacity,
            transform: `translate3d(${gasX}px, ${gasY}px, 0) scale(1.2)`,
          }}
        >
          <Image
            src={src}
            alt=""
            fill
            className="object-cover blur-[12px]"
            sizes="150vw"
          />
        </div>

        {/* Subject — full bleed */}
        <Image
          src={src}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />

        {/* Liquid light — different quadrant per layer, never static */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: lightIntensity,
            background: `radial-gradient(ellipse 50% 45% at ${lightOrigin}, rgba(255,245,228,0.12) 0%, rgba(255,238,210,0.05) 40%, transparent 70%)`,
          }}
        />

        {/* Vignette — optical, consistent */}
        <div className="lens-vignette-soft absolute inset-0" />
      </div>
    </div>
  )
}

'use client'

import Image from 'next/image'
import { useSectionProgress } from '@/hooks/useSectionProgress'

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
        <Image
          src={src}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="lens-vignette-soft absolute inset-0" />
      </div>
    </div>
  )
}

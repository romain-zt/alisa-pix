'use client'

import Image from 'next/image'
import { useSectionProgress } from '@/hooks/useSectionProgress'

type LayerBehavior = 'zoomCenter' | 'slideLeft' | 'slideRight' | 'stillFade'

const LAYER_BEHAVIORS: LayerBehavior[] = ['zoomCenter', 'slideLeft', 'stillFade', 'slideRight']

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
          behavior={LAYER_BEHAVIORS[i % LAYER_BEHAVIORS.length]}
        />
      ))}
    </section>
  )
}

function StackLayer({
  src,
  index,
  total,
  behavior,
}: {
  src: string
  index: number
  total: number
  behavior: LayerBehavior
}) {
  const { ref, progress } = useSectionProgress<HTMLDivElement>()

  const isLast = index === total - 1

  const entryOpacity = progress < 0.12
    ? Math.pow(progress / 0.12, behavior === 'stillFade' ? 3 : 1.5)
    : 1

  const exitOpacity = !isLast && progress > 0.65
    ? 1 - Math.pow((progress - 0.65) / 0.35, 0.6) * 0.7
    : 1

  const opacity = entryOpacity * exitOpacity

  const transforms = getTransform(behavior, progress)

  return (
    <div
      ref={ref}
      className="h-[135vh] relative"
      style={{ zIndex: index + 1 }}
    >
      <div
        className="sticky top-0 h-[100svh] overflow-hidden"
        style={{
          ...transforms,
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

        {behavior === 'zoomCenter' && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 50% 45% at 50% 50%, transparent 30%, rgba(10,9,8,0.5) 100%)',
            }}
          />
        )}

        {behavior === 'slideLeft' && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(to right, rgba(10,9,8,0.3) 0%, transparent 25%, transparent 80%, rgba(10,9,8,0.5) 100%)',
            }}
          />
        )}

        {behavior === 'slideRight' && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(to left, rgba(10,9,8,0.3) 0%, transparent 25%, transparent 80%, rgba(10,9,8,0.5) 100%)',
            }}
          />
        )}

        <div className="lens-vignette-soft absolute inset-0" />

        {behavior === 'stillFade' && (
          <div
            className="absolute inset-0 z-10 pointer-events-none light-pulse"
            style={{
              background:
                'radial-gradient(ellipse 45% 40% at 40% 35%, rgba(255,245,230,0.08) 0%, transparent 60%)',
            }}
          />
        )}
      </div>
    </div>
  )
}

function getTransform(
  behavior: LayerBehavior,
  progress: number
): React.CSSProperties {
  switch (behavior) {
    case 'zoomCenter': {
      const scale = 1.0 + Math.pow(progress, 1.3) * 0.12
      return { transform: `scale(${scale})` }
    }
    case 'slideLeft': {
      const x = 25 - Math.pow(progress, 0.8) * 50
      const scale = 1.0 + progress * 0.04
      return { transform: `translate3d(${x}px, 0, 0) scale(${scale})` }
    }
    case 'slideRight': {
      const x = -25 + Math.pow(progress, 0.8) * 50
      const scale = 1.0 + progress * 0.04
      return { transform: `translate3d(${x}px, 0, 0) scale(${scale})` }
    }
    case 'stillFade': {
      const scale = 1.02 - progress * 0.02
      return { transform: `scale(${scale})` }
    }
  }
}

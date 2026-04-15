'use client'

import Image from 'next/image'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export function ImageReveal({
  src,
  alt = '',
  aspect = '3/4',
  priority = false,
}: {
  src: string
  alt?: string
  aspect?: string
  priority?: boolean
}) {
  const ref = useScrollReveal<HTMLDivElement>({
    translateY: 40,
    duration: 1200,
    delay: 100,
  })

  return (
    <div ref={ref} className="w-full overflow-hidden">
      <div className="relative w-full" style={{ aspectRatio: aspect }}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover img-bw"
          sizes="100vw"
          priority={priority}
        />
      </div>
    </div>
  )
}

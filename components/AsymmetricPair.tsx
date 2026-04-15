'use client'

import Image from 'next/image'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { useParallax } from '@/hooks/useParallax'

export function AsymmetricPair({
  src,
  alt = '',
  title,
  subtitle,
  reverse = false,
}: {
  src: string
  alt?: string
  title: string
  subtitle?: string
  reverse?: boolean
}) {
  const textRef = useScrollReveal<HTMLDivElement>({
    translateY: 25,
    duration: 900,
    delay: 200,
  })

  const imageRef = useParallax<HTMLDivElement>(0.06)

  return (
    <section
      className={`md:grid md:grid-cols-12 md:gap-0 md:min-h-[75vh] md:items-center ${
        reverse ? 'md:direction-rtl' : ''
      }`}
    >
      <div
        ref={imageRef}
        className={`relative h-[55vh] md:h-[70vh] overflow-hidden ${
          reverse
            ? 'md:col-span-7 md:col-start-6 md:dir-ltr'
            : 'md:col-span-7 md:col-start-1'
        }`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover img-bw"
          sizes="(min-width: 768px) 58vw, 100vw"
        />
      </div>

      <div
        ref={textRef}
        className={`px-6 py-10 md:py-0 ${
          reverse
            ? 'md:col-span-4 md:col-start-1 md:row-start-1 md:dir-ltr'
            : 'md:col-span-4 md:col-start-9'
        }`}
      >
        {subtitle && (
          <p className="text-[var(--text-micro)] tracking-[0.2em] uppercase text-text-muted mb-4">
            {subtitle}
          </p>
        )}
        <h2 className="font-serif font-light text-text-primary text-[var(--text-title)] leading-tight">
          {title}
        </h2>
      </div>
    </section>
  )
}

'use client'

import Image from 'next/image'
import { useStaggerReveal } from '@/hooks/useStaggerReveal'

export function EditorialGrid({ images }: { images: readonly string[] }) {
  const ref = useStaggerReveal<HTMLDivElement>('.grid-item', {
    stagger: 120,
    translateY: 35,
    duration: 1000,
  })

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-3 px-0 md:px-6"
    >
      {/* Row 1: large + small portrait */}
      {images[0] && (
        <div className="grid-item md:col-span-8 relative aspect-[3/2] overflow-hidden">
          <Image
            src={images[0]}
            alt=""
            fill
            className="object-cover img-bw"
            sizes="(min-width: 768px) 66vw, 100vw"
          />
        </div>
      )}
      {images[1] && (
        <div className="grid-item md:col-span-4 relative aspect-[3/4] overflow-hidden">
          <Image
            src={images[1]}
            alt=""
            fill
            className="object-cover img-bw"
            sizes="(min-width: 768px) 33vw, 100vw"
          />
        </div>
      )}

      {/* Row 2: two medium */}
      {images[2] && (
        <div className="grid-item md:col-span-5 relative aspect-[4/5] overflow-hidden">
          <Image
            src={images[2]}
            alt=""
            fill
            className="object-cover img-bw"
            sizes="(min-width: 768px) 42vw, 100vw"
          />
        </div>
      )}
      {images[3] && (
        <div className="grid-item md:col-span-7 relative aspect-[3/2] overflow-hidden">
          <Image
            src={images[3]}
            alt=""
            fill
            className="object-cover img-bw"
            sizes="(min-width: 768px) 58vw, 100vw"
          />
        </div>
      )}

      {/* Row 3: full bleed */}
      {images[4] && (
        <div className="grid-item md:col-span-12 relative aspect-[16/9] overflow-hidden">
          <Image
            src={images[4]}
            alt=""
            fill
            className="object-cover img-bw"
            sizes="100vw"
          />
        </div>
      )}

      {/* Row 4: offset pair */}
      {images[5] && (
        <div className="grid-item md:col-span-6 md:col-start-1 relative aspect-[2/3] overflow-hidden">
          <Image
            src={images[5]}
            alt=""
            fill
            className="object-cover img-bw"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        </div>
      )}
      {images[6] && (
        <div className="grid-item md:col-span-5 md:col-start-8 relative aspect-[4/5] overflow-hidden md:mt-12">
          <Image
            src={images[6]}
            alt=""
            fill
            className="object-cover img-bw"
            sizes="(min-width: 768px) 42vw, 100vw"
          />
        </div>
      )}

      {/* Row 5: single offset */}
      {images[7] && (
        <div className="grid-item md:col-span-8 md:col-start-3 relative aspect-[3/2] overflow-hidden">
          <Image
            src={images[7]}
            alt=""
            fill
            className="object-cover img-bw"
            sizes="(min-width: 768px) 66vw, 100vw"
          />
        </div>
      )}
    </div>
  )
}

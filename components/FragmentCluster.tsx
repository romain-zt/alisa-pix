'use client'

import Image from 'next/image'
import { useSmoothParallax } from '@/hooks/useSmoothParallax'

export function FragmentCluster({ images }: { images: readonly string[] }) {
  const slowRef = useSmoothParallax<HTMLDivElement>(0.45, 60)

  if (images.length < 5) return null

  return (
    <div className="relative md:h-[140vh] overflow-hidden tone-shadow">

      {/* Fragment 1 — Large portrait, bleeds left edge */}
      <div
        className="
          relative w-[88%] -ml-4 z-[2]
          md:absolute md:w-[42vw] md:-left-[4vw] md:top-[5vh] md:ml-0
        "
      >
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={images[0]}
            alt=""
            fill
            className="object-cover img-bw"
            sizes="(min-width: 768px) 42vw, 88vw"
          />
        </div>
      </div>

      {/* Fragment 2 — Smaller landscape, overlaps fragment 1, pulls eye right */}
      <div
        className="
          relative w-[62%] ml-auto mr-4 -mt-20 z-[3]
          md:absolute md:w-[30vw] md:left-[36vw] md:top-[10vh] md:mt-0 md:mr-0
        "
      >
        <div className="relative aspect-[3/2] overflow-hidden">
          <Image
            src={images[1]}
            alt=""
            fill
            className="object-cover img-bw"
            sizes="(min-width: 768px) 30vw, 62vw"
          />
        </div>
      </div>

      {/* Fragment 3 — Medium portrait, left side, with slow parallax */}
      <div
        ref={slowRef}
        className="
          relative w-[70%] ml-6 -mt-8 z-[1]
          md:absolute md:w-[32vw] md:right-[3vw] md:top-[45vh] md:mt-0 md:ml-0
        "
      >
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image
            src={images[2]}
            alt=""
            fill
            className="object-cover img-bw"
            sizes="(min-width: 768px) 32vw, 70vw"
          />
        </div>
      </div>

      {/* Fragment 4 — Wide landscape, center-left */}
      <div
        className="
          relative w-[92%] mx-auto -mt-12 z-[4]
          md:absolute md:w-[48vw] md:left-[10vw] md:top-[62vh] md:mt-0
        "
      >
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={images[3]}
            alt=""
            fill
            className="object-cover img-bw"
            sizes="(min-width: 768px) 48vw, 92vw"
          />
        </div>
      </div>

      {/* Fragment 5 — Small portrait, bleeds right edge */}
      <div
        className="
          relative w-[52%] ml-auto -mr-4 -mt-16 z-[5]
          md:absolute md:w-[24vw] md:right-[-3vw] md:top-[90vh] md:mt-0 md:mr-0
        "
      >
        <div className="relative aspect-[2/3] overflow-hidden">
          <Image
            src={images[4]}
            alt=""
            fill
            className="object-cover img-bw"
            sizes="(min-width: 768px) 24vw, 52vw"
          />
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { CinematicGallery } from '@/components/CinematicGallery'
import type { GalleryImage, GalleryMode } from '@/components/CinematicGallery'
import { photoImages, boudoirImages } from '@/lib/images'

const allImages: GalleryImage[] = [
  ...photoImages.slice(0, 8).map((src, i) => ({
    src,
    alt: `Photo ${i + 1}`,
  })),
  ...boudoirImages.slice(0, 7).map((src, i) => ({
    src,
    alt: `Boudoir ${i + 1}`,
  })),
]

export default function GalleryPage() {
  const [mode, setMode] = useState<GalleryMode>('vertical')

  return (
    <main className="relative">
      {/* Mode toggle — fixed top-right */}
      <div className="fixed top-6 right-6 z-50 flex gap-2">
        {(['vertical', 'horizontal'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`
              px-3 py-1.5 text-xs tracking-[0.15em] uppercase font-sans
              border transition-all duration-500
              ${mode === m
                ? 'border-gold/60 text-gold/90 bg-black/60'
                : 'border-off-white/10 text-off-white/30 bg-black/30 hover:border-off-white/20 hover:text-off-white/50'
              }
            `}
          >
            {m}
          </button>
        ))}
      </div>

      <CinematicGallery
        images={allImages}
        mode={mode}
        grain
        showCounter
      />
    </main>
  )
}

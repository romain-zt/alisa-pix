import { FullscreenGallery } from '@/components/FullscreenGallery'
import { GALLERY_IMAGES } from '@/lib/images'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gallery — Vasilisa',
  description: 'Boudoir photography by Vasilisa. Paris.',
}

export default function GalleryPage() {
  return <FullscreenGallery images={GALLERY_IMAGES} />
}

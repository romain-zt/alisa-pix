import { OrbitGallery } from '@/components/OrbitGallery'
import { GALLERY_IMAGES } from '@/lib/images'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gallery — Vasilisa',
  description: 'Selected boudoir photos — full-screen prints in orbit. Paris.',
}

export default function GalleryPage() {
  return <OrbitGallery images={GALLERY_IMAGES} />
}

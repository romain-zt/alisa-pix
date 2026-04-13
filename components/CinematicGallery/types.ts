export interface GalleryImage {
  src: string
  alt?: string
  caption?: string
}

export type GalleryMode = 'vertical' | 'horizontal'

export interface CinematicGalleryProps {
  images: GalleryImage[]
  mode?: GalleryMode
  grain?: boolean
  showCounter?: boolean
  className?: string
}

export interface GallerySlideProps {
  image: GalleryImage
  index: number
  total: number
  isActive: boolean
  grain?: boolean
  showCounter?: boolean
}

export interface VirtualWindow {
  startIndex: number
  endIndex: number
  activeIndex: number
  visibleSlides: { image: GalleryImage; index: number }[]
}

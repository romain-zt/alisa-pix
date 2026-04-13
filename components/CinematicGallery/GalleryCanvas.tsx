'use client'

import Image from 'next/image'

interface GalleryCanvasProps {
  src: string
  alt?: string
  className?: string
  active?: boolean
}

export default function GalleryCanvas({
  src,
  alt = '',
  className = '',
}: GalleryCanvasProps) {
  return (
    <div
      className={`relative select-none ${className}`}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="100vw"
        className="object-cover"
        draggable={false}
      />
    </div>
  )
}

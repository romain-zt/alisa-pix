'use client'

import Image from 'next/image'

interface ProtectedImageProps {
  src: string
  alt?: string
  className?: string
  priority?: boolean
}

export default function ProtectedImage({
  src,
  alt = '',
  className = '',
  priority = false,
}: ProtectedImageProps) {
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
        priority={priority}
        draggable={false}
      />
      {/* Invisible overlay prevents direct image interaction */}
      <div className="absolute inset-0 pointer-events-none" />
    </div>
  )
}

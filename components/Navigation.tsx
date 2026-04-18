'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface Props {
  /** When true, the nav is visible immediately (no scroll trigger). */
  alwaysVisible?: boolean
}

export function Navigation({ alwaysVisible = false }: Props) {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    if (alwaysVisible) return

    let ticking = false

    function onScroll() {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > window.innerHeight * 0.8)
        ticking = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [alwaysVisible])

  const visible = alwaysVisible || scrolled

  return (
    <nav
      className="fixed bottom-8 left-1/2 z-[9998] flex items-center gap-8 md:gap-10 px-7 py-3.5 rounded-full bg-bg-deep/70 backdrop-blur-md transition-all duration-1000"
      style={{
        opacity: visible ? 1 : 0,
        transform: `translateX(-50%) translateY(${visible ? 0 : 16}px)`,
        pointerEvents: visible ? 'auto' : 'none',
        boxShadow: '0 0 40px rgba(10,9,8,0.5)',
      }}
    >
      <Link
        href="/gallery"
        className={`text-[var(--text-micro)] tracking-[0.2em] uppercase transition-all duration-500 hover:tracking-[0.25em] min-h-[44px] flex items-center ${
          pathname === '/gallery'
            ? 'text-text-primary/80'
            : 'text-text-muted/40 hover:text-text-primary/80'
        }`}
      >
        Gallery
      </Link>
      <Link
        href="/book"
        className={`text-[var(--text-micro)] tracking-[0.2em] uppercase transition-all duration-500 hover:tracking-[0.25em] min-h-[44px] flex items-center ${
          pathname === '/book'
            ? 'text-accent'
            : 'text-accent/50 hover:text-accent'
        }`}
      >
        Book
      </Link>
    </nav>
  )
}

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export function Navigation() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let ticking = false

    function onScroll() {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const y = window.scrollY
        setVisible(y > window.innerHeight * 0.8)
        ticking = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
        className="text-[var(--text-micro)] tracking-[0.2em] uppercase text-text-muted/40 transition-all duration-500 hover:text-text-primary/80 hover:tracking-[0.25em] min-h-[44px] flex items-center"
      >
        Gallery
      </Link>
      <a
        href="#sessions"
        className="text-[var(--text-micro)] tracking-[0.2em] uppercase text-text-muted/40 transition-all duration-500 hover:text-text-primary/80 hover:tracking-[0.25em] min-h-[44px] flex items-center"
      >
        Sessions
      </a>
      <a
        href="mailto:hello@vasilisa.com"
        className="text-[var(--text-micro)] tracking-[0.2em] uppercase text-accent/50 transition-all duration-500 hover:text-accent min-h-[44px] flex items-center"
      >
        Contact
      </a>
    </nav>
  )
}

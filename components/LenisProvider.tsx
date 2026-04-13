'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import Lenis from 'lenis'

export default function LenisProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 2.2,
      // Cubic ease-out — slower, more sensual deceleration
      easing: (t) => 1 - Math.pow(1 - t, 3),
      touchMultiplier: 1.5,
    })

    lenisRef.current = lenis

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}

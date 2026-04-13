'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import Lenis from 'lenis'

export default function LenisProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 3.2,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      touchMultiplier: 1.2,
      wheelMultiplier: 0.7,
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

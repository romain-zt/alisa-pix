'use client'

import { useEffect, useState } from 'react'

export default function GrainOverlay() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <>
      {/* Film grain — keyframe defined in globals.css */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.025] mix-blend-overlay"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
          animation: 'grain-shift 0.15s steps(1) infinite',
        }}
      />

      {/* Cinematic vignette */}
      <div
        className="pointer-events-none fixed inset-0 z-40"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 110% 90% at 50% 50%, transparent 35%, rgba(0,0,0,0.3) 100%)',
        }}
      />

      {/* Faint scanlines */}
      <div
        className="pointer-events-none fixed inset-0 z-40 opacity-[0.012]"
        aria-hidden="true"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.4) 2px,
            rgba(0,0,0,0.4) 4px
          )`,
        }}
      />
    </>
  )
}

'use client'

export default function GrainOverlay() {
  return (
    <>
      {/* Film grain — lightweight CSS-only via SVG noise tile */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.02] mix-blend-overlay"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
        }}
      />

      {/* Subtle vignette */}
      <div
        className="pointer-events-none fixed inset-0 z-40"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 110% 90% at 50% 50%, transparent 40%, rgba(0,0,0,0.25) 100%)',
        }}
      />
    </>
  )
}

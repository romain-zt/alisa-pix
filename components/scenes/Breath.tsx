'use client'

interface BreathProps {
  height: string
}

export default function Breath({ height }: BreathProps) {
  return (
    <div style={{ height }} className="relative" aria-hidden>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(11,11,11,0) 60%, rgba(11,11,11,1) 100%)',
        }}
      />
    </div>
  )
}

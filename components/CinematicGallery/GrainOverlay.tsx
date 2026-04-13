'use client'

import { useRef, useEffect } from 'react'

interface GrainOverlayProps {
  intensity?: number
  className?: string
}

export default function GrainOverlay({ intensity = 0.04, className = '' }: GrainOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const size = 256
    canvas.width = size
    canvas.height = size

    let frame = 0

    function render() {
      const imageData = ctx!.createImageData(size, size)
      const data = imageData.data

      const seed = frame * 1000
      for (let i = 0; i < data.length; i += 4) {
        const v = ((Math.sin(seed + i) * 43758.5453) % 1) * 255 * intensity
        data[i] = v
        data[i + 1] = v
        data[i + 2] = v
        data[i + 3] = 255 * intensity * 2
      }

      ctx!.putImageData(imageData, 0, 0)
      frame++
      frameRef.current = requestAnimationFrame(render)
    }

    render()
    return () => cancelAnimationFrame(frameRef.current)
  }, [intensity])

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        mixBlendMode: 'overlay',
        opacity: 0.6,
      }}
    />
  )
}

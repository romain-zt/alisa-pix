'use client'

import { useRef, useEffect, useState } from 'react'

interface ProtectedImageProps {
  src: string
  alt?: string
  className?: string
  priority?: boolean
}

const GRAIN_SHADER = `
  precision mediump float;
  uniform sampler2D u_image;
  uniform float u_time;
  uniform vec2 u_resolution;
  varying vec2 v_texCoord;

  float rand(vec2 co) {
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    vec4 color = texture2D(u_image, v_texCoord);
    float grain = rand(v_texCoord * u_resolution + u_time) * 0.06 - 0.03;
    color.rgb += grain;
    gl_FragColor = color;
  }
`

const VERTEX_SHADER = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  varying vec2 v_texCoord;

  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_texCoord = a_texCoord;
  }
`

export default function ProtectedImage({ src, alt = '', className = '', priority = false }: ProtectedImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [loaded, setLoaded] = useState(false)
  const animFrameRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl', { preserveDrawingBuffer: false, antialias: false })
    if (!gl) return

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = src

    img.onload = () => {
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight

      const vs = gl.createShader(gl.VERTEX_SHADER)!
      gl.shaderSource(vs, VERTEX_SHADER)
      gl.compileShader(vs)

      const fs = gl.createShader(gl.FRAGMENT_SHADER)!
      gl.shaderSource(fs, GRAIN_SHADER)
      gl.compileShader(fs)

      const program = gl.createProgram()!
      gl.attachShader(program, vs)
      gl.attachShader(program, fs)
      gl.linkProgram(program)
      gl.useProgram(program)

      const posBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1, 1, -1, -1, 1,
        -1, 1, 1, -1, 1, 1,
      ]), gl.STATIC_DRAW)

      const posLoc = gl.getAttribLocation(program, 'a_position')
      gl.enableVertexAttribArray(posLoc)
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

      const texBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        0, 1, 1, 1, 0, 0,
        0, 0, 1, 1, 1, 0,
      ]), gl.STATIC_DRAW)

      const texLoc = gl.getAttribLocation(program, 'a_texCoord')
      gl.enableVertexAttribArray(texLoc)
      gl.vertexAttribPointer(texLoc, 2, gl.FLOAT, false, 0, 0)

      const texture = gl.createTexture()
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)

      const timeLoc = gl.getUniformLocation(program, 'u_time')
      const resLoc = gl.getUniformLocation(program, 'u_resolution')
      gl.uniform2f(resLoc, canvas.width, canvas.height)

      gl.viewport(0, 0, canvas.width, canvas.height)

      function render() {
        if (!gl || !timeLoc) return
        gl.uniform1f(timeLoc, performance.now() * 0.001)
        gl.drawArrays(gl.TRIANGLES, 0, 6)
        animFrameRef.current = requestAnimationFrame(render)
      }

      render()
      setLoaded(true)
    }

    return () => {
      cancelAnimationFrame(animFrameRef.current)
    }
  }, [src])

  return (
    <div
      className={`relative select-none ${className}`}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover"
        style={{
          opacity: loaded ? 1 : 0,
          transition: 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        aria-label={alt}
      />
      {!loaded && (
        <div className="absolute inset-0 bg-charcoal animate-pulse" />
      )}
      {/* Invisible watermark overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 100px,
            rgba(198, 168, 110, 0.008) 100px,
            rgba(198, 168, 110, 0.008) 101px
          )`,
        }}
      />
    </div>
  )
}

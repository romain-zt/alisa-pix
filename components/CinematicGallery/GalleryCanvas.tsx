'use client'

import { useRef, useEffect, useState, useCallback } from 'react'

interface GalleryCanvasProps {
  src: string
  alt?: string
  className?: string
  active?: boolean
}

const GRAIN_VERTEX = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  varying vec2 v_texCoord;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_texCoord = a_texCoord;
  }
`

const GRAIN_FRAGMENT = `
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

function initWebGL(canvas: HTMLCanvasElement, img: HTMLImageElement) {
  const gl = canvas.getContext('webgl', { preserveDrawingBuffer: false, antialias: false })
  if (!gl) return null

  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight

  const vs = gl.createShader(gl.VERTEX_SHADER)!
  gl.shaderSource(vs, GRAIN_VERTEX)
  gl.compileShader(vs)

  const fs = gl.createShader(gl.FRAGMENT_SHADER)!
  gl.shaderSource(fs, GRAIN_FRAGMENT)
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

  return { gl, timeLoc }
}

function draw2D(canvas: HTMLCanvasElement, img: HTMLImageElement) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight
  ctx.drawImage(img, 0, 0)
}

export default function GalleryCanvas({ src, alt = '', className = '', active = false }: GalleryCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [loaded, setLoaded] = useState(false)
  const animFrameRef = useRef<number>(0)
  const glRef = useRef<{ gl: WebGLRenderingContext; timeLoc: WebGLUniformLocation | null } | null>(null)

  const render = useCallback(() => {
    if (!glRef.current) return
    const { gl, timeLoc } = glRef.current
    gl.uniform1f(timeLoc, performance.now() * 0.001)
    gl.drawArrays(gl.TRIANGLES, 0, 6)
    animFrameRef.current = requestAnimationFrame(render)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = src

    img.onload = () => {
      if (active) {
        const result = initWebGL(canvas, img)
        if (result) {
          glRef.current = result
          render()
        } else {
          draw2D(canvas, img)
        }
      } else {
        draw2D(canvas, img)
      }
      setLoaded(true)
    }

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      glRef.current = null
    }
  }, [src, active, render])

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
    </div>
  )
}

'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react'

/**
 * LightThread — a luminous braid of warm strands that weaves through every
 * registered surface like a DNA helix flowing across the entire page.
 *
 * Architecture:
 *   - <LightThreadProvider> wraps the page and renders one fixed-position SVG
 *     overlay sitting between the cinematic background (z-0) and content (z-10).
 *   - Each surface that wants to be threaded calls useLightThreadAnchor({order,
 *     side}) and attaches the returned ref to its outer DOM node.
 *
 * Each frame we:
 *   1. Measure every anchor's bounding rect in viewport coordinates.
 *   2. Build a smooth, low-tension Catmull-Rom curve through them — this is
 *      the *spine* (never drawn).
 *   3. Sample the spine at fine intervals via getPointAtLength + tangent.
 *   4. Offset each sample perpendicular to the tangent by
 *      amplitude · sin(arcLength · ω + phaseₛ + timeDrift) — one phase per
 *      strand. Three strands at phases 0, 2π/3, 4π/3 form an equilateral
 *      braid that crosses itself rhythmically along the path.
 *   5. The amplitude is enveloped (sin(πt)) so the strands converge to a
 *      single point at the ghost endpoints — the braid "ties off" off-screen.
 *
 * The result is three warm threads (gold / champagne / rose-gold) softly
 * weaving around an invisible spine, breathing slowly thanks to a gentle
 * time-driven phase drift. Reduced motion freezes the drift and just renders
 * the static braid.
 */

type ThreadSide = 'left' | 'right' | 'center'

interface ThreadAnchor {
  id: string
  order: number
  side: ThreadSide
  inset: number
  ref: RefObject<HTMLElement | null>
}

interface ThreadContextValue {
  register: (anchor: ThreadAnchor) => void
  unregister: (id: string) => void
}

const ThreadContext = createContext<ThreadContextValue | null>(null)

interface UseAnchorOptions {
  order?: number
  side?: ThreadSide
  inset?: number
}

export function useLightThreadAnchor<T extends HTMLElement>(
  opts: UseAnchorOptions = {}
) {
  const ctx = useContext(ThreadContext)
  const ref = useRef<T | null>(null)
  const id = useId()
  const { order, side = 'center', inset = 14 } = opts

  useEffect(() => {
    if (!ctx || order == null) return
    ctx.register({
      id,
      order,
      side,
      inset,
      ref: ref as RefObject<HTMLElement | null>,
    })
    return () => ctx.unregister(id)
  }, [ctx, id, order, side, inset])

  return ref
}

interface ProviderProps {
  children: ReactNode
}

export function LightThreadProvider({ children }: ProviderProps) {
  const anchorsRef = useRef<Map<string, ThreadAnchor>>(new Map())
  const [version, setVersion] = useState(0)

  const register = useCallback((anchor: ThreadAnchor) => {
    anchorsRef.current.set(anchor.id, anchor)
    setVersion((v) => v + 1)
  }, [])

  const unregister = useCallback((id: string) => {
    anchorsRef.current.delete(id)
    setVersion((v) => v + 1)
  }, [])

  // Stable context value — without useMemo, every Provider re-render (which
  // happens on every register/unregister) hands consumers a fresh object,
  // their useEffect deps change, they re-register, the cycle never ends.
  const value = useMemo(() => ({ register, unregister }), [register, unregister])

  return (
    <ThreadContext.Provider value={value}>
      {children}
      <LightThread anchorsRef={anchorsRef} version={version} />
    </ThreadContext.Provider>
  )
}

interface Point {
  x: number
  y: number
}

/**
 * Catmull-Rom → cubic Bezier conversion. Tension 0.35 keeps the spine loose
 * and flowing — the braid that wraps it does the rest of the visual work.
 */
function catmullRomPath(points: Point[], tension = 0.35): string {
  if (points.length < 2) return ''
  const k = (1 - tension) / 6
  const parts: string[] = [
    `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`,
  ]

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] ?? p2

    const c1x = p1.x + (p2.x - p0.x) * k
    const c1y = p1.y + (p2.y - p0.y) * k
    const c2x = p2.x - (p3.x - p1.x) * k
    const c2y = p2.y - (p3.y - p1.y) * k

    parts.push(
      `C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
    )
  }

  return parts.join(' ')
}

interface RendererProps {
  anchorsRef: RefObject<Map<string, ThreadAnchor>>
  version: number
}

// Each strand has its own amplitude, wavelength, phase and drift speed so the
// three lines move on *unrelated* rhythms — they pass close, cross, then drift
// far apart again, never tracing a mechanical helix. This is what gives the
// braid an organic, "three independent currents" feel rather than a clean
// spring. Wavelengths are deliberately non-commensurate so they almost never
// realign exactly.
interface StrandConfig {
  amplitude: number
  wavelength: number
  phase: number
  drift: number
  stroke: string
  width: number
}

const STRAND_CONFIGS: StrandConfig[] = [
  // Black — only visible against the brighter regions of the cinematic
  // background; "appears and disappears" with the light naturally.
  {
    amplitude: 70,
    wavelength: 180,
    phase: 0,
    drift: 0.055,
    stroke: 'rgba(0,0,0,0.55)',
    width: 0.5,
  },
  // White — the brightest line, the most visible thread.
  {
    amplitude: 56,
    wavelength: 260,
    phase: 1.7,
    drift: -0.039,
    stroke: 'rgba(255,255,255,0.55)',
    width: 0.5,
  },
  // Silver — cool neutral, sits between the two.
  {
    amplitude: 82,
    wavelength: 145,
    phase: 3.4,
    drift: 0.068,
    stroke: 'rgba(196,200,210,0.50)',
    width: 0.5,
  },
]

const SAMPLE_STEP_PX = 8
const SAMPLE_MIN = 50
const SAMPLE_MAX = 280

function LightThread({ anchorsRef, version }: RendererProps) {
  const measureRef = useRef<SVGPathElement>(null)
  const strand0Ref = useRef<SVGPathElement>(null)
  const strand1Ref = useRef<SVGPathElement>(null)
  const strand2Ref = useRef<SVGPathElement>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const sync = () => setSize({ w: window.innerWidth, h: window.innerHeight })
    sync()
    window.addEventListener('resize', sync, { passive: true })
    return () => window.removeEventListener('resize', sync)
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReducedMotion(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (size.w === 0) return

    const measure = measureRef.current
    if (!measure) return

    const strands = [strand0Ref.current, strand1Ref.current, strand2Ref.current]
    if (strands.some((s) => !s)) return

    const startedAt =
      typeof performance !== 'undefined' ? performance.now() : Date.now()
    let frameId = 0
    let lastSpineD = ''
    // Pre-compute angular frequencies and drift rates so the inner loop only
    // does adds + sin().
    const strandOmega = STRAND_CONFIGS.map(
      (c) => (2 * Math.PI) / c.wavelength
    )
    const strandDriftRate = STRAND_CONFIGS.map((c) => c.drift * Math.PI * 2)

    const draw = (now: number) => {
      const map = anchorsRef.current
      if (!map) return
      const anchors = Array.from(map.values()).sort((a, b) => a.order - b.order)
      if (anchors.length < 2) return

      // 1. Spine control points from anchor positions.
      const points: Point[] = []
      for (const anchor of anchors) {
        const el = anchor.ref.current
        if (!el) continue
        const r = el.getBoundingClientRect()
        if (r.width === 0 && r.height === 0) continue

        const inset = anchor.inset
        let x: number
        if (anchor.side === 'left') x = r.left + inset
        else if (anchor.side === 'right') x = r.right - inset
        else x = (r.left + r.right) / 2

        const y = (r.top + r.bottom) / 2
        points.push({ x, y })
      }
      if (points.length < 2) return

      // Ghost endpoints: braid converges to a point off-screen at both ends.
      // Pushed at least 1.6× viewport beyond the first/last anchor so the
      // amplitude envelope's taper is always well outside what the user can
      // actually see — the strands stay at full amplitude all the way to the
      // top and bottom edges of the viewport, including when scrolled to the
      // very end of the page.
      const first = points[0]
      const last = points[points.length - 1]
      const ghostExtend = Math.max(900, size.h * 1.6)
      const ghostFirst: Point = {
        x: first.x + (first.x < size.w / 2 ? -90 : 90),
        y: first.y - ghostExtend,
      }
      const ghostLast: Point = {
        x: last.x + (last.x < size.w / 2 ? -90 : 90),
        y: last.y + ghostExtend,
      }

      const spineD = catmullRomPath([ghostFirst, ...points, ghostLast], 0.35)

      if (spineD !== lastSpineD) {
        measure.setAttribute('d', spineD)
        lastSpineD = spineD
      }

      // 2. Sample the spine.
      const totalLen = measure.getTotalLength()
      if (!Number.isFinite(totalLen) || totalLen <= 0) return
      const sampleCount = Math.max(
        SAMPLE_MIN,
        Math.min(SAMPLE_MAX, Math.floor(totalLen / SAMPLE_STEP_PX))
      )

      const elapsed = reducedMotion ? 0 : (now - startedAt) / 1000

      const strandParts: string[][] = [[], [], []]

      for (let i = 0; i < sampleCount; i++) {
        const t = i / (sampleCount - 1)
        const len = t * totalLen
        const p = measure.getPointAtLength(len)

        // Tangent via a tiny forward step (or backward at the very end).
        const step = 1
        const lookAhead = len + step <= totalLen ? len + step : len - step
        const pNext = measure.getPointAtLength(lookAhead)
        const tx = (pNext.x - p.x) * (lookAhead > len ? 1 : -1)
        const ty = (pNext.y - p.y) * (lookAhead > len ? 1 : -1)
        const tlen = Math.hypot(tx, ty) || 1
        const nx = -ty / tlen
        const ny = tx / tlen

        // Flat envelope: amplitude is 1 across the whole path and only tapers
        // to 0 within the final ~6% at each end. Combined with the long
        // ghost extension above, this guarantees the visible strands always
        // run at full thickness from top to bottom of viewport.
        const TAPER = 0.06
        let envelope = 1
        if (t < TAPER) envelope = Math.sin((t / TAPER) * (Math.PI / 2))
        else if (t > 1 - TAPER)
          envelope = Math.sin(((1 - t) / TAPER) * (Math.PI / 2))

        for (let s = 0; s < 3; s++) {
          const cfg = STRAND_CONFIGS[s]
          const drift = elapsed * strandDriftRate[s]
          const offset =
            cfg.amplitude *
            envelope *
            Math.sin(len * strandOmega[s] + cfg.phase + drift)
          const x = (p.x + nx * offset).toFixed(1)
          const y = (p.y + ny * offset).toFixed(1)
          strandParts[s].push(i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`)
        }
      }

      for (let s = 0; s < 3; s++) {
        strands[s]!.setAttribute('d', strandParts[s].join(' '))
      }
    }

    if (reducedMotion) {
      // Schedule on demand only. The braid is static; just refit on scroll.
      let pending = false
      const schedule = () => {
        if (pending) return
        pending = true
        frameId = requestAnimationFrame((time) => {
          pending = false
          draw(time)
        })
      }

      schedule()
      window.addEventListener('scroll', schedule, { passive: true })
      window.addEventListener('resize', schedule, { passive: true })

      return () => {
        cancelAnimationFrame(frameId)
        window.removeEventListener('scroll', schedule)
        window.removeEventListener('resize', schedule)
      }
    }

    // Continuous loop so the helix breathes/rotates even when scroll is idle.
    const loop = (time: number) => {
      frameId = requestAnimationFrame(loop)
      draw(time)
    }
    frameId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frameId)
  }, [version, reducedMotion, size.w, size.h, anchorsRef])

  if (size.w === 0) return null

  return (
    <svg
      className="light-thread fixed inset-0 z-[5] pointer-events-none"
      width={size.w}
      height={size.h}
      viewBox={`0 0 ${size.w} ${size.h}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ mixBlendMode: 'screen' }}
    >
      <defs>
        <filter
          id="lt-soft"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="0.9" />
        </filter>
      </defs>

      {/* Hidden spine — only used as a measurement source for the strands. */}
      <path ref={measureRef} d="" fill="none" stroke="none" />

      {/* Three warm strands, each on its own rhythm. */}
      <path
        ref={strand0Ref}
        d=""
        fill="none"
        stroke={STRAND_CONFIGS[0].stroke}
        strokeWidth={STRAND_CONFIGS[0].width}
        strokeLinecap="round"
        filter="url(#lt-soft)"
      />
      <path
        ref={strand1Ref}
        d=""
        fill="none"
        stroke={STRAND_CONFIGS[1].stroke}
        strokeWidth={STRAND_CONFIGS[1].width}
        strokeLinecap="round"
        filter="url(#lt-soft)"
      />
      <path
        ref={strand2Ref}
        d=""
        fill="none"
        stroke={STRAND_CONFIGS[2].stroke}
        strokeWidth={STRAND_CONFIGS[2].width}
        strokeLinecap="round"
        filter="url(#lt-soft)"
      />
    </svg>
  )
}

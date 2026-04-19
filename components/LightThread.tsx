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
 * LightThread — short, intimate filaments that connect *some* surface
 * borders to others. Not a single page-spanning helix.
 *
 * Architecture:
 *   - <LightThreadProvider segments=[[1,2], [5,6,7]]> wraps the page.
 *     Each segment is an ordered list of anchor `order` values; only those
 *     anchors are connected, and each segment is its own braid.
 *   - Surfaces register via useLightThreadAnchor({order, side}). An anchor
 *     whose order does not appear in any segment is silently ignored.
 *
 * Each frame, for every segment we:
 *   1. Resolve the segment's anchors in order.
 *   2. Build a smooth Catmull-Rom spine through them (no off-screen ghost
 *      endpoints — segments are short and finite, so they begin and end
 *      *at* the surface borders themselves).
 *   3. Sample the spine and offset each sample perpendicular to the tangent
 *      by amplitude · sin(arcLength · ω + phaseₛ + timeDrift), once per
 *      strand. Three strands form a slow braid that crosses along the path.
 *   4. Taper amplitude in the first/last ~12% of the spine so the strands
 *      collapse cleanly into the surface borders they connect.
 *
 * Result: discrete, contemplative filaments — a thread between *those two
 * thoughts*, not a continuous river through the page. Reduced motion freezes
 * the drift and renders the static braid.
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
  /**
   * Each segment is an ordered list of anchor `order` values that should
   * be connected by a single short braid. Anchors not present in any
   * segment are ignored by the renderer. Defaults to no segments — i.e.
   * nothing is drawn until the consumer opts in.
   */
  segments?: ReadonlyArray<ReadonlyArray<number>>
}

const DEFAULT_SEGMENTS: ReadonlyArray<ReadonlyArray<number>> = []

export function LightThreadProvider({
  children,
  segments = DEFAULT_SEGMENTS,
}: ProviderProps) {
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
      <LightThread
        anchorsRef={anchorsRef}
        version={version}
        segments={segments}
      />
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
  segments: ReadonlyArray<ReadonlyArray<number>>
}

// Each strand has its own amplitude, wavelength, phase and drift speed so the
// three lines move on *unrelated* rhythms — they pass close, cross, then drift
// far apart again, never tracing a mechanical helix. This is what gives the
// braid an organic, "three independent currents" feel rather than a clean
// spring. Wavelengths are deliberately non-commensurate so they almost never
// realign exactly.
interface StrandConfig {
  /** Base perpendicular amplitude in px. */
  amplitude: number
  /**
   * Slow modulation envelope on top of the base amplitude. The actual
   * amplitude swings between `amplitude` and `amplitude * (1 + ampSwing)`
   * over a wavelength of `ampWavelength`. With ampSwing > ~3 the strand will
   * occasionally fly off the left/right edge of the viewport and disappear,
   * naturally re-entering when the modulation cycles down.
   */
  ampSwing: number
  ampWavelength: number
  ampPhase: number
  /** Wavelength of the strand's main perpendicular sine, in px. */
  wavelength: number
  phase: number
  /** Time drift in Hz — how fast the wave slides along the spine. */
  drift: number
  stroke: string
  width: number
}

// Long soft sweeping S-curves: each main wavelength spans roughly one to two
// viewports, so the visible strands look like slow, calligraphic strokes.
// On top of that, each strand has its own *amplitude modulation* with a much
// longer wavelength (multiple viewports). At its peak the line swings far past
// the viewport edge and disappears for a while; at its trough it hugs the
// spine. The two modulations are deliberately incommensurate per strand and
// across strands, so the disappearance/return rhythm always feels organic.
const STRAND_CONFIGS: StrandConfig[] = [
  // Black — only visible against the brighter regions of the cinematic
  // background; "appears and disappears" with the light naturally.
  {
    amplitude: 110,
    ampSwing: 4.2,
    ampWavelength: 2900,
    ampPhase: 0.4,
    wavelength: 820,
    phase: 0,
    drift: 0.018,
    stroke: 'rgba(0,0,0,0.55)',
    width: 0.5,
  },
  // White — the brightest line, the most visible thread.
  {
    amplitude: 90,
    ampSwing: 5.0,
    ampWavelength: 3700,
    ampPhase: 2.1,
    wavelength: 1180,
    phase: 1.7,
    drift: -0.013,
    stroke: 'rgba(255,255,255,0.55)',
    width: 0.5,
  },
  // Silver — cool neutral, sits between the two.
  {
    amplitude: 140,
    ampSwing: 3.4,
    ampWavelength: 2300,
    ampPhase: 4.7,
    wavelength: 680,
    phase: 3.4,
    drift: 0.024,
    stroke: 'rgba(196,200,210,0.50)',
    width: 0.5,
  },
]

const SAMPLE_STEP_PX = 8
const SAMPLE_MIN = 32
const SAMPLE_MAX = 220

function LightThread({ anchorsRef, version, segments }: RendererProps) {
  // One <g> per segment. Each group has 3 strand paths + 1 hidden measure
  // path. We allocate up to MAX_SEGMENTS groups and only draw into the ones
  // that have a corresponding segment this frame.
  const MAX_SEGMENTS = 6
  const measureRefs = useRef<(SVGPathElement | null)[]>([])
  const strandRefs = useRef<(SVGPathElement | null)[][]>([])
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
    if (segments.length === 0) return

    const startedAt =
      typeof performance !== 'undefined' ? performance.now() : Date.now()
    let frameId = 0
    const lastSpineD: string[] = new Array(MAX_SEGMENTS).fill('')

    // Pre-compute angular frequencies and drift rates so the inner loop only
    // does adds + sin().
    const strandOmega = STRAND_CONFIGS.map(
      (c) => (2 * Math.PI) / c.wavelength
    )
    const strandAmpOmega = STRAND_CONFIGS.map(
      (c) => (2 * Math.PI) / c.ampWavelength
    )
    const strandDriftRate = STRAND_CONFIGS.map((c) => c.drift * Math.PI * 2)

    function anchorPoint(anchor: ThreadAnchor): Point | null {
      const el = anchor.ref.current
      if (!el) return null
      const r = el.getBoundingClientRect()
      if (r.width === 0 && r.height === 0) return null
      const inset = anchor.inset
      let x: number
      if (anchor.side === 'left') x = r.left + inset
      else if (anchor.side === 'right') x = r.right - inset
      else x = (r.left + r.right) / 2
      const y = (r.top + r.bottom) / 2
      return { x, y }
    }

    const drawSegment = (
      segIdx: number,
      points: Point[],
      elapsed: number
    ) => {
      const measure = measureRefs.current[segIdx]
      const strandSet = strandRefs.current[segIdx]
      if (!measure || !strandSet) return
      if (points.length < 2) {
        // Empty / not enough anchors — clear the slot.
        if (lastSpineD[segIdx] !== '') {
          for (let s = 0; s < 3; s++) strandSet[s]?.setAttribute('d', '')
          measure.setAttribute('d', '')
          lastSpineD[segIdx] = ''
        }
        return
      }

      // Short, finite spine — no ghost extension. The braid begins and ends
      // exactly at the first and last surface borders.
      const spineD = catmullRomPath(points, 0.35)
      if (spineD !== lastSpineD[segIdx]) {
        measure.setAttribute('d', spineD)
        lastSpineD[segIdx] = spineD
      }

      const totalLen = measure.getTotalLength()
      if (!Number.isFinite(totalLen) || totalLen <= 0) return

      const sampleCount = Math.max(
        SAMPLE_MIN,
        Math.min(SAMPLE_MAX, Math.floor(totalLen / SAMPLE_STEP_PX))
      )

      const strandParts: string[][] = [[], [], []]

      for (let i = 0; i < sampleCount; i++) {
        const t = i / (sampleCount - 1)
        const len = t * totalLen
        const p = measure.getPointAtLength(len)

        const step = 1
        const lookAhead = len + step <= totalLen ? len + step : len - step
        const pNext = measure.getPointAtLength(lookAhead)
        const tx = (pNext.x - p.x) * (lookAhead > len ? 1 : -1)
        const ty = (pNext.y - p.y) * (lookAhead > len ? 1 : -1)
        const tlen = Math.hypot(tx, ty) || 1
        const nx = -ty / tlen
        const ny = tx / tlen

        // Wider taper (~12% each end) so the strands collapse cleanly into
        // the surface borders themselves — no off-screen ghost endpoints.
        const TAPER = 0.12
        let envelope = 1
        if (t < TAPER) envelope = Math.sin((t / TAPER) * (Math.PI / 2))
        else if (t > 1 - TAPER)
          envelope = Math.sin(((1 - t) / TAPER) * (Math.PI / 2))

        for (let s = 0; s < 3; s++) {
          const cfg = STRAND_CONFIGS[s]
          const drift = elapsed * strandDriftRate[s]
          const ampMul =
            1 +
            cfg.ampSwing *
              0.5 *
              (1 +
                Math.sin(
                  len * strandAmpOmega[s] + cfg.ampPhase + drift * 0.35
                ))
          const localAmp = cfg.amplitude * envelope * ampMul
          const offset =
            localAmp * Math.sin(len * strandOmega[s] + cfg.phase + drift)
          const x = (p.x + nx * offset).toFixed(1)
          const y = (p.y + ny * offset).toFixed(1)
          strandParts[s].push(i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`)
        }
      }

      for (let s = 0; s < 3; s++) {
        strandSet[s]?.setAttribute('d', strandParts[s].join(' '))
      }
    }

    const draw = (now: number) => {
      const map = anchorsRef.current
      if (!map) return
      const elapsed = reducedMotion ? 0 : (now - startedAt) / 1000

      // Index anchors by `order` for fast lookup.
      const byOrder = new Map<number, ThreadAnchor>()
      for (const a of map.values()) byOrder.set(a.order, a)

      for (let segIdx = 0; segIdx < MAX_SEGMENTS; segIdx++) {
        const orders = segments[segIdx]
        if (!orders || orders.length < 2) {
          drawSegment(segIdx, [], elapsed)
          continue
        }
        const points: Point[] = []
        for (const order of orders) {
          const anchor = byOrder.get(order)
          if (!anchor) continue
          const p = anchorPoint(anchor)
          if (p) points.push(p)
        }
        drawSegment(segIdx, points, elapsed)
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
  }, [version, reducedMotion, size.w, size.h, anchorsRef, segments])

  if (size.w === 0) return null
  if (segments.length === 0) return null

  // Render one <g> per allocated segment slot. Empty slots stay invisible
  // because their paths have d="".
  const slots = Array.from({ length: MAX_SEGMENTS }, (_, i) => i)

  return (
    <svg
      className="light-thread fixed inset-0 z-[5] pointer-events-none"
      width={size.w}
      height={size.h}
      viewBox={`0 0 ${size.w} ${size.h}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {slots.map((segIdx) => (
        <g key={segIdx}>
          {/* Hidden spine — only a measurement source for the strands. */}
          <path
            ref={(el) => {
              measureRefs.current[segIdx] = el
            }}
            d=""
            fill="none"
            stroke="none"
          />
          {STRAND_CONFIGS.map((cfg, s) => (
            <path
              key={s}
              ref={(el) => {
                if (!strandRefs.current[segIdx]) {
                  strandRefs.current[segIdx] = []
                }
                strandRefs.current[segIdx][s] = el
              }}
              d=""
              fill="none"
              stroke={cfg.stroke}
              strokeWidth={cfg.width}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>
      ))}
    </svg>
  )
}

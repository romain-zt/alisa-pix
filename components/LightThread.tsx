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
 * Each segment is rendered as three coupled elements:
 *   - A main spine running between two surface BORDERS (not centers): the
 *     edge of each surface facing its neighbor. The strands taper to zero
 *     amplitude at both endpoints, so they emerge cleanly from the borders
 *     themselves.
 *   - A "vein" along each endpoint's surface border — a short, gentle wave
 *     running ALONG the border axis, pinned to the connection point so it
 *     also passes through it with zero offset. Together with the main
 *     strand's tapered endpoint, this makes the surface border look as if
 *     it has come alive at the connection — the border *follows* the line.
 *
 * Architecture:
 *   - <LightThreadProvider segments=[[1,2], [5,6,7]]> wraps the page.
 *     Each segment is an ordered list of anchor `order` values; only those
 *     anchors are connected, and each segment is its own braid + veins.
 *   - Surfaces register via useLightThreadAnchor({order}). The endpoint
 *     edge is auto-detected per frame from the direction to the neighbor.
 *
 * Each frame, per segment:
 *   1. Resolve the first/last anchors' BORDER points (edge facing neighbor).
 *   2. Build a smooth Catmull-Rom spine [first.point, …interior, last.point].
 *   3. Sample the spine; each strand offset = sum of two incommensurate
 *      sines × envelope. Envelope tapers at both ends so strands collapse
 *      into the border points exactly.
 *   4. For each endpoint, build a vein spine — a straight line through the
 *      border point along the border axis. Sample it with the same wave
 *      engine but use a TWO-HUMP envelope (|sin(2πt)|): zero at both ends
 *      AND at center, so the vein passes cleanly through the connection.
 *
 * Reduced motion freezes drift and renders the static composition.
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

// Each strand is the sum of TWO sine waves at incommensurate wavelengths.
// One strand is no longer a clean sinusoid — it drifts, leans, never quite
// repeats. Combined with a tiny per-strand amplitude modulation, this is
// what makes the line feel like a hair or a silk thread instead of a wave.
//
// Verticality is implicit: the spine through stacked surfaces is mostly
// vertical, so "perpendicular offset" *is* horizontal sway. Smaller
// amplitudes ⇒ tighter to the spine ⇒ more vertical, more sensual.
interface StrandConfig {
  /** Base perpendicular amplitude in px (kept small — 25–45). */
  amplitude: number
  /**
   * Gentle modulation envelope on top of the base amplitude. Actual
   * amplitude swings between `amplitude` and `amplitude * (1 + ampSwing)`
   * over a wavelength of `ampWavelength`. Kept low (≤ 0.9) so the strand
   * never flies past the edges — it stays present and intimate.
   */
  ampSwing: number
  ampWavelength: number
  ampPhase: number
  /** Primary wavelength — long, calligraphic. ~1.5–2.4 viewports. */
  wavelength: number
  phase: number
  /**
   * Secondary harmonic — adds organic irregularity. Should be
   * incommensurate with the primary wavelength. Mixed at ~30–45% weight
   * so the line never traces a clean sine.
   */
  wavelength2: number
  phase2: number
  weight2: number
  /** Time drift in Hz — slow, almost imperceptible. */
  drift: number
  stroke: string
  width: number
}

// Two strands, not three. A duet, not a braid. Hair and silk falling near
// each other along the spine — close enough to almost touch at moments,
// far enough that you never read them as a pair.
//
// Palette: champagne (warm gold) + ivory (cream-white). Both are warmer
// than the warmest pixel in the scene, so they read as light *on* the
// surface, never as a foreign mark.
const STRAND_CONFIGS: StrandConfig[] = [
  // Champagne — the leading thread; warm gold, slightly thicker presence.
  {
    amplitude: 38,
    ampSwing: 0.7,
    ampWavelength: 3400,
    ampPhase: 0.8,
    wavelength: 1900,
    phase: 0,
    wavelength2: 730,
    phase2: 1.3,
    weight2: 0.32,
    drift: 0.009,
    stroke: 'rgba(196,168,138,0.55)',
    width: 0.55,
  },
  // Ivory — the answering thread; cool-warm cream, hairline.
  {
    amplitude: 28,
    ampSwing: 0.55,
    ampWavelength: 4100,
    ampPhase: 3.4,
    wavelength: 2300,
    phase: 2.1,
    wavelength2: 880,
    phase2: 4.6,
    weight2: 0.38,
    drift: -0.0065,
    stroke: 'rgba(245,232,210,0.50)',
    width: 0.45,
  },
]
const STRAND_COUNT = STRAND_CONFIGS.length

// Vein strands — same DNA as the main strands but at a smaller scale,
// because the vein lives on a short border (~120–200px). Wavelengths are
// pulled in so we get visible curvature over that distance, amplitudes are
// tiny so the vein still reads as a piece of the surface border itself.
const VEIN_STRAND_CONFIGS: StrandConfig[] = [
  {
    amplitude: 5.5,
    ampSwing: 0.3,
    ampWavelength: 600,
    ampPhase: 0.4,
    wavelength: 320,
    phase: 0.2,
    wavelength2: 110,
    phase2: 1.7,
    weight2: 0.4,
    drift: 0.014,
    stroke: 'rgba(196,168,138,0.55)',
    width: 0.55,
  },
  {
    amplitude: 3.8,
    ampSwing: 0.25,
    ampWavelength: 720,
    ampPhase: 2.6,
    wavelength: 380,
    phase: 2.4,
    wavelength2: 140,
    phase2: 4.1,
    weight2: 0.45,
    drift: -0.011,
    stroke: 'rgba(245,232,210,0.50)',
    width: 0.45,
  },
]
const VEIN_STRAND_COUNT = VEIN_STRAND_CONFIGS.length

const SAMPLE_STEP_PX = 8
const SAMPLE_MIN = 32
const SAMPLE_MAX = 220
const VEIN_SAMPLE_STEP_PX = 3
const VEIN_SAMPLE_MIN = 28
const VEIN_SAMPLE_MAX = 90

function LightThread({ anchorsRef, version, segments }: RendererProps) {
  // One <g> per segment slot. Each slot has:
  //   - main spine: 1 hidden measure path + STRAND_COUNT visible strands
  //   - 2 endpoint veins: each with 1 measure path + VEIN_STRAND_COUNT strands
  // Allocated up to MAX_SEGMENTS slots; unused slots stay invisible.
  const MAX_SEGMENTS = 6
  const measureRefs = useRef<(SVGPathElement | null)[]>([])
  const strandRefs = useRef<(SVGPathElement | null)[][]>([])
  const veinMeasureRefs = useRef<(SVGPathElement | null)[][]>([])
  const veinStrandRefs = useRef<(SVGPathElement | null)[][][]>([])
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
    const lastVeinD: string[][] = Array.from(
      { length: MAX_SEGMENTS },
      () => ['', '']
    )

    // Pre-compute angular frequencies and drift rates per strand so the
    // inner loops only do adds + sin().
    const strandOmega = STRAND_CONFIGS.map(
      (c) => (2 * Math.PI) / c.wavelength
    )
    const strandOmega2 = STRAND_CONFIGS.map(
      (c) => (2 * Math.PI) / c.wavelength2
    )
    const strandAmpOmega = STRAND_CONFIGS.map(
      (c) => (2 * Math.PI) / c.ampWavelength
    )
    const strandDriftRate = STRAND_CONFIGS.map((c) => c.drift * Math.PI * 2)

    const veinOmega = VEIN_STRAND_CONFIGS.map(
      (c) => (2 * Math.PI) / c.wavelength
    )
    const veinOmega2 = VEIN_STRAND_CONFIGS.map(
      (c) => (2 * Math.PI) / c.wavelength2
    )
    const veinAmpOmega = VEIN_STRAND_CONFIGS.map(
      (c) => (2 * Math.PI) / c.ampWavelength
    )
    const veinDriftRate = VEIN_STRAND_CONFIGS.map(
      (c) => c.drift * Math.PI * 2
    )

    interface EndpointGeo {
      point: Point
      // Unit vector along the surface border at the connection point.
      axisX: number
      axisY: number
      // Length of the surface border along that axis (clamps the vein).
      borderLength: number
    }

    function interiorPoint(anchor: ThreadAnchor): Point | null {
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

    /**
     * Endpoint geometry: pick the surface edge that faces the neighbor.
     * Dominant axis (vertical vs horizontal) decides whether we attach to
     * top/bottom or left/right. Returns the midpoint of that edge plus the
     * unit vector running ALONG the edge — that's the vein's spine.
     */
    function endpointGeometry(
      anchor: ThreadAnchor,
      neighbor: ThreadAnchor
    ): EndpointGeo | null {
      const el = anchor.ref.current
      const nel = neighbor.ref.current
      if (!el || !nel) return null
      const r = el.getBoundingClientRect()
      if (r.width === 0 && r.height === 0) return null
      const nr = nel.getBoundingClientRect()

      const cx = (r.left + r.right) / 2
      const cy = (r.top + r.bottom) / 2
      const ncx = (nr.left + nr.right) / 2
      const ncy = (nr.top + nr.bottom) / 2
      const dx = ncx - cx
      const dy = ncy - cy

      if (Math.abs(dy) >= Math.abs(dx)) {
        return {
          point: { x: cx, y: dy > 0 ? r.bottom : r.top },
          axisX: 1,
          axisY: 0,
          borderLength: r.width,
        }
      }
      return {
        point: { x: dx > 0 ? r.right : r.left, y: cy },
        axisX: 0,
        axisY: 1,
        borderLength: r.height,
      }
    }

    const clearVein = (segIdx: number, endIdx: number) => {
      const measure = veinMeasureRefs.current[segIdx]?.[endIdx]
      const strandSet = veinStrandRefs.current[segIdx]?.[endIdx]
      if (lastVeinD[segIdx][endIdx] === '') return
      measure?.setAttribute('d', '')
      if (strandSet) {
        for (let s = 0; s < VEIN_STRAND_COUNT; s++) {
          strandSet[s]?.setAttribute('d', '')
        }
      }
      lastVeinD[segIdx][endIdx] = ''
    }

    const drawVein = (
      segIdx: number,
      endIdx: number,
      geo: EndpointGeo,
      elapsed: number
    ) => {
      const measure = veinMeasureRefs.current[segIdx]?.[endIdx]
      const strandSet = veinStrandRefs.current[segIdx]?.[endIdx]
      if (!measure || !strandSet) return

      // Vein length: a fraction of the surface border, capped so it never
      // takes over the whole edge. Centered on the connection point.
      const length = Math.min(180, Math.max(60, geo.borderLength * 0.36))
      const halfLen = length / 2
      const x1 = geo.point.x - geo.axisX * halfLen
      const y1 = geo.point.y - geo.axisY * halfLen
      const x2 = geo.point.x + geo.axisX * halfLen
      const y2 = geo.point.y + geo.axisY * halfLen
      const spineD =
        `M ${x1.toFixed(1)} ${y1.toFixed(1)} ` +
        `L ${x2.toFixed(1)} ${y2.toFixed(1)}`

      if (spineD !== lastVeinD[segIdx][endIdx]) {
        measure.setAttribute('d', spineD)
        lastVeinD[segIdx][endIdx] = spineD
      }

      const totalLen = measure.getTotalLength()
      if (!Number.isFinite(totalLen) || totalLen <= 0) return

      const sampleCount = Math.max(
        VEIN_SAMPLE_MIN,
        Math.min(VEIN_SAMPLE_MAX, Math.floor(totalLen / VEIN_SAMPLE_STEP_PX))
      )

      const strandParts: string[][] = []
      for (let s = 0; s < VEIN_STRAND_COUNT; s++) strandParts.push([])

      for (let i = 0; i < sampleCount; i++) {
        const t = i / (sampleCount - 1)
        const len = t * totalLen
        const p = measure.getPointAtLength(len)

        const step = 0.5
        const lookAhead = len + step <= totalLen ? len + step : len - step
        const pNext = measure.getPointAtLength(lookAhead)
        const tx = (pNext.x - p.x) * (lookAhead > len ? 1 : -1)
        const ty = (pNext.y - p.y) * (lookAhead > len ? 1 : -1)
        const tlen = Math.hypot(tx, ty) || 1
        const nx = -ty / tlen
        const ny = tx / tlen

        // TWO-HUMP envelope: zero at both ends AND at the center of the
        // vein. Center of the vein = the connection point, where the main
        // strand also arrives with zero offset. The two converge there and
        // visually become one line passing through the surface border.
        const envelope = Math.abs(Math.sin(2 * Math.PI * t))

        for (let s = 0; s < VEIN_STRAND_COUNT; s++) {
          const cfg = VEIN_STRAND_CONFIGS[s]
          const drift = elapsed * veinDriftRate[s]
          const ampMul =
            1 +
            cfg.ampSwing *
              0.5 *
              (1 +
                Math.sin(len * veinAmpOmega[s] + cfg.ampPhase + drift * 0.4))
          const localAmp = cfg.amplitude * envelope * ampMul

          const w1 = 1 - cfg.weight2
          const w2 = cfg.weight2
          const wave =
            w1 * Math.sin(len * veinOmega[s] + cfg.phase + drift) +
            w2 *
              Math.sin(len * veinOmega2[s] + cfg.phase2 + drift * 1.5)
          const offset = localAmp * wave

          const x = (p.x + nx * offset).toFixed(1)
          const y = (p.y + ny * offset).toFixed(1)
          strandParts[s].push(i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`)
        }
      }

      for (let s = 0; s < VEIN_STRAND_COUNT; s++) {
        strandSet[s]?.setAttribute('d', strandParts[s].join(' '))
      }
    }

    const drawSegment = (
      segIdx: number,
      points: Point[],
      firstGeo: EndpointGeo | null,
      lastGeo: EndpointGeo | null,
      elapsed: number
    ) => {
      const measure = measureRefs.current[segIdx]
      const strandSet = strandRefs.current[segIdx]
      if (!measure || !strandSet) return

      if (points.length < 2 || !firstGeo || !lastGeo) {
        // Empty / not enough anchors — clear everything in this slot.
        if (lastSpineD[segIdx] !== '') {
          for (let s = 0; s < STRAND_COUNT; s++)
            strandSet[s]?.setAttribute('d', '')
          measure.setAttribute('d', '')
          lastSpineD[segIdx] = ''
        }
        clearVein(segIdx, 0)
        clearVein(segIdx, 1)
        return
      }

      // Short, finite spine — begins/ends exactly at surface border points.
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

      const strandParts: string[][] = []
      for (let s = 0; s < STRAND_COUNT; s++) strandParts.push([])

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

        // Wider taper (~14% each end) — the strand dissolves into the
        // surface border slowly, like a hair losing the light.
        const TAPER = 0.14
        let envelope = 1
        if (t < TAPER) envelope = Math.sin((t / TAPER) * (Math.PI / 2))
        else if (t > 1 - TAPER)
          envelope = Math.sin(((1 - t) / TAPER) * (Math.PI / 2))

        for (let s = 0; s < STRAND_COUNT; s++) {
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

          const w1 = 1 - cfg.weight2
          const w2 = cfg.weight2
          const wave =
            w1 * Math.sin(len * strandOmega[s] + cfg.phase + drift) +
            w2 *
              Math.sin(
                len * strandOmega2[s] + cfg.phase2 + drift * 1.6
              )
          const offset = localAmp * wave

          const x = (p.x + nx * offset).toFixed(1)
          const y = (p.y + ny * offset).toFixed(1)
          strandParts[s].push(i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`)
        }
      }

      for (let s = 0; s < STRAND_COUNT; s++) {
        strandSet[s]?.setAttribute('d', strandParts[s].join(' '))
      }

      // Border veins at both endpoints.
      drawVein(segIdx, 0, firstGeo, elapsed)
      drawVein(segIdx, 1, lastGeo, elapsed)
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
          drawSegment(segIdx, [], null, null, elapsed)
          continue
        }

        // Resolve anchors in segment order.
        const anchorList: ThreadAnchor[] = []
        for (const order of orders) {
          const anchor = byOrder.get(order)
          if (anchor) anchorList.push(anchor)
        }
        if (anchorList.length < 2) {
          drawSegment(segIdx, [], null, null, elapsed)
          continue
        }

        // Endpoint geometry: edge facing the neighbor.
        const firstGeo = endpointGeometry(anchorList[0], anchorList[1])
        const lastGeo = endpointGeometry(
          anchorList[anchorList.length - 1],
          anchorList[anchorList.length - 2]
        )
        if (!firstGeo || !lastGeo) {
          drawSegment(segIdx, [], null, null, elapsed)
          continue
        }

        // Spine: first border point → interior centers → last border point.
        const points: Point[] = [firstGeo.point]
        for (let i = 1; i < anchorList.length - 1; i++) {
          const p = interiorPoint(anchorList[i])
          if (p) points.push(p)
        }
        points.push(lastGeo.point)

        drawSegment(segIdx, points, firstGeo, lastGeo, elapsed)
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
          {/* Main spine — hidden measurement source. */}
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
              key={`s-${s}`}
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

          {/* Border veins — one per endpoint. Each vein passes through the
              connection point with zero offset, so it joins the main strand
              cleanly there and reads as the surface border come alive. */}
          {[0, 1].map((endIdx) => (
            <g key={`v-${endIdx}`}>
              <path
                ref={(el) => {
                  if (!veinMeasureRefs.current[segIdx]) {
                    veinMeasureRefs.current[segIdx] = []
                  }
                  veinMeasureRefs.current[segIdx][endIdx] = el
                }}
                d=""
                fill="none"
                stroke="none"
              />
              {VEIN_STRAND_CONFIGS.map((cfg, s) => (
                <path
                  key={`vs-${s}`}
                  ref={(el) => {
                    if (!veinStrandRefs.current[segIdx]) {
                      veinStrandRefs.current[segIdx] = []
                    }
                    if (!veinStrandRefs.current[segIdx][endIdx]) {
                      veinStrandRefs.current[segIdx][endIdx] = []
                    }
                    veinStrandRefs.current[segIdx][endIdx][s] = el
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
        </g>
      ))}
    </svg>
  )
}

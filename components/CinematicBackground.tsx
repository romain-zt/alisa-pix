'use client'

import Image from 'next/image'
import { useEffect, useRef, useState, type CSSProperties } from 'react'

interface Props {
  src: string
  rangeVH?: number
}

interface CameraState {
  posX: number
  posY: number
  scale: number
}

interface Size {
  width: number
  height: number
}

interface SunColorState {
  core: [number, number, number]
  glow: [number, number, number]
  accent: [number, number, number]
  duskAlpha: number
}

interface SunLightingState {
  sunX: number
  sunY: number
  intensity: number
  lightAngleDeg: number
  shadowAngleDeg: number
  oppX: number
  oppY: number
  rayFromDeg: number
}

interface SceneState {
  camera: CameraState
  sun: SunLightingState
  sunColor: SunColorState
  vignette: number
  warmAlpha: number
  coolAlpha: number
  beamOpacity: number
  rayOpacity: number
  shadowWash: number
  shadowRadial: number
  timeOfDayDark: number
}

type SceneVars = Record<`--${string}`, string>

// Camera choreography:
//   1) Open zoomed-in on the figure: 1/3 from the left, 1/2 from the top —
//      intimate, mid-height framing on the focal subject.
//   2) Pan right across the middle band (eye-line altitude held).
//   3) Descent to the lower-right while easing the zoom out a touch.
//   4) Hold the bottom-right framing through the middle sections.
//   5) Slow dezoom to the full image, only during the final section
//      (SessionGate). The window starts at FIT_START and ends at 1.0.
const KEYFRAMES = [
  { t: 0.0, posX: 33, posY: 50, scale: 1.42 },
  { t: 0.18, posX: 55, posY: 48, scale: 1.44 },
  { t: 0.36, posX: 82, posY: 52, scale: 1.42 },
  { t: 0.54, posX: 90, posY: 70, scale: 1.4 },
  { t: 0.78, posX: 88, posY: 86, scale: 1.38 },
  { t: 1.0, posX: 50, posY: 50, scale: 1.0 },
] as const

// Window over which the camera dezooms to the full ("contain") view.
// Pushed late so the slow zoom-out only plays while SessionGate is on screen.
const FIT_START = .8
const FIT_END = 1

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value))
}

function smoothstep01(u: number): number {
  const t = clamp01(u)
  return t * t * (3 - 2 * t)
}

function lerp(from: number, to: number, u: number): number {
  return from + (to - from) * u
}

function pchipSlope(
  ym1: number,
  y0: number,
  yp1: number,
  hm1: number,
  hp1: number
): number {
  const dm1 = (y0 - ym1) / hm1
  const dp1 = (yp1 - y0) / hp1
  if (dm1 === 0 || dp1 === 0 || Math.sign(dm1) !== Math.sign(dp1)) return 0
  const w1 = 2 * hp1 + hm1
  const w2 = hp1 + 2 * hm1
  return (w1 + w2) / (w1 / dm1 + w2 / dp1)
}

function buildSlopes(values: number[], times: number[]): number[] {
  const n = values.length
  const slopes = new Array(n).fill(0)

  for (let i = 1; i < n - 1; i++) {
    slopes[i] = pchipSlope(
      values[i - 1],
      values[i],
      values[i + 1],
      times[i] - times[i - 1],
      times[i + 1] - times[i]
    )
  }

  return slopes
}

const TIMES = KEYFRAMES.map((keyframe) => keyframe.t)
const SLOPES_X = buildSlopes(KEYFRAMES.map((keyframe) => keyframe.posX), TIMES)
const SLOPES_Y = buildSlopes(KEYFRAMES.map((keyframe) => keyframe.posY), TIMES)
const SLOPES_S = buildSlopes(KEYFRAMES.map((keyframe) => keyframe.scale), TIMES)

function hermite(
  u: number,
  vi: number,
  vf: number,
  si: number,
  sf: number,
  dt: number
): number {
  const u2 = u * u
  const u3 = u2 * u
  const h00 = 2 * u3 - 3 * u2 + 1
  const h10 = u3 - 2 * u2 + u
  const h01 = -2 * u3 + 3 * u2
  const h11 = u3 - u2
  return h00 * vi + h10 * dt * si + h01 * vf + h11 * dt * sf
}

function getCameraState(t: number): CameraState {
  const tc = clamp01(t)
  let index = 0

  for (let i = 0; i < KEYFRAMES.length - 1; i++) {
    if (tc <= KEYFRAMES[i + 1].t) {
      index = i
      break
    }
  }

  const from = KEYFRAMES[index]
  const to = KEYFRAMES[index + 1]
  const dt = to.t - from.t
  const u = (tc - from.t) / dt

  return {
    posX: hermite(u, from.posX, to.posX, SLOPES_X[index], SLOPES_X[index + 1], dt),
    posY: hermite(u, from.posY, to.posY, SLOPES_Y[index], SLOPES_Y[index + 1], dt),
    scale: hermite(
      u,
      from.scale,
      to.scale,
      SLOPES_S[index],
      SLOPES_S[index + 1],
      dt
    ),
  }
}

function lerpColor(
  from: [number, number, number],
  to: [number, number, number],
  u: number
): [number, number, number] {
  return [
    Math.round(from[0] + (to[0] - from[0]) * u),
    Math.round(from[1] + (to[1] - from[1]) * u),
    Math.round(from[2] + (to[2] - from[2]) * u),
  ]
}

function getSunColor(t: number): SunColorState {
  const morning: [number, number, number] = [255, 162, 60]
  const midday: [number, number, number] = [255, 252, 210]
  const sunset: [number, number, number] = [220, 130, 80]
  const dusk: [number, number, number] = [168, 88, 165]

  if (t <= 0.5) {
    const u = smoothstep01(t * 2)
    return {
      core: lerpColor(morning, midday, u),
      glow: lerpColor([255, 195, 105], [255, 248, 195], u),
      accent: lerpColor([255, 182, 85], [255, 240, 170], u),
      duskAlpha: 0,
    }
  }

  const u = smoothstep01((t - 0.5) * 2)
  return {
    core: lerpColor(midday, sunset, u),
    glow: lerpColor([255, 248, 195], dusk, u),
    accent: lerpColor([255, 240, 170], dusk, u),
    duskAlpha: u * 0.38,
  }
}

function getSunLighting(t: number): SunLightingState {
  const tc = clamp01(t)
  const path = [
    { x: -0.14, y: 0.92 },
    { x: 0.06, y: 0.1 },
    { x: 0.92, y: 0.08 },
    { x: 1.14, y: 0.9 },
  ] as const

  const segmentCount = path.length - 1
  const progress = tc * segmentCount
  const index = Math.min(segmentCount - 1, Math.floor(progress))
  const u = smoothstep01(progress - index)
  const from = path[index]
  const to = path[index + 1]
  const sunX = from.x + (to.x - from.x) * u
  const sunY = from.y + (to.y - from.y) * u

  const centerX = 0.48
  const centerY = 0.46
  const lightAngleDeg = (Math.atan2(sunY - centerY, sunX - centerX) * 180) / Math.PI
  const shadowAngleDeg = lightAngleDeg + 180
  const heightBoost = 1 - sunY * 0.78
  const daylight = Math.sin(tc * Math.PI)
  const intensity = Math.max(
    0.34,
    Math.min(0.96, 0.32 + heightBoost * 0.42 + daylight * 0.18)
  )

  return {
    sunX: sunX * 100,
    sunY: sunY * 100,
    intensity,
    lightAngleDeg,
    shadowAngleDeg,
    oppX: (1 - sunX * 0.92) * 100,
    oppY: (1 - sunY * 0.88) * 100,
    rayFromDeg: (Math.atan2(centerY - sunY, centerX - sunX) * 180) / Math.PI,
  }
}

function buildSceneState(progress: number, reducedMotion: boolean): SceneState {
  const t = clamp01(progress)
  const camera = getCameraState(t)
  const sun = getSunLighting(t)
  const sunColor = getSunColor(t)
  const motionFactor = reducedMotion ? 0.55 : 1
  const warmAlpha = (0.24 + sun.intensity * 0.26) * motionFactor
  const coolAlpha = (0.06 + sun.intensity * 0.1) * motionFactor
  const rayOpacity = (0.16 + sun.intensity * 0.12) * (reducedMotion ? 0.45 : 1)
  const beamOpacity = (0.05 + sun.intensity * 0.08) * (reducedMotion ? 0.6 : 0.88)
  const shadowWash = (0.18 + sun.intensity * 0.18) * (reducedMotion ? 0.45 : 1)
  const shadowRadial = (0.3 + sun.intensity * 0.22) * (reducedMotion ? 0.5 : 1)
  const vignette = 0.22 + t * 0.08 + (1 - sun.intensity) * 0.05 * (reducedMotion ? 0 : 1)
  const timeOfDayDark =
    Math.pow(Math.cos(t * Math.PI * 2) * 0.5 + 0.5, 4.5) * (reducedMotion ? 0.28 : 0.42)

  return {
    camera,
    sun,
    sunColor,
    vignette,
    warmAlpha,
    coolAlpha,
    beamOpacity,
    rayOpacity,
    shadowWash,
    shadowRadial,
    timeOfDayDark,
  }
}

// ease-in-out-quint — slower at start and end than smoothstep, gives the final
// dezoom a relaxed, "settling" feeling instead of a mechanical pull-out.
function easeInOutQuint(u: number): number {
  const t = clamp01(u)
  return t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2
}

function getFrameVars(progress: number, camera: CameraState, viewport: Size, image: Size): SceneVars {
  const imageRatio = image.width / image.height
  const viewportRatio = viewport.width / viewport.height
  const fitWindow = Math.max(0.001, FIT_END - FIT_START)
  const fitMix = easeInOutQuint((clamp01(progress) - FIT_START) / fitWindow)

  let coverWidth = viewport.width
  let coverHeight = viewport.height
  let containWidth = viewport.width
  let containHeight = viewport.height

  if (viewportRatio > imageRatio) {
    coverHeight = viewport.width / imageRatio
    containWidth = viewport.height * imageRatio
  } else {
    coverWidth = viewport.height * imageRatio
    containHeight = viewport.width / imageRatio
  }

  const width = lerp(coverWidth, containWidth, fitMix)
  const height = lerp(coverHeight, containHeight, fitMix)
  const posX = lerp(camera.posX, 50, fitMix)
  const posY = lerp(camera.posY, 50, fitMix)

  return {
    '--frame-width': `${width}px`,
    '--frame-height': `${height}px`,
    '--frame-left': `${(viewport.width - width) * (posX / 100)}px`,
    '--frame-top': `${(viewport.height - height) * (posY / 100)}px`,
  }
}

function getSceneVars(scene: SceneState): SceneVars {
  const [cr, cg, cb] = scene.sunColor.core
  const [gr, gg, gb] = scene.sunColor.glow
  const [ar, ag, ab] = scene.sunColor.accent

  return {
    '--camera-x': `${scene.camera.posX}%`,
    '--camera-y': `${scene.camera.posY}%`,
    '--camera-scale': scene.camera.scale.toFixed(4),
    '--sun-x': `${scene.sun.sunX}%`,
    '--sun-y': `${scene.sun.sunY}%`,
    '--sun-x-plus-5': `${scene.sun.sunX + 5}%`,
    '--sun-y-minus-4': `${scene.sun.sunY - 4}%`,
    '--sun-x-plus-8': `${scene.sun.sunX + 8}%`,
    '--sun-y-plus-6': `${scene.sun.sunY + 6}%`,
    '--bounce-x': `${100 - scene.sun.sunX * 0.75}%`,
    '--bounce-y': `${100 - scene.sun.sunY * 0.7}%`,
    '--opp-x': `${scene.sun.oppX}%`,
    '--opp-y': `${scene.sun.oppY}%`,
    '--light-angle': `${scene.sun.lightAngleDeg}deg`,
    '--shadow-angle': `${scene.sun.shadowAngleDeg}deg`,
    '--ray-from': `${scene.sun.rayFromDeg}deg`,
    '--beam-rotate': `${scene.sun.lightAngleDeg * 0.12}deg`,
    '--beam-angle-plus': `${scene.sun.lightAngleDeg + 22}deg`,
    '--beam-angle-minus': `${scene.sun.lightAngleDeg - 18}deg`,
    '--sun-core-r': String(cr),
    '--sun-core-g': String(cg),
    '--sun-core-b': String(cb),
    '--sun-glow-r': String(gr),
    '--sun-glow-g': String(gg),
    '--sun-glow-b': String(gb),
    '--sun-accent-r': String(ar),
    '--sun-accent-g': String(ag),
    '--sun-accent-b': String(ab),
    '--sun-pool-w': `${48 + scene.sun.intensity * 14}%`,
    '--sun-pool-h': `${38 + scene.sun.intensity * 10}%`,
    '--warm-alpha': scene.warmAlpha.toFixed(4),
    '--warm-alpha-soft': (scene.warmAlpha * 0.48).toFixed(4),
    '--warm-alpha-bright': (scene.warmAlpha * 0.68).toFixed(4),
    '--cool-alpha': scene.coolAlpha.toFixed(4),
    '--ray-opacity': scene.rayOpacity.toFixed(4),
    '--beam-opacity': scene.beamOpacity.toFixed(4),
    '--shadow-wash': scene.shadowWash.toFixed(4),
    '--shadow-wash-soft': (scene.shadowWash * 0.5).toFixed(4),
    '--shadow-radial-a': (scene.shadowRadial * 0.38).toFixed(4),
    '--shadow-radial-b': (scene.shadowRadial * 0.62).toFixed(4),
    '--vignette': scene.vignette.toFixed(4),
    '--time-dark': scene.timeOfDayDark.toFixed(4),
    '--dusk-alpha': scene.sunColor.duskAlpha.toFixed(4),
    '--beam-main-a': (0.048 + scene.sun.intensity * 0.05).toFixed(4),
    '--beam-main-b': (0.022 + scene.sun.intensity * 0.03).toFixed(4),
    '--beam-streak-a': (0.05 + scene.sun.intensity * 0.05).toFixed(4),
    '--beam-streak-b': (0.026 + scene.sun.intensity * 0.03).toFixed(4),
    '--beam-side-a': (0.034 + scene.sun.intensity * 0.04).toFixed(4),
  }
}

function applySceneVars(element: HTMLElement | null, scene: SceneState) {
  if (!element) return
  const vars = getSceneVars(scene)
  for (const [name, value] of Object.entries(vars)) {
    element.style.setProperty(name, value)
  }
}

const INITIAL_STYLE = {
  ...getSceneVars(buildSceneState(0, false)),
  '--frame-width': '100vw',
  '--frame-height': '100svh',
  '--frame-left': '0px',
  '--frame-top': '0px',
} as CSSProperties

export function CinematicBackground({ src, rangeVH }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [imageSize, setImageSize] = useState<Size | null>(null)

  useEffect(() => {
    const id = requestAnimationFrame(() => setRevealed(true))
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReducedMotion(mediaQuery.matches)
    sync()
    mediaQuery.addEventListener('change', sync)
    return () => mediaQuery.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    let cancelled = false
    const image = new window.Image()

    const sync = () => {
      if (cancelled || image.naturalWidth === 0 || image.naturalHeight === 0) return
      setImageSize({ width: image.naturalWidth, height: image.naturalHeight })
    }

    image.addEventListener('load', sync)
    image.src = src
    if (image.complete) sync()

    return () => {
      cancelled = true
      image.removeEventListener('load', sync)
    }
  }, [src])

  useEffect(() => {
    const rootElement = rootRef.current
    if (!rootElement) return

    let range = 1
    let frameId = 0
    let ticking = false
    let lastProgress = -1

    function updateRange() {
      if (rangeVH != null) {
        range = Math.max(1, window.innerHeight * rangeVH)
        return
      }

      const doc = document.documentElement
      const docHeight = Math.max(
        doc.scrollHeight,
        doc.offsetHeight,
        document.body.scrollHeight,
        document.body.offsetHeight
      )

      range = Math.max(1, docHeight - window.innerHeight)
    }

    function getProgress() {
      return reducedMotion ? 0 : clamp01(window.scrollY / range)
    }

    function applyProgress(force = false) {
      if (!rootElement) return
      const progress = getProgress()
      if (!force && Math.abs(progress - lastProgress) < 0.0005) return
      lastProgress = progress
      const scene = buildSceneState(progress, reducedMotion)
      applySceneVars(rootElement, scene)

      const frameVars = imageSize
        ? getFrameVars(
            progress,
            scene.camera,
            { width: window.innerWidth, height: window.innerHeight },
            imageSize
          )
        : {
            '--frame-width': '100vw',
            '--frame-height': '100svh',
            '--frame-left': '0px',
            '--frame-top': '0px',
          }

      for (const [name, value] of Object.entries(frameVars)) {
        rootElement.style.setProperty(name, value)
      }
    }

    function schedule(force = false) {
      if (ticking && !force) return
      ticking = true
      frameId = requestAnimationFrame(() => {
        ticking = false
        applyProgress(force)
      })
    }

    function onResize() {
      updateRange()
      schedule(true)
    }

    function onScroll() {
      schedule()
    }

    updateRange()
    applyProgress(true)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [imageSize, rangeVH, reducedMotion])

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
      style={INITIAL_STYLE}
    >
      <div className="absolute inset-0 bg-bg-deep" />

      <div
        className="absolute inset-0"
        style={{
          opacity: revealed ? 1 : 0,
          transition: revealed
            ? 'opacity 3200ms cubic-bezier(0.87, 0, 0.13, 1), filter 3800ms cubic-bezier(0.87, 0, 0.13, 1)'
            : undefined,
          filter: revealed
            ? 'blur(0px) brightness(1) saturate(1)'
            : 'blur(22px) brightness(0.5) saturate(0.5)',
          willChange: 'opacity, filter',
        }}
      >
        <div
          className="absolute overflow-hidden"
          style={{
            width: 'var(--frame-width)',
            height: 'var(--frame-height)',
            left: 'var(--frame-left)',
            top: 'var(--frame-top)',
            transform: 'scale(var(--camera-scale))',
            transformOrigin: '50% 50%',
            willChange: 'transform, width, height, left, top',
          }}
        >
          <Image
            src={src}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{
              objectPosition: 'var(--camera-x) var(--camera-y)',
              willChange: 'object-position',
            }}
          />
        </div>
      </div>

      <div
        className="absolute inset-0 bg-bg-deep"
        style={{
          opacity: revealed ? 0 : 1,
          transition: 'opacity 2400ms cubic-bezier(0.87, 0, 0.13, 1)',
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          opacity: revealed ? 1 : 0,
          transition: 'opacity 3800ms cubic-bezier(0.87, 0, 0.13, 1)',
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            mixBlendMode: 'multiply',
            opacity: reducedMotion ? 0.48 : 0.58,
            background: `
              radial-gradient(ellipse 82% 74% at var(--opp-x) var(--opp-y), rgba(6,5,4,0) 0%, rgba(5,4,3,var(--shadow-radial-a)) 48%, rgba(3,2,2,var(--shadow-radial-b)) 100%),
              linear-gradient(var(--shadow-angle), rgba(8,6,5,var(--shadow-wash)) 0%, rgba(6,5,4,var(--shadow-wash-soft)) 26%, transparent 56%)
            `,
          }}
        />

        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(ellipse var(--sun-pool-w) var(--sun-pool-h) at var(--sun-x) var(--sun-y), rgba(var(--sun-core-r),var(--sun-core-g),var(--sun-core-b),var(--warm-alpha)) 0%, rgba(var(--sun-glow-r),var(--sun-glow-g),var(--sun-glow-b),var(--warm-alpha-soft)) 36%, transparent 64%),
                radial-gradient(ellipse 32% 28% at var(--sun-x-plus-5) var(--sun-y-minus-4), rgba(var(--sun-accent-r),var(--sun-accent-g),var(--sun-accent-b),var(--warm-alpha-bright)) 0%, transparent 58%)
              `,
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 52% 46% at var(--bounce-x) var(--bounce-y), rgba(196,168,138,var(--cool-alpha)) 0%, transparent 70%)',
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none mix-blend-screen"
            style={{
              opacity: 'var(--dusk-alpha)',
              background: `
                radial-gradient(ellipse 55% 42% at var(--sun-x) var(--sun-y), rgba(185,100,200,0.45) 0%, rgba(150,80,175,0.22) 42%, transparent 68%),
                radial-gradient(ellipse 38% 30% at var(--sun-x-plus-8) var(--sun-y-plus-6), rgba(210,140,90,0.28) 0%, transparent 55%)
              `,
            }}
          />
        </div>

        <div
          className="absolute inset-[-25%] pointer-events-none mix-blend-screen"
          style={{
            opacity: 'var(--ray-opacity)',
            background: `
              repeating-conic-gradient(
                from var(--ray-from) at var(--sun-x) var(--sun-y),
                transparent 0deg,
                transparent 6deg,
                rgba(var(--sun-accent-r),var(--sun-accent-g),var(--sun-accent-b),0.11) 7deg,
                rgba(var(--sun-core-r),var(--sun-core-g),var(--sun-core-b),0.17) 8deg,
                rgba(var(--sun-accent-r),var(--sun-accent-g),var(--sun-accent-b),0.09) 9deg,
                transparent 10.6deg,
                transparent 20deg
              )
            `,
          }}
        />

        <div
          className="absolute inset-[-18%] pointer-events-none mix-blend-screen"
          style={{
            opacity: 'var(--beam-opacity)',
            transform: reducedMotion ? undefined : 'rotate(var(--beam-rotate))',
            transformOrigin: 'var(--sun-x) var(--sun-y)',
            willChange: 'transform, opacity',
            background: `
              linear-gradient(var(--light-angle), rgba(var(--sun-core-r),var(--sun-core-g),var(--sun-core-b),var(--beam-main-a)) 0%, transparent 34%, transparent 54%, rgba(var(--sun-glow-r),var(--sun-glow-g),var(--sun-glow-b),var(--beam-main-b)) 74%, transparent 100%),
              linear-gradient(var(--beam-angle-plus), transparent 38%, rgba(var(--sun-accent-r),var(--sun-accent-g),var(--sun-accent-b),var(--beam-streak-a)) 49%, rgba(var(--sun-core-r),var(--sun-core-g),var(--sun-core-b),var(--beam-streak-b)) 51%, transparent 63%),
              linear-gradient(var(--beam-angle-minus), transparent 42%, rgba(var(--sun-glow-r),var(--sun-glow-g),var(--sun-glow-b),var(--beam-side-a)) 50%, transparent 61%)
            `,
          }}
        />
      </div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'rgba(6,4,3,1)',
          opacity: 'var(--time-dark)',
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 90% 85% at 50% 50%, transparent 45%, rgba(8,7,6,var(--vignette)) 100%)',
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(10,9,8,0.28) 0%, transparent 18%, transparent 72%, rgba(10,9,8,0.45) 100%)',
        }}
      />
    </div>
  )
}

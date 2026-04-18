'use client'

import Image from 'next/image'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

type OrbitGalleryProps = {
  images: string[]
}

type FocusVisual = { incoming: number; outgoing: number | null }

/**
 * Geometry — INSIDE-CYLINDER view.
 * The camera sits AT the cylinder's axis. Photos line the inner surface
 * around us, facing inward. We don't look AT a wheel of pictures; we
 * stand in the middle of one.
 *
 *   cylinder transform: translateZ(perspective) rotateY(-A)
 *     → moves the cylinder origin to the camera position
 *   item transform   : rotateY(i*step) translateZ(-R) scale(s)
 *     → each item sits R units out from the camera, naturally facing inward
 *
 *   Active item world z = perspective - R   (close, in front of camera)
 *   Items past ±90°    have z >= perspective (behind the camera)  → culled
 */
const RADIUS_DESKTOP = 580
const RADIUS_MOBILE = 320
const PERSPECTIVE_DESKTOP = 1650
const PERSPECTIVE_MOBILE = 900
// Scale falloff so neighbours clearly subordinate to the center.
const SCALE_FALLOFF_DEG = 42
// Camera tilt — perspective-origin Y. <50% reads as looking down the wall;
// ~50% keeps the cylinder mass closer to optical vertical center.
const PERSPECTIVE_ORIGIN_Y = 50
// Beyond this effective angle, items are behind the viewer (or very close
// to camera depth). Hide them to avoid CSS perspective math going negative.
const VISIBILITY_CULL_DEG = 84

// Drift when idle — degrees per ms. ~ one image every 12s on desktop.
const IDLE_DRIFT_DEG_PER_MS = 30 / 12000
// Wheel & drag sensitivity (degrees per pixel of input).
const WHEEL_SENSITIVITY = 0.32
const DRAG_SENSITIVITY = 0.42
// Lerp factor — 0.08 is silky, 0.18 responsive.
const LERP = 0.09
// How long after last interaction before idle drift resumes (ms).
const IDLE_DELAY = 4200
// Below this much pointer movement, treat as a tap, not a drag.
const TAP_THRESHOLD_PX = 6

export function OrbitGallery({ images }: OrbitGalleryProps) {
  const N = images.length
  const angleStep = 360 / Math.max(N, 1)

  const stageRef = useRef<HTMLDivElement>(null)
  const cylinderRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<HTMLDivElement[]>([])
  const bgRefs = useRef<HTMLDivElement[]>([])
  const reflectionRefs = useRef<HTMLDivElement[]>([])
  const stageRingRef = useRef<HTMLDivElement>(null)

  // Angle state lives in refs so rAF can read/write without re-render.
  const targetAngleRef = useRef(0)
  const currentAngleRef = useRef(0)
  const lastFrameRef = useRef<number>(0)
  const lastInteractionRef = useRef<number>(0)
  const reducedMotionRef = useRef(false)

  // Geometry state — re-measured on resize.
  const radiusRef = useRef(RADIUS_DESKTOP)
  const perspectiveRef = useRef(PERSPECTIVE_DESKTOP)

  const [activeIdx, setActiveIdx] = useState(0)
  const activeIdxRef = useRef(0)
  const [entered, setEntered] = useState(false)

  // Focus mode — null means orbit mode, otherwise the focused image index.
  const [focused, setFocused] = useState<number | null>(null)
  const focusedRef = useRef<number | null>(null)
  useEffect(() => {
    focusedRef.current = focused
  }, [focused])

  // Stacked focus visuals — outgoing stays under while incoming animates over.
  const [focusVisual, setFocusVisual] = useState<FocusVisual | null>(null)
  const FOCUS_SWAP_CLEAR_MS = 1500

  useLayoutEffect(() => {
    if (focused === null) {
      setFocusVisual(null)
      return
    }
    setFocusVisual((v) => {
      if (!v) return { incoming: focused, outgoing: null }
      if (v.incoming === focused) return v
      return { incoming: focused, outgoing: v.incoming }
    })
  }, [focused])

  useEffect(() => {
    if (!focusVisual || focusVisual.outgoing === null) return
    const t = window.setTimeout(() => {
      setFocusVisual((v) =>
        v && v.outgoing !== null
          ? { incoming: v.incoming, outgoing: null }
          : v
      )
    }, FOCUS_SWAP_CLEAR_MS)
    return () => window.clearTimeout(t)
  }, [focusVisual?.incoming, focusVisual?.outgoing])

  // ── Helpers: rotation math ──────────────────────────────────────────
  // Rotate the cylinder so image `i` ends up at the front, taking the
  // shortest arc (so it never spins the long way around).
  const rotateTo = useCallback(
    (i: number) => {
      const cur = targetAngleRef.current
      // target = i * angleStep (mod 360), but we want absolute degrees
      // close to `cur` so the lerp animation is short.
      const wraps = Math.round((cur - i * angleStep) / 360)
      targetAngleRef.current = i * angleStep + wraps * 360
    },
    [angleStep]
  )

  const openFocus = useCallback(
    (i: number) => {
      rotateTo(i)
      setFocused(i)
      lastInteractionRef.current = performance.now()
    },
    [rotateTo]
  )

  const closeFocus = useCallback(() => {
    setFocused(null)
    lastInteractionRef.current = performance.now()
  }, [])

  // Step focus to next/prev — also rotates the cylinder underneath.
  const stepFocus = useCallback(
    (delta: number) => {
      const cur = focusedRef.current ?? activeIdxRef.current
      const next = (((cur + delta) % N) + N) % N
      openFocus(next)
    },
    [N, openFocus]
  )

  // ── Layout: place each item on the cylinder + set perspective ───────
  const layoutCylinder = useCallback(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches
    radiusRef.current = isMobile ? RADIUS_MOBILE : RADIUS_DESKTOP
    perspectiveRef.current = isMobile ? PERSPECTIVE_MOBILE : PERSPECTIVE_DESKTOP

    // Perspective lives on the camera (the direct parent of the
    // 3D-transforming cylinder) so depth resolves correctly.
    // Origin is shifted up so the camera looks slightly DOWN onto the
    // cylinder — the curvature becomes immediately legible.
    const cyl = cylinderRef.current
    const camera = cyl?.parentElement
    if (camera) {
      camera.style.perspective = `${perspectiveRef.current}px`
      camera.style.perspectiveOrigin = `50% ${PERSPECTIVE_ORIGIN_Y}%`
    }

    itemsRef.current.forEach((el, i) => {
      if (!el) return
      const a = i * angleStep
      // Initial transform — rAF takes over with dynamic scale every frame.
      // translateZ(-R) places the item INSIDE the cylinder, R units out
      // from the (camera-centered) cylinder axis.
      el.style.transform = `rotateY(${a}deg) translateZ(${-radiusRef.current}px)`
    })
  }, [angleStep])

  // ── rAF loop: lerp angle, update cylinder + per-item visuals ────────
  useEffect(() => {
    reducedMotionRef.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    layoutCylinder()
    const onResize = () => layoutCylinder()
    window.addEventListener('resize', onResize)

    let rafId = 0
    let prevActive = -1

    const tick = (now: number) => {
      const dt = lastFrameRef.current ? now - lastFrameRef.current : 16
      lastFrameRef.current = now

      // Idle drift — only if the user has been quiet AND not focused.
      const idleFor = now - lastInteractionRef.current
      if (
        focusedRef.current === null &&
        !reducedMotionRef.current &&
        lastInteractionRef.current > 0 &&
        idleFor > IDLE_DELAY
      ) {
        targetAngleRef.current += IDLE_DRIFT_DEG_PER_MS * dt
      }

      // Lerp current toward target. Track angular velocity for motion blur.
      const prevCurrent = currentAngleRef.current
      const diff = targetAngleRef.current - currentAngleRef.current
      currentAngleRef.current += diff * (reducedMotionRef.current ? 1 : LERP)
      const angularVel = Math.abs(currentAngleRef.current - prevCurrent) // deg per frame

      const cyl = cylinderRef.current
      if (cyl) {
        // Push the cylinder origin OUT to the camera depth so the camera
        // sits at the cylinder's axis — looking outward from inside.
        cyl.style.transform = `translateZ(${perspectiveRef.current}px) rotateY(${-currentAngleRef.current}deg)`
      }

      // Floor stage ring counter-rotates very subtly so it feels grounded
      // (small parallax against the cylinder, like seeing the marble below).
      const ring = stageRingRef.current
      if (ring) {
        ring.style.transform = `translate(-50%, 0) rotate(${(currentAngleRef.current * 0.15).toFixed(2)}deg)`
      }

      // Per-item visuals based on effective angle from the front.
      let bestI = 0
      let bestAbs = Infinity
      const isFocused = focusedRef.current !== null

      const R = radiusRef.current
      for (let i = 0; i < itemsRef.current.length; i++) {
        const el = itemsRef.current[i]
        if (!el) continue
        let eff = i * angleStep - currentAngleRef.current
        eff = ((eff + 180) % 360 + 360) % 360 - 180
        const abs = Math.abs(eff)

        // Visibility / depth-of-field falloff (steeper now — narrower FOV).
        const opacity = Math.max(0, 1 - Math.pow(abs / 80, 1.7))
        const blur = Math.min(8, Math.pow(abs / 24, 1.4))
        const tint = Math.min(0.6, abs / 90)

        // Scale falloff — center dominates the field of view.
        // exp(-abs/50)  →  0°: 1.00 · 22.5°: 0.64 · 45°: 0.41 · 67°: 0.26
        const scale = Math.max(0.16, Math.exp(-abs / SCALE_FALLOFF_DEG))

        // Inside view: items live at translateZ(-R) on the inner surface.
        // No extra zPush — all items are already equidistant from camera.
        el.style.transform = `rotateY(${(i * angleStep).toFixed(3)}deg) translateZ(${(-R).toFixed(1)}px) scale(${scale.toFixed(3)})`

        // Velocity-driven motion blur — faster spin smears off-axis frames.
        const velBlur = Math.min(5, angularVel * 0.6 * (abs / 25))

        // In focus mode, sink the orbit further into the background.
        if (isFocused) {
          el.style.opacity = (opacity * 0.14).toFixed(3)
          el.style.filter = `blur(${(blur + 11).toFixed(2)}px) brightness(${(0.35 - tint * 0.15).toFixed(2)})`
        } else {
          el.style.opacity = opacity.toFixed(3)
          el.style.filter = `blur(${(blur + velBlur).toFixed(2)}px) brightness(${(1 - tint * 0.5).toFixed(2)})`
        }
        // Past the FOV the item sits at/behind the camera depth — hide it.
        el.style.visibility = abs > VISIBILITY_CULL_DEG ? 'hidden' : 'visible'

        if (abs < bestAbs) {
          bestAbs = abs
          bestI = i
        }
      }

      // Reflection: only the active image is reflected, the rest fade.
      // (Mostly hidden behind the now-larger active photo, but still visible
      // on tall viewports where the photo doesn't bleed to the floor.)
      for (let i = 0; i < reflectionRefs.current.length; i++) {
        const r = reflectionRefs.current[i]
        if (!r) continue
        r.style.opacity = i === bestI ? (isFocused ? '0' : '1') : '0'
      }

      // Crossfade backgrounds — only the active gas layer is opaque.
      for (let i = 0; i < bgRefs.current.length; i++) {
        const b = bgRefs.current[i]
        if (!b) continue
        b.style.opacity = i === bestI ? '1' : '0'
      }

      if (bestI !== prevActive) {
        prevActive = bestI
        activeIdxRef.current = bestI
        setActiveIdx(bestI)
      }

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)

    // Entrance — soft fade + cylinder swings in from -45° to 0°.
    if (!reducedMotionRef.current) {
      currentAngleRef.current = -45
      targetAngleRef.current = 0
    }
    const enterTimer = window.setTimeout(() => setEntered(true), 80)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', onResize)
      window.clearTimeout(enterTimer)
    }
  }, [layoutCylinder])

  // ── Interactions ────────────────────────────────────────────────────
  const noteInteraction = () => {
    lastInteractionRef.current = performance.now()
  }

  // Wheel: rotate the cylinder; preventDefault so the page doesn't scroll.
  // Disabled while focused (we keep the photo stable).
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const onWheel = (e: WheelEvent) => {
      if (focusedRef.current !== null) return
      e.preventDefault()
      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX
      targetAngleRef.current += delta * WHEEL_SENSITIVITY
      noteInteraction()
    }
    stage.addEventListener('wheel', onWheel, { passive: false })
    return () => stage.removeEventListener('wheel', onWheel)
  }, [])

  // Pointer drag (mouse + touch). Doubles as tap detection on release.
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    let dragging = false
    let startX = 0
    let startY = 0
    let startAngle = 0
    let pointerId: number | null = null
    let downTarget: HTMLElement | null = null

    const onDown = (e: PointerEvent) => {
      if (e.button !== undefined && e.button !== 0) return
      // In focus mode, pointer is just for tap-to-close — don't start a drag.
      dragging = focusedRef.current === null
      startX = e.clientX
      startY = e.clientY
      startAngle = targetAngleRef.current
      pointerId = e.pointerId
      downTarget = e.target as HTMLElement
      if (dragging) {
        try {
          stage.setPointerCapture(e.pointerId)
        } catch {}
        stage.classList.add('orbit-dragging')
      }
      noteInteraction()
    }
    const onMove = (e: PointerEvent) => {
      if (!dragging) return
      const dx = e.clientX - startX
      targetAngleRef.current = startAngle - dx * DRAG_SENSITIVITY
      noteInteraction()
    }
    const onUp = (e: PointerEvent) => {
      const dx = e.clientX - startX
      const dy = e.clientY - startY
      const moved = Math.hypot(dx, dy)
      if (dragging && pointerId !== null) {
        try {
          stage.releasePointerCapture(pointerId)
        } catch {}
      }
      dragging = false
      stage.classList.remove('orbit-dragging')
      noteInteraction()

      if (moved >= TAP_THRESHOLD_PX) return // it was a drag, not a tap
      handleTap(downTarget)
    }

    function handleTap(target: HTMLElement | null) {
      // Respect interactive elements (brand link, future buttons).
      if (target?.closest('a, button')) return

      const item = target?.closest('.orbit-item') as HTMLDivElement | null
      const onFocusImage = !!target?.closest('.orbit-focus-image')
      const onFocusBackdrop = !!target?.closest('.orbit-focus-backdrop')

      if (focusedRef.current !== null) {
        // In focus: any tap closes (image, backdrop, or stage).
        if (onFocusImage || onFocusBackdrop || !item) {
          closeFocus()
          return
        }
        // Tapped a faint orbit item behind focus → switch to that one.
        const idx = itemsRef.current.indexOf(item)
        if (idx >= 0) openFocus(idx)
        return
      }

      // Orbit mode.
      if (item) {
        const idx = itemsRef.current.indexOf(item)
        if (idx < 0) return
        if (idx === activeIdxRef.current) {
          openFocus(idx)
        } else {
          rotateTo(idx)
        }
      }
    }

    stage.addEventListener('pointerdown', onDown)
    stage.addEventListener('pointermove', onMove)
    stage.addEventListener('pointerup', onUp)
    stage.addEventListener('pointercancel', onUp)
    return () => {
      stage.removeEventListener('pointerdown', onDown)
      stage.removeEventListener('pointermove', onMove)
      stage.removeEventListener('pointerup', onUp)
      stage.removeEventListener('pointercancel', onUp)
    }
  }, [closeFocus, openFocus, rotateTo])

  // Keyboard.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (focusedRef.current !== null) {
          e.preventDefault()
          closeFocus()
        }
        return
      }
      if (['ArrowRight', 'ArrowDown', 'PageDown'].includes(e.key)) {
        e.preventDefault()
        if (focusedRef.current !== null) stepFocus(1)
        else {
          targetAngleRef.current += angleStep
          noteInteraction()
        }
      } else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) {
        e.preventDefault()
        if (focusedRef.current !== null) stepFocus(-1)
        else {
          targetAngleRef.current -= angleStep
          noteInteraction()
        }
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        if (focusedRef.current !== null) {
          closeFocus()
        } else {
          openFocus(activeIdxRef.current)
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [angleStep, closeFocus, openFocus, stepFocus])

  // ── Render ──────────────────────────────────────────────────────────
  return (
    <div
      ref={stageRef}
      className={`orbit-stage ${entered ? 'orbit-entered' : ''} ${focused !== null ? 'orbit-focus-mode' : ''}`}
      role="region"
      aria-roledescription="3D photo gallery"
      aria-label="Vasilisa — boudoir photography"
      tabIndex={0}
    >
      {/* GAS — atmospheric blurred backgrounds, one per image, crossfading */}
      <div className="orbit-bg-stack" aria-hidden="true">
        {images.map((src, i) => (
          <div
            key={`bg-${i}`}
            ref={(el) => {
              if (el) bgRefs.current[i] = el
            }}
            className="orbit-bg"
            style={{ opacity: i === 0 ? 1 : 0 }}
          >
            <Image
              src={src}
              alt=""
              fill
              priority={i < 2}
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ))}
        <div className="orbit-bg-veil" />
      </div>

      {/* LIQUID — drifting warm light */}
      <div className="orbit-light orbit-light-a" aria-hidden="true" />
      <div className="orbit-light orbit-light-b" aria-hidden="true" />
      <div className="orbit-shimmer shimmer-slow" aria-hidden="true" />

      {/* SOLID — the 3D cylinder of images */}
      <div className="orbit-camera">
        <div ref={cylinderRef} className="orbit-cylinder">
          {images.map((src, i) => (
            <div
              key={`item-${i}`}
              ref={(el) => {
                if (el) itemsRef.current[i] = el
              }}
              className="orbit-item"
            >
              <div className="orbit-frame">
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 50vw, 80vw"
                  priority={i < 4}
                  className="object-cover"
                />
                <div className="orbit-frame-veil" aria-hidden="true" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FLOOR — elliptical "stage" the cylinder rests on, plus reflections.
          Sits BELOW the cylinder so you see the photos sit on a surface. */}
      <div className="orbit-floor" aria-hidden="true">
        <div className="orbit-floor-glow" />
        <div ref={stageRingRef} className="orbit-floor-ring" />
        <div className="orbit-floor-reflections">
          {images.map((src, i) => (
            <div
              key={`refl-${i}`}
              ref={(el) => {
                if (el) reflectionRefs.current[i] = el
              }}
              className="orbit-floor-reflection"
              style={{ opacity: i === 0 ? 1 : 0 }}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* INTERFERENCE — vignette */}
      <div className="orbit-vignette" aria-hidden="true" />

      {/* FOCUS — single image, full bleed, with object-contain */}
      {focused !== null && (
        <div className="orbit-focus-backdrop" aria-hidden="true" />
      )}
      <div
        className={`orbit-focus-layer ${focused !== null ? 'is-open' : ''}`}
        aria-hidden={focused === null}
      >
        {focused !== null && focusVisual && (
          <div className="orbit-focus-stack">
            {focusVisual.outgoing !== null && (
              <div
                key={`focus-out-${focusVisual.outgoing}`}
                className="orbit-focus-image orbit-focus-image--outgoing"
                aria-hidden="true"
              >
                <Image
                  src={images[focusVisual.outgoing]}
                  alt=""
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
              </div>
            )}
            <div
              key={`focus-in-${focusVisual.incoming}`}
              className={`orbit-focus-image orbit-focus-image--incoming ${
                focusVisual.outgoing === null
                  ? 'orbit-focus-image--open'
                  : 'orbit-focus-image--swap-in'
              }`}
            >
              <Image
                src={images[focusVisual.incoming]}
                alt=""
                fill
                priority
                sizes="100vw"
                className="object-contain"
              />
            </div>
          </div>
        )}
      </div>

      {/* UI */}
      <a href="/" className="orbit-brand" aria-label="Vasilisa — home">
        Vasilisa
      </a>

      <div className="orbit-counter" aria-live="polite">
        <span className="orbit-counter-num">
          {String((focused ?? activeIdx) + 1).padStart(2, '0')}
        </span>
        <span className="orbit-counter-sep">·</span>
        <span className="orbit-counter-tot">
          {String(N).padStart(2, '0')}
        </span>
      </div>

      <div className="orbit-hint" aria-hidden="true">
        {focused === null ? (
          <>
            <span>tap to focus</span>
            <span className="orbit-dot" />
            <span>drag</span>
            <span className="orbit-dot" />
            <span>← →</span>
          </>
        ) : (
          <>
            <span>← →</span>
            <span className="orbit-dot" />
            <span>esc to close</span>
          </>
        )}
      </div>
    </div>
  )
}

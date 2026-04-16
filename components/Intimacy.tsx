'use client'

import { useCallback } from 'react'
import Image from 'next/image'
import { useSectionProgress, useSectionStyle } from '@/hooks/useSectionProgress'

export function Intimacy({ src }: { src: string }) {
  const { ref: sectionRef, progress } = useSectionProgress<HTMLElement>()

  const imageStyler = useCallback((p: number) => {
    const scale = 0.96 + Math.pow(p, 0.8) * 0.12
    const x = 5 - p * 10
    return { transform: `translate3d(${x}px, 0, 0) scale(${scale})` }
  }, [])
  const imageRef = useSectionStyle<HTMLDivElement>(imageStyler)

  const bgStyler = useCallback((p: number) => {
    const y = 25 - p * 50
    const x = -12 + p * 24
    const opacity = p < 0.12 ? p / 0.12 * 0.15 : p > 0.82 ? (1 - p) / 0.18 * 0.15 : 0.15
    return {
      transform: `translate3d(${x}px, ${y}px, 0) scale(1.3)`,
      opacity: `${opacity}`,
    }
  }, [])
  const bgRef = useSectionStyle<HTMLDivElement>(bgStyler)

  const textStyler = useCallback((p: number) => {
    const x = 25 - Math.pow(p, 0.6) * 35
    const y = 12 - p * 24
    const opacity = p < 0.35 ? Math.pow(p / 0.35, 2.5) : p > 0.88 ? (1 - p) / 0.12 : 1
    return {
      transform: `translate3d(${x}px, ${y}px, 0)`,
      opacity: `${Math.min(1, opacity)}`,
    }
  }, [])
  const textRef = useSectionStyle<HTMLDivElement>(textStyler)

  const maskRadius = progress < 0.05
    ? 25
    : 25 + Math.pow(Math.min(1, (progress - 0.05) / 0.5), 0.5) * 50

  const breatheOpacity = progress > 0.03 && progress < 0.35
    ? Math.min(0.55, Math.pow((progress - 0.03) / 0.32, 0.4) * 0.55)
    : progress >= 0.35 && progress < 0.6
      ? 0.55 * Math.pow(1 - (progress - 0.35) / 0.25, 1.5)
      : 0

  const againOpacity = progress > 0.78
    ? Math.min(0.25, Math.pow((progress - 0.78) / 0.22, 2) * 0.25)
    : 0

  const lightX = 25 + progress * 25
  const lightY = 20 + progress * 20
  const lightIntensity = progress > 0.1 && progress < 0.8
    ? Math.min(0.06, Math.sin((progress - 0.1) / 0.7 * Math.PI) * 0.06)
    : 0

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[145vh] md:min-h-[175vh] overflow-hidden"
      style={{ marginTop: 'clamp(-4rem, -6vh, -8rem)' }}
    >
      {/* Warm radial atmosphere — asymmetric */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 30% 30%, #110e0b 0%, #0d0907 45%, #0a0908 100%)',
        }}
      />

      {/* Background depth layer */}
      <div
        ref={bgRef}
        className="absolute inset-[-30%] z-[1]"
      >
        <Image
          src={src}
          alt=""
          fill
          className="object-cover blur-[12px]"
          sizes="160vw"
        />
      </div>

      {/* Breathing warm light — moves diagonally, pulses */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 35% 40% at ${lightX}% ${lightY}%, rgba(255,240,215,${lightIntensity}) 0%, transparent 55%)`,
        }}
      />

      {/* Puncture "breathe" — arrives first, power-curved entry */}
      <span
        className="absolute z-30
          top-[5vh] left-8
          md:top-[7vh] md:left-[10vw]
          font-serif italic text-[var(--text-display)] text-text-muted/20 select-none pointer-events-none"
        style={{
          opacity: breatheOpacity,
          transform: `translate3d(${progress * -22}px, ${progress * 10}px, 0) rotate(${-0.5 + progress * 0.8}deg)`,
        }}
      >
        breathe
      </span>

      {/* Image — expanding mask reveal + zoom */}
      <div className="relative z-10 pt-[15vh] md:pt-[19vh]">
        <div
          ref={imageRef}
          className="
            w-[88vw] mx-auto
            md:w-[44vw] md:ml-[7vw] md:mr-0
          "
        >
          <div
            className="relative aspect-[4/5] overflow-hidden"
            style={{
              clipPath: `ellipse(${maskRadius}% ${maskRadius * 1.1}% at 50% 48%)`,
              transition: 'clip-path 80ms linear',
            }}
          >
            <Image
              src={src}
              alt=""
              fill
              className="object-cover"
              sizes="(min-width: 768px) 44vw, 88vw"
            />
          </div>
        </div>
      </div>

      {/* Whisper text — delayed, drifts from right */}
      <div
        ref={textRef}
        className="relative z-10 mt-16 md:mt-20 px-6
          md:ml-[55vw] md:text-left text-center"
      >
        <p className="font-serif italic text-[var(--text-lead)] text-text-muted/25 select-none">
          yours
        </p>
      </div>

      {/* Puncture "again" — power-curved late entry */}
      <span
        className="absolute z-20
          bottom-[4vh] right-8
          md:bottom-[7vh] md:right-[12vw]
          text-[var(--text-micro)] tracking-[0.5em] uppercase text-text-muted/10 select-none pointer-events-none"
        style={{
          opacity: againOpacity,
          transform: `translate3d(${(1 - progress) * 12}px, 0, 0)`,
        }}
      >
        again
      </span>

      {/* Diagonal accent line — independent timing */}
      <div
        className="hidden md:block absolute z-20 right-[18vw] bottom-[20vh] w-20 h-px bg-accent-soft pointer-events-none"
        style={{
          opacity: progress > 0.55 && progress < 0.88
            ? Math.min(0.18, Math.pow((progress - 0.55) / 0.33, 2) * 0.18)
            : 0,
          transform: `rotate(15deg) scaleX(${Math.pow(Math.min(1, progress * 1.2), 0.6)})`,
          transformOrigin: 'right center',
        }}
      />
    </section>
  )
}

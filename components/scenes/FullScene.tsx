'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import ProtectedImage from '@/components/ProtectedImage'

interface FullSceneProps {
  src: string
  text?: string
  duration?: string
  textPosition?: 'left' | 'right' | 'center'
  focus?: string
  isHero?: boolean
}

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

function FullSceneHero({ src, text }: Pick<FullSceneProps, 'src' | 'text'>) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section ref={ref} className="relative h-[160vh]">
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={{ scale: imgScale }}
        >
          <ProtectedImage src={src} alt="" className="w-full h-full" priority />
          <div className="absolute inset-0 bg-black/35" />
        </motion.div>

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,0.6) 100%)',
          }}
        />

        <motion.div
          className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center"
          style={{ opacity: contentOpacity }}
        >
          {text && (
            <motion.h1
              className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-light italic tracking-wide text-off-white/90 max-w-4xl leading-relaxed"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2.4, delay: 0.6, ease: EASE }}
            >
              {text}
            </motion.h1>
          )}
        </motion.div>

        <motion.div
          className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 2, delay: 3 }}
        >
          <div className="w-px h-12 bg-off-white/15 mx-auto animate-pulse" />
        </motion.div>
      </div>
    </section>
  )
}

function FullSceneInner({
  src,
  text,
  duration = '140vh',
  textPosition = 'center',
}: FullSceneProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const imgOpacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    [0, 1, 1, 0]
  )
  const imgY = useTransform(scrollYProgress, [0, 1], [30, -30])

  const textOpacity = useTransform(
    scrollYProgress,
    [0.25, 0.38, 0.62, 0.75],
    [0, 1, 1, 0]
  )
  const textY = useTransform(scrollYProgress, [0.25, 0.38, 0.62, 0.75], [30, 0, 0, -20])

  const justifyMap = { left: 'justify-start', right: 'justify-end', center: 'justify-center' }
  const alignMap = { left: 'text-left', right: 'text-right', center: 'text-center' }

  return (
    <section ref={ref} style={{ height: duration }} className="relative">
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={{ opacity: imgOpacity, y: imgY }}
        >
          <ProtectedImage src={src} alt="" className="w-full h-full" />
          <div className="absolute inset-0 bg-black/30 pointer-events-none" />
        </motion.div>

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.6) 100%)',
          }}
        />

        {text && (
          <motion.div
            className={`absolute inset-0 z-10 flex items-center px-6 md:px-16 lg:px-24 ${justifyMap[textPosition!]}`}
            style={{ opacity: textOpacity, y: textY }}
          >
            <p
              className={`font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light italic leading-relaxed tracking-wide text-off-white/90 max-w-xl ${alignMap[textPosition!]}`}
            >
              {text}
            </p>
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default function FullScene(props: FullSceneProps) {
  if (props.isHero) {
    return <FullSceneHero src={props.src} text={props.text} />
  }
  return <FullSceneInner {...props} />
}

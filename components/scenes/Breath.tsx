'use client'

import { motion } from 'framer-motion'

interface BreathProps {
  height: string
}

export default function Breath({ height }: BreathProps) {
  return (
    <motion.div
      style={{ height }}
      className="relative"
      aria-hidden
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 2 }}
      viewport={{ once: true, margin: '-5%' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(11,11,11,0) 60%, rgba(11,11,11,1) 100%)',
        }}
      />
    </motion.div>
  )
}

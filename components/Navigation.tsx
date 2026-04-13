'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from 'framer-motion'
import { useI18n } from '@/lib/i18n/context'

const OVERLAY_DURATION = 0.9
const OVERLAY_EASE = [0.16, 1, 0.3, 1] as const

function FullscreenOverlay({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const { locale, t, toggle } = useI18n()

  const links = [
    { href: '/', label: 'VASILISA' },
    { href: '/experience', label: t.nav.experience },
    { href: '/gallery', label: t.nav.gallery },
    { href: '/about', label: t.nav.about },
    { href: '/contact', label: t.nav.contact },
  ]

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: OVERLAY_DURATION, ease: OVERLAY_EASE }}
        >
          <motion.div
            className="absolute inset-0 bg-black/95 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: OVERLAY_DURATION * 0.6 }}
            onClick={onClose}
          />

          <motion.button
            className="absolute top-6 right-6 md:top-10 md:right-12 z-10 w-11 h-11 flex items-center justify-center cursor-pointer"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            aria-label="Close menu"
          >
            <span className="block w-6 h-px bg-off-white/60 rotate-45 absolute" />
            <span className="block w-6 h-px bg-off-white/60 -rotate-45 absolute" />
          </motion.button>

          <nav className="relative z-10 flex flex-col items-center gap-10 md:gap-14">
            {links.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  duration: 1.2,
                  delay: 0.2 + i * 0.1,
                  ease: OVERLAY_EASE,
                }}
              >
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="font-serif text-2xl md:text-4xl tracking-[0.2em] text-off-white/70 hover:text-off-white transition-colors duration-1000"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}

            {/* Book CTA — soft gold */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: 1.2,
                delay: 0.2 + links.length * 0.1,
                ease: OVERLAY_EASE,
              }}
            >
              <Link
                href="/contact"
                onClick={onClose}
                className="font-sans text-xs tracking-[0.25em] uppercase text-gold/60 hover:text-gold border border-gold/20 hover:border-gold/40 px-8 py-3 transition-all duration-1000"
              >
                {t.nav.book}
              </Link>
            </motion.div>

            {/* Locale toggle */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <button
                onClick={() => { toggle(); onClose() }}
                className="font-sans text-xs tracking-[0.2em] uppercase text-off-white/25 hover:text-off-white/50 transition-colors duration-1000 mt-2 cursor-pointer"
              >
                {locale === 'en' ? 'RU' : 'EN'}
              </button>
            </motion.div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [logoVisible, setLogoVisible] = useState(true)
  const [triggerVisible, setTriggerVisible] = useState(false)
  const lastScrollY = useRef(0)
  const { scrollY } = useScroll()

  const handleScroll = useCallback((latest: number) => {
    const delta = latest - lastScrollY.current
    const pastHero = latest > window.innerHeight * 0.4

    if (pastHero) {
      setLogoVisible(delta < -5)
      setTriggerVisible(true)
    } else {
      setLogoVisible(true)
      setTriggerVisible(false)
    }

    lastScrollY.current = latest
  }, [])

  useMotionValueEvent(scrollY, 'change', handleScroll)

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      {/* Ghost logo */}
      <AnimatePresence>
        {logoVisible && !menuOpen && (
          <motion.div
            className="fixed top-0 left-0 right-0 z-50 px-6 py-5 md:px-12 md:py-8 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              href="/"
              className="font-serif text-lg md:text-xl tracking-[0.2em] text-off-white/80 hover:text-off-white transition-colors duration-1000 pointer-events-auto"
            >
              VASILISA
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating trigger dot */}
      <AnimatePresence>
        {triggerVisible && !menuOpen && (
          <motion.button
            className="fixed top-6 right-6 md:top-10 md:right-12 z-50 w-11 h-11 flex items-center justify-center cursor-pointer group"
            onClick={() => setMenuOpen(true)}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Open menu"
          >
            <span className="block w-1.5 h-1.5 rounded-full bg-gold/40 group-hover:bg-gold/80 group-hover:scale-150 transition-all duration-1000" />
          </motion.button>
        )}
      </AnimatePresence>

      <FullscreenOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}

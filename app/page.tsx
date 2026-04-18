import type { Metadata } from 'next'
import { HomeContent } from '@/components/HomeContent'
import { Colophon } from '@/components/Colophon'

export const metadata: Metadata = {
  title: 'Vasilisa — Photography',
  description:
    'Boudoir photography in Paris — light, skin, and one room at a time.',
}

export default function HomePage() {
  return (
    <main>
      <HomeContent />
      <Colophon />
    </main>
  )
}

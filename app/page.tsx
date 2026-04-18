import type { Metadata } from 'next'
import { HomeContent } from '@/components/HomeContent'
import { Colophon } from '@/components/Colophon'

export const metadata: Metadata = {
  title: 'Vasilisa — Photography',
  description:
    'Paris boudoir — at ease in the room, light on your best self, images you still believe in.',
}

export default function HomePage() {
  return (
    <main>
      <HomeContent />
      <Colophon />
    </main>
  )
}

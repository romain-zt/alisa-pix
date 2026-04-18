import { BookContent } from '@/components/BookContent'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Book a Session — Vasilisa',
  description:
    'Paris boudoir sessions, by appointment. 700€ — two hours together, your complete retouched set, your natural beauty.',
}

export default function BookPage() {
  return <BookContent />
}

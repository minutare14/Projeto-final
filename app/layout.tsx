import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Reserva Florestal',
  description: 'Gamified micro-learning platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
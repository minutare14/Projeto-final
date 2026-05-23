import type { Metadata } from 'next'
import { UserProvider } from '@/components/UserProvider'
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
      <body>
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  )
}
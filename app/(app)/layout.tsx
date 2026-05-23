'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Header } from '@/components/Header'
import { StreakBadge } from '@/components/ui/StreakBadge'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Carregando...</p>
      </div>
    )
  }

  if (!session) return null

  return (
    <>
      <Header streakDays={(session.user as any)?.streakDays || 0} />
      <main className="min-h-screen bg-gray-50">{children}</main>
    </>
  )
}
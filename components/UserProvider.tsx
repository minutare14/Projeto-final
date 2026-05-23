'use client'

import { SessionProvider } from 'next-auth/react'
import { useEffect } from 'react'
import { useUserStore } from '@/lib/store/useUserStore'

function HydrateUser() {
  const { setUser } = useUserStore()

  useEffect(() => {
    import('next-auth/react').then(({ useSession }) => {
      const { data } = useSession()
      if (data?.user) {
        setUser(data.user as any)
      }
    })
  }, [setUser])

  return null
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <HydrateUser />
      {children}
    </SessionProvider>
  )
}
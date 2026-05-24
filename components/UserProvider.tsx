'use client'

import { SessionProvider, useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useUserStore } from '@/lib/store/useUserStore'

function HydrateUser() {
  const { data } = useSession()
  const { setUser } = useUserStore()

  useEffect(() => {
    if (data?.user) {
      setUser(data.user as any)
    }
  }, [data, setUser])

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
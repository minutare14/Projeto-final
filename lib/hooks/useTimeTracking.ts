'use client'

import { useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'

export function useTimeTracking(intervalMs = 60000) {
  const { data: session } = useSession()
  const lastInteraction = useRef<Date>(new Date())

  useEffect(() => {
    if (!session) return

    const handleActivity = () => {
      lastInteraction.current = new Date()
    }

    window.addEventListener('mousemove', handleActivity)
    window.addEventListener('keydown', handleActivity)
    window.addEventListener('click', handleActivity)

    const interval = setInterval(async () => {
      const now = new Date()
      const diff = (now.getTime() - lastInteraction.current.getTime()) / (1000 * 60)

      if (diff <= 3) {
        await fetch('/api/points/track-time', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lastInteractionAt: lastInteraction.current.toISOString() }),
        })
      }
    }, intervalMs)

    return () => {
      window.removeEventListener('mousemove', handleActivity)
      window.removeEventListener('keydown', handleActivity)
      window.removeEventListener('click', handleActivity)
      clearInterval(interval)
    }
  }, [session, intervalMs])
}
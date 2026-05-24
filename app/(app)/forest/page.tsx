'use client'

import { useEffect, useState } from 'react'
import { ForestMap } from '@/components/forest/ForestMap'

export default function ForestPage() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    fetch('/api/users/me/forest')
      .then(r => r.ok ? r.json() : null)
      .then(d => d && setData(d))
  }, [])

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen bg-green-900 text-white text-lg">
        Carregando sua floresta...
      </div>
    )
  }

  return (
    <div className="h-screen">
      <ForestMap
        userId={data.user.id}
        forest={data.forest}
        biomes={[]}
        co2Kg={data.co2Kg}
        currentTier={data.user.currentTier ?? 1}
        totalPoints={data.user.totalPoints ?? 0}
      />
    </div>
  )
}

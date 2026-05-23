'use client'

import { useEffect, useState } from 'react'
import { ForestMap } from '@/components/forest/ForestMap'

export default function ForestPage() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    fetch('/api/users/me/forest').then(r => r.ok ? r.json() : null).then(d => d && setData(d))
  }, [])

  if (!data) return <div className="p-8">Carregando...</div>

  return (
    <div className="h-screen">
      <ForestMap
        userId={data.user.id}
        forest={data.forest}
        biomes={[{ name: 'Caatinga', tier: 1 }]}
        co2Kg={data.co2Kg}
        currentTier={data.user.currentTier}
        totalPoints={data.user.totalPoints}
      />
    </div>
  )
}
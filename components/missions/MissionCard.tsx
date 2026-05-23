'use client'

import { useEffect, useState } from 'react'

interface Mission {
  id: string
  title: string
  description: string | null
  type: string
  target: number
  pointsReward: number
  progress: number
  completed: boolean
  claimed: boolean
  canClaim: boolean
}

export function MissionCard({ mission, onClaim }: { mission: Mission; onClaim: (id: string) => void }) {
  const progress = Math.min((mission.progress / mission.target) * 100, 100)

  return (
    <div className={`bg-white rounded-lg p-4 shadow ${mission.claimed ? 'opacity-60' : ''}`}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-bold text-gray-800">{mission.title}</h3>
          <p className="text-sm text-gray-500">{mission.description}</p>
        </div>
        <span className="text-sm font-bold text-green-600">{mission.pointsReward} pts</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div
          className={`h-2 rounded-full ${mission.completed ? 'bg-green-500' : 'bg-blue-500'}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-xs text-gray-400 mb-2">{mission.progress}/{mission.target}</p>

      {mission.canClaim && !mission.claimed && (
        <button
          onClick={() => onClaim(mission.id)}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
        >
          Resgatar
        </button>
      )}

      {mission.claimed && <p className="text-center text-green-600 font-bold">✓ Resgatado</p>}
    </div>
  )
}

export function MissionList() {
  const [missions, setMissions] = useState<Mission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/missions/daily')
      .then((r) => r.json())
      .then((d) => { setMissions(d); setLoading(false) })
  }, [])

  const handleClaim = async (missionId: string) => {
    const res = await fetch('/api/missions/daily', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ missionId }),
    })
    if (res.ok) {
      setMissions((prev) =>
        prev.map((m) => (m.id === missionId ? { ...m, claimed: true, canClaim: false } : m))
      )
    }
  }

  if (loading) return <div className="p-8 text-center">Carregando missões...</div>

  return (
    <div className="space-y-4">
      {missions.length === 0 && <p className="text-center text-gray-500">Nenhuma missão disponível</p>}
      {missions.map((mission) => (
        <MissionCard key={mission.id} mission={mission} onClaim={handleClaim} />
      ))}
    </div>
  )
}
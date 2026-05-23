'use client'

import { useEffect, useState } from 'react'

interface Achievement {
  id: string
  achievementId: string
  earnedAt: string
  achievement: {
    code: string
    title: string
    description: string | null
    icon: string | null
    pointsBonus: number
    tier: number
    type: string
  }
}

const tierColors: Record<number, string> = {
  1: 'bg-gray-100 border-gray-300',
  2: 'bg-blue-100 border-blue-300',
  3: 'bg-purple-100 border-purple-300',
}

export function AchievementCard({ achievement }: { achievement: Achievement }) {
  return (
    <div className={`rounded-lg p-4 border ${tierColors[achievement.achievement.tier] || tierColors[1]}`}>
      <div className="flex items-center gap-3">
        <span className="text-3xl">{achievement.achievement.icon || '🏅'}</span>
        <div>
          <h3 className="font-bold text-gray-800">{achievement.achievement.title}</h3>
          <p className="text-sm text-gray-500">{achievement.achievement.description}</p>
          <span className="text-xs font-bold text-green-600">+{achievement.achievement.pointsBonus} pts</span>
        </div>
      </div>
    </div>
  )
}

export function AchievementList() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/achievements')
      .then((r) => r.json())
      .then((d) => { setAchievements(d); setLoading(false) })
  }, [])

  if (loading) return <div className="p-8 text-center">Carregando conquistas...</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {achievements.length === 0 && <p className="col-span-2 text-center text-gray-500">Nenhuma conquista ainda</p>}
      {achievements.map((ach) => (
        <AchievementCard key={ach.id} achievement={ach} />
      ))}
    </div>
  )
}
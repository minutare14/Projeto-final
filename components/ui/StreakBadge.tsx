'use client'

interface StreakBadgeProps {
  streakDays: number
}

export function StreakBadge({ streakDays }: StreakBadgeProps) {
  if (streakDays < 2) return null

  return (
    <div className="flex items-center gap-1 text-orange-500">
      <span className="animate-pulse">🔥</span>
      <span className="font-bold">{streakDays}</span>
    </div>
  )
}
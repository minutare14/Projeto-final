export function getStreakMultiplier(streakDays: number): number {
  return Math.min(1 + streakDays * 0.1, 2.0)
}
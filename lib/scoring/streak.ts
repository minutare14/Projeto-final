import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function updateStreakOnLogin(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return { streakDays: 0, isNew: false }

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const lastActive = user.lastActive

  if (!lastActive) {
    await prisma.user.update({
      where: { id: userId },
      data: { streakDays: 1, lastActive: now },
    })
    return { streakDays: 1, isNew: true }
  }

  const lastActiveDate = new Date(lastActive)
  const lastActiveDay = new Date(
    lastActiveDate.getFullYear(),
    lastActiveDate.getMonth(),
    lastActiveDate.getDate()
  )
  const daysDiff = Math.floor(
    (today.getTime() - lastActiveDay.getTime()) / (1000 * 60 * 60 * 24)
  )

  let newStreak = user.streakDays

  if (daysDiff === 1) {
    newStreak = user.streakDays + 1
  } else if (daysDiff > 1) {
    newStreak = 1
  }

  await prisma.user.update({
    where: { id: userId },
    data: { streakDays: newStreak, lastActive: now },
  })

  return { streakDays: newStreak, isNew: daysDiff === 1 }
}
import { PrismaClient, MissionType } from '@prisma/client'

const prisma = new PrismaClient()

export async function getDailyMissions(userId: string) {
  const dayOfWeek = new Date().getDay()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const missions = await prisma.dailyMission.findMany({
    where: {
      active: true,
      OR: [
        { dayOfWeek: null },
        { dayOfWeek: dayOfWeek },
      ],
    },
  })

  const userMissions = await prisma.userMission.findMany({
    where: { userId },
  })

  const completed = await prisma.userMission.count({
    where: { userId, completed: true, claimedAt: { gte: today, lt: tomorrow } },
  })

  return missions.map((mission) => {
    const userMission = userMissions.find((um) => um.missionId === mission.id)
    return {
      ...mission,
      progress: userMission?.progress ?? 0,
      completed: userMission?.completed ?? false,
      claimed: !!userMission?.claimedAt,
      canClaim: (userMission?.completed ?? false) && !userMission?.claimedAt,
      isNew: completed === 0,
    }
  })
}

export async function claimMission(userId: string, missionId: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const userMission = await prisma.userMission.findUnique({
    where: { userId_missionId: { userId, missionId } },
  })

  if (!userMission?.completed) {
    return { error: 'Missão não completada' }
  }

  if (userMission.claimedAt && userMission.claimedAt >= today) {
    return { error: 'Missão já resgatada hoje' }
  }

  const mission = await prisma.dailyMission.findUnique({ where: { id: missionId } })
  if (!mission) return { error: 'Missão não encontrada' }

  await prisma.userMission.update({
    where: { userId_missionId: { userId, missionId } },
    data: { claimedAt: new Date() },
  })

  await prisma.pointEvent.create({
    data: { userId, source: 'mission_claim', points: mission.pointsReward, metadata: { missionId, missionTitle: mission.title } },
  })

  await prisma.user.update({
    where: { id: userId },
    data: { totalPoints: { increment: mission.pointsReward } },
  })

  return { success: true, points: mission.pointsReward }
}

export async function updateMissionProgress(userId: string, type: MissionType, amount: number = 1) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const missions = await prisma.dailyMission.findMany({
    where: { active: true, type },
  })

  for (const mission of missions) {
    const existing = await prisma.userMission.findUnique({
      where: { userId_missionId: { userId, missionId: mission.id } },
    })

    if (!existing) {
      await prisma.userMission.create({
        data: { userId, missionId: mission.id, progress: 0 },
      })
    }

    const currentProgress = existing?.progress ?? 0
    const newProgress = currentProgress + amount

    await prisma.userMission.upsert({
      where: { userId_missionId: { userId, missionId: mission.id } },
      create: { userId, missionId: mission.id, progress: newProgress },
      update: { progress: newProgress },
    })

    if (newProgress >= mission.target && !(existing?.completed ?? false)) {
      await prisma.userMission.update({
        where: { userId_missionId: { userId, missionId: mission.id } },
        data: { completed: true },
      })
    }
  }
}
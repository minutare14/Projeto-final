import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const { achievementCode } = await request.json()
  if (!achievementCode) {
    return NextResponse.json({ error: 'achievementCode é obrigatório' }, { status: 400 })
  }

  const userAchievement = await prisma.userAchievement.findUnique({
    where: { userId_achievementId: { userId: session.user.id, achievementId: achievementCode } },
    include: { achievement: true },
  })

  if (!userAchievement) {
    return NextResponse.json({ error: 'Conquista não desbloqueada' }, { status: 404 })
  }

  await prisma.pointEvent.create({
    data: {
      userId: session.user.id,
      source: 'achievement_claim',
      points: userAchievement.achievement.pointsBonus,
      metadata: { achievementCode },
    },
  })

  await prisma.user.update({
    where: { id: session.user.id },
    data: { totalPoints: { increment: userAchievement.achievement.pointsBonus } },
  })

  return NextResponse.json({ success: true, points: userAchievement.achievement.pointsBonus })
}
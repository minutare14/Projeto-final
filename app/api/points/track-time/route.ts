import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth/options'
import { PrismaClient } from '@prisma/client'
import { creditPoints } from '@/lib/scoring/service'

const prisma = new PrismaClient()

const MAX_MINUTES_PER_DAY = 30
const POINTS_PER_MINUTE = 2

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const { lastInteractionAt } = await req.json()

  if (!lastInteractionAt) {
    return NextResponse.json({ error: 'lastInteractionAt é obrigatório' }, { status: 400 })
  }

  const interactionTime = new Date(lastInteractionAt)
  const now = new Date()
  const diffMinutes = (now.getTime() - interactionTime.getTime()) / (1000 * 60)

  if (diffMinutes > 3) {
    return NextResponse.json(
      { error: 'Interação muito antiga (mais de 3 minutos)' },
      { status: 400 }
    )
  }

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const todayStart = new Date(today.setHours(0, 0, 0, 0))

  const todayEvents = await prisma.pointEvent.count({
    where: {
      userId: session.user.id,
      source: 'time_active',
      createdAt: { gte: todayStart },
    },
  })

  if (todayEvents >= MAX_MINUTES_PER_DAY) {
    return NextResponse.json({ message: 'Limite de tempo ativo diário atingido', maxReached: true })
  }

  await creditPoints(session.user.id, 'time_active', POINTS_PER_MINUTE)

  return NextResponse.json({
    pointsEarned: POINTS_PER_MINUTE,
    minutesToday: todayEvents + 1,
    maxMinutes: MAX_MINUTES_PER_DAY,
  })
}
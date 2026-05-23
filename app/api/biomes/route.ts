import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const biomes = await prisma.biome.findMany({ orderBy: { tier: 'asc' } })
  const unlocked = await prisma.userBiome.findMany({ where: { userId: session.user.id } })
  const unlockedIds = new Set(unlocked.map((u) => u.biomeId))

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })

  return NextResponse.json(
    biomes.map((b) => ({
      id: b.id,
      name: b.name,
      tier: b.tier,
      pointsRequired: b.pointsRequired,
      description: b.description,
      backgroundUrl: b.backgroundUrl,
      unlocked: unlockedIds.has(b.id),
      currentTier: user?.currentTier ?? 1,
    }))
  )
}
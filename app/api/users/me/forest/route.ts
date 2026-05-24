import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { PrismaClient } from '@prisma/client'
import { calculateCO2 } from '@/lib/forest/co2'

const prisma = new PrismaClient()

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const id = session.user.id

  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, currentTier: true, totalPoints: true, streakDays: true },
  })

  if (!user) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })

  const forest = await prisma.userForest.findMany({
    where: { userId: id },
    include: { tree: true, biome: true },
    orderBy: { plantedAt: 'asc' },
  })

  const co2Kg = await calculateCO2(id)

  return NextResponse.json({
    user,
    forest: forest.map((f) => ({
      id: f.id,
      tree: {
        commonName: f.tree.commonName,
        scientificName: f.tree.scientificName,
        rarity: f.tree.rarity,
        funFact: f.tree.funFact,
      },
      biome: { name: f.biome.name, tier: f.biome.tier },
      posX: f.posX,
      posY: f.posY,
    })),
    co2Kg,
  })
}

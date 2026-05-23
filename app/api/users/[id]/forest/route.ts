import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { calculateCO2 } from '@/lib/forest/co2'

const prisma = new PrismaClient()

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, avatarUrl: true, currentTier: true, totalPoints: true, streakDays: true },
  })

  if (!user) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })

  const forest = await prisma.userForest.findMany({
    where: { userId: id },
    include: { tree: true, biome: true },
    orderBy: { plantedAt: 'asc' },
  })

  const unlockedBiomes = await prisma.userBiome.findMany({
    where: { userId: id },
    include: { biome: true },
  })

  const co2Kg = await calculateCO2(id)

  return NextResponse.json({
    user,
    forest: forest.map((f) => ({
      id: f.id,
      tree: { commonName: f.tree.commonName, scientificName: f.tree.scientificName, rarity: f.tree.rarity, illustrationUrl: f.tree.illustrationUrl, funFact: f.tree.funFact },
      biome: { name: f.biome.name, tier: f.biome.tier },
      posX: f.posX,
      posY: f.posY,
      plantedAt: f.plantedAt,
    })),
    unlockedBiomes: unlockedBiomes.map((ub) => ub.biome.name),
    co2Kg,
  })
}
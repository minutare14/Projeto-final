import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function checkBiomeUnlocks(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return

  const biomes = await prisma.biome.findMany({
    where: { pointsRequired: { lte: user.totalPoints } },
    orderBy: { tier: 'asc' },
  })

  for (const biome of biomes) {
    await prisma.userBiome.upsert({
      where: { userId_biomeId: { userId, biomeId: biome.id } },
      update: {},
      create: { userId, biomeId: biome.id },
    })
  }

  const maxTierBiome = biomes[biomes.length - 1]
  if (maxTierBiome && user.currentTier < maxTierBiome.tier) {
    await prisma.user.update({
      where: { id: userId },
      data: { currentTier: maxTierBiome.tier },
    })
    return { newTier: maxTierBiome.tier, biome: maxTierBiome }
  }

  return null
}
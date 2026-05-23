import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const biomeId = searchParams.get('biome_id')
  const rarity = searchParams.get('rarity')
  const tier = searchParams.get('tier')

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const trees = await prisma.tree.findMany({
    where: {
      ...(biomeId && { biomeId: parseInt(biomeId) }),
      ...(rarity && { rarity: rarity as any }),
      ...(tier && { tierRequired: { lte: parseInt(tier) } }),
    },
    include: { biome: true },
  })

  return NextResponse.json(
    trees.map((t) => ({
      id: t.id,
      commonName: t.commonName,
      scientificName: t.scientificName,
      costPoints: t.costPoints,
      rarity: t.rarity,
      tierRequired: t.tierRequired,
      description: t.description,
      illustrationUrl: t.illustrationUrl,
      funFact: t.funFact,
      co2AbsorptionKgYear: t.co2AbsorptionKgYear,
      biome: t.biome,
      canBuy: user.totalPoints >= t.costPoints && user.currentTier >= t.tierRequired,
    }))
  )
}
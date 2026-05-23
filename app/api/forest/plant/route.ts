import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { PrismaClient } from '@prisma/client'
import { hasCollision } from '@/lib/forest/collision'
import { checkBiomeUnlocks } from '@/lib/biome/unlock'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const { treeId, posX, posY } = await req.json()

  if (!treeId || posX === undefined || posY === undefined) {
    return NextResponse.json({ error: 'treeId, posX e posY são obrigatórios' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const tree = await prisma.tree.findUnique({ where: { id: treeId } })
  if (!tree) return NextResponse.json({ error: 'Árvore não encontrada' }, { status: 404 })

  if (user.totalPoints < tree.costPoints) {
    return NextResponse.json({ error: 'Pontos insuficientes' }, { status: 400 })
  }

  if (user.currentTier < tree.tierRequired) {
    return NextResponse.json({ error: `Tier ${tree.tierRequired} necessário para esta árvore` }, { status: 403 })
  }

  if (await hasCollision(session.user.id, posX, posY)) {
    return NextResponse.json({ error: 'Posição já ocupada' }, { status: 409 })
  }

  await prisma.$transaction([
    prisma.pointEvent.create({
      data: { userId: session.user.id, source: 'tree_purchase', points: -tree.costPoints },
    }),
    prisma.user.update({
      where: { id: session.user.id },
      data: { totalPoints: { decrement: tree.costPoints } },
    }),
    prisma.userForest.create({
      data: {
        userId: session.user.id,
        treeId,
        biomeId: tree.biomeId,
        posX,
        posY,
      },
    }),
  ])

  const unlockResult = await checkBiomeUnlocks(session.user.id)

  return NextResponse.json({
    success: true,
    treeId,
    co2AbsorptionKgYear: tree.co2AbsorptionKgYear,
    biomeUnlocked: unlockResult?.newTier ? { tier: unlockResult.newTier, name: unlockResult.biome.name } : null,
  })
}
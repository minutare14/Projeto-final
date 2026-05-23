import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth/options'
import { PrismaClient } from '@prisma/client'
import { creditPoints } from '@/lib/scoring/service'

const prisma = new PrismaClient()

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const { id } = await params

  const existing = await prisma.userProgress.findUnique({
    where: { userId_blockId: { userId: session.user.id, blockId: id } },
  })

  if (existing?.completed) {
    return NextResponse.json({ message: 'Bloco já concluído', completed: true })
  }

  const block = await prisma.contentBlock.findUnique({ where: { id } })
  if (!block) {
    return NextResponse.json({ error: 'Bloco não encontrado' }, { status: 404 })
  }

  await prisma.userProgress.upsert({
    where: { userId_blockId: { userId: session.user.id, blockId: id } },
    update: { completed: true, completedAt: new Date(), pointsEarned: block.pointsReward },
    create: {
      userId: session.user.id,
      blockId: id,
      completed: true,
      completedAt: new Date(),
      pointsEarned: block.pointsReward,
    },
  })

  await creditPoints(session.user.id, 'block_read', block.pointsReward, { blockId: id })

  const allBlocks = await prisma.contentBlock.findMany({
    where: { subjectId: block.subjectId },
    include: { progress: { where: { userId: session.user.id } } },
  })

  const allCompleted = allBlocks.every((b) => b.progress[0]?.completed)
  if (allCompleted) {
    await creditPoints(session.user.id, 'module_complete', 100, {
      subjectId: block.subjectId,
    })
  }

  return NextResponse.json({
    message: 'Bloco concluído',
    pointsEarned: block.pointsReward,
    moduleBonus: allCompleted ? 100 : 0,
  })
}
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
  const { option } = await req.json()

  if (!option || !['a', 'b', 'c', 'd'].includes(option.toLowerCase())) {
    return NextResponse.json({ error: 'Opção inválida' }, { status: 400 })
  }

  const checkpoint = await prisma.checkpoint.findUnique({ where: { id } })
  if (!checkpoint) {
    return NextResponse.json({ error: 'Checkpoint não encontrado' }, { status: 404 })
  }

  const isCorrect = checkpoint.correctOption.toLowerCase() === option.toLowerCase()

  const existing = await prisma.userProgress.findUnique({
    where: {
      userId_blockId: { userId: session.user.id, blockId: checkpoint.blockId },
    },
  })

  if ((existing?.pointsEarned ?? 0) >= checkpoint.pointsReward) {
    return NextResponse.json({
      correct: isCorrect,
      explanation: checkpoint.explanation,
      alreadyAnswered: true,
    })
  }

  if (isCorrect) {
    await creditPoints(session.user.id, 'checkpoint', checkpoint.pointsReward, {
      checkpointId: id,
    })
    await prisma.userProgress.update({
      where: { userId_blockId: { userId: session.user.id, blockId: checkpoint.blockId } },
      data: { pointsEarned: { increment: checkpoint.pointsReward } },
    })
  }

  return NextResponse.json({
    correct: isCorrect,
    explanation: checkpoint.explanation,
    pointsEarned: isCorrect ? checkpoint.pointsReward : 0,
  })
}
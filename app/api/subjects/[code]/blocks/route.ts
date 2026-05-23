import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth/options'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const { code } = await params

  const subject = await prisma.subject.findUnique({
    where: { code },
    include: {
      blocks: {
        orderBy: { orderIndex: 'asc' },
        include: {
          checkpoints: true,
        },
      },
    },
  })

  if (!subject) {
    return NextResponse.json({ error: 'Matéria não encontrada' }, { status: 404 })
  }

  const progress = await prisma.userProgress.findMany({
    where: {
      userId: session.user.id,
      blockId: { in: subject.blocks.map((b) => b.id) },
    },
  })

  const progressMap = new Map(progress.map((p) => [p.blockId, p]))

  const blocksWithProgress = subject.blocks.map((block) => ({
    ...block,
    completed: progressMap.get(block.id)?.completed || false,
    pointsEarned: progressMap.get(block.id)?.pointsEarned || 0,
  }))

  return NextResponse.json({
    subject: {
      id: subject.id,
      code: subject.code,
      name: subject.name,
      description: subject.description,
    },
    blocks: blocksWithProgress,
  })
}
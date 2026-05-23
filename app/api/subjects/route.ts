import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth/options'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const subjects = await prisma.subject.findMany({
    include: {
      blocks: { select: { id: true } },
    },
  })

  const userProgress = await prisma.userProgress.findMany({
    where: { userId: session.user.id },
  })
  const completedBlockIds = new Set(userProgress.filter(p => p.completed).map(p => p.blockId))

  const subjectsWithProgress = subjects.map((subject) => ({
    id: subject.id,
    code: subject.code,
    name: subject.name,
    description: subject.description,
    totalBlocks: subject.blocks.length,
    completedBlocks: subject.blocks.filter(b => completedBlockIds.has(b.id)).length,
  }))

  return NextResponse.json(subjectsWithProgress)
}
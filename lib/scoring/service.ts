import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function creditPoints(
  userId: string,
  source: string,
  amount: number,
  metadata?: Record<string, any>
) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw new Error('User not found')

  const multiplier = Math.min(1 + user.streakDays * 0.1, 2.0)
  const finalAmount = Math.round(amount * multiplier)

  await prisma.$transaction([
    prisma.pointEvent.create({
      data: {
        userId,
        source,
        points: finalAmount,
        metadata: metadata || undefined,
      },
    }),
    prisma.user.update({
      where: { id: userId },
      data: { totalPoints: { increment: finalAmount } },
    }),
  ])

  return { points: finalAmount, multiplier }
}

export async function debitPoints(userId: string, source: string, amount: number) {
  await prisma.$transaction([
    prisma.pointEvent.create({
      data: {
        userId,
        source,
        points: -amount,
      },
    }),
    prisma.user.update({
      where: { id: userId },
      data: { totalPoints: { decrement: amount } },
    }),
  ])
}
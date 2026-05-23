import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function calculateCO2(userId: string): Promise<number> {
  const result = await prisma.userForest.aggregate({
    where: { userId },
    _sum: { treeId: true },
  })

  const count = result._sum.treeId ?? 0
  const avgAbsorption = 22.0
  return count * avgAbsorption
}
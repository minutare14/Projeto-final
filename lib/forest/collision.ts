import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const MIN_DISTANCE = 1.0

export async function hasCollision(userId: string, x: number, y: number): Promise<boolean> {
  const trees = await prisma.userForest.findMany({ where: { userId } })

  for (const tree of trees) {
    const dist = Math.sqrt(Math.pow(tree.posX - x, 2) + Math.pow(tree.posY - y, 2))
    if (dist < MIN_DISTANCE) return true
  }

  return false
}
import { PrismaClient, AchievementType } from '@prisma/client'

const prisma = new PrismaClient()

export const ACHIEVEMENTS = [
  { code: 'first_login', title: 'Bem-vindo!', description: 'Complete seu primeiro login', icon: '👋', pointsBonus: 50, tier: 1, type: AchievementType.streak },
  { code: 'streak_3', title: 'No caminho certo', description: '3 dias seguidos de estudo', icon: '🔥', pointsBonus: 100, tier: 1, type: AchievementType.streak },
  { code: 'streak_7', title: 'Uma semana!', description: '7 dias seguidos de estudo', icon: '💪', pointsBonus: 250, tier: 2, type: AchievementType.streak },
  { code: 'streak_30', title: 'Mês champion', description: '30 dias seguidos de estudo', icon: '🏆', pointsBonus: 1000, tier: 3, type: AchievementType.streak },
  { code: 'points_100', title: 'Iniciante', description: 'Acumule 100 pontos', icon: '🌱', pointsBonus: 50, tier: 1, type: AchievementType.points },
  { code: 'points_1000', title: 'Explorador', description: 'Acumule 1.000 pontos', icon: '🌿', pointsBonus: 200, tier: 2, type: AchievementType.points },
  { code: 'points_10000', title: 'Mestre', description: 'Acumule 10.000 pontos', icon: '🌳', pointsBonus: 500, tier: 3, type: AchievementType.points },
  { code: 'forest_5', title: 'Reflorestador iniciante', description: 'Plante 5 árvores', icon: '🌲', pointsBonus: 100, tier: 1, type: AchievementType.forest },
  { code: 'forest_25', title: 'Reflorestador avançado', description: 'Plante 25 árvores', icon: '🌳', pointsBonus: 300, tier: 2, type: AchievementType.forest },
  { code: 'forest_100', title: 'Guardião da floresta', description: 'Plante 100 árvores', icon: '🌴', pointsBonus: 1000, tier: 3, type: AchievementType.forest },
  { code: 'content_5', title: 'Primeiros passos', description: 'Complete 5 blocos de conteúdo', icon: '📚', pointsBonus: 100, tier: 1, type: AchievementType.content },
  { code: 'content_25', title: 'Estudioso', description: 'Complete 25 blocos de conteúdo', icon: '📖', pointsBonus: 300, tier: 2, type: AchievementType.content },
  { code: 'content_100', title: 'Erudito', description: 'Complete 100 blocos de conteúdo', icon: '🎓', pointsBonus: 1000, tier: 3, type: AchievementType.content },
  { code: 'social_first', title: 'Sociável', description: 'Faça sua primeira postagem', icon: '💬', pointsBonus: 50, tier: 1, type: AchievementType.social },
  { code: 'social_10', title: 'Colaborador', description: 'Faça 10 postagens', icon: '🤝', pointsBonus: 200, tier: 2, type: AchievementType.social },
]

export async function checkAchievements(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return []

  const userAchievements = await prisma.userAchievement.findMany({ where: { userId } })
  const earnedCodes = new Set(userAchievements.map((ua) => ua.achievementId))

  const treeCount = await prisma.userForest.count({ where: { userId } })
  const contentCount = await prisma.userProgress.count({ where: { userId, completed: true } })
  const postCount = await prisma.post.count({ where: { authorId: userId } })

  const newAchievements: string[] = []

  const checks = [
    { code: 'first_login', condition: true },
    { code: 'streak_3', condition: (user.streakDays ?? 0) >= 3 },
    { code: 'streak_7', condition: (user.streakDays ?? 0) >= 7 },
    { code: 'streak_30', condition: (user.streakDays ?? 0) >= 30 },
    { code: 'points_100', condition: user.totalPoints >= 100 },
    { code: 'points_1000', condition: user.totalPoints >= 1000 },
    { code: 'points_10000', condition: user.totalPoints >= 10000 },
    { code: 'forest_5', condition: treeCount >= 5 },
    { code: 'forest_25', condition: treeCount >= 25 },
    { code: 'forest_100', condition: treeCount >= 100 },
    { code: 'content_5', condition: contentCount >= 5 },
    { code: 'content_25', condition: contentCount >= 25 },
    { code: 'content_100', condition: contentCount >= 100 },
    { code: 'social_first', condition: postCount >= 1 },
    { code: 'social_10', condition: postCount >= 10 },
  ]

  for (const check of checks) {
    if (check.condition && !earnedCodes.has(check.code)) {
      await prisma.userAchievement.create({
        data: { userId, achievementId: check.code },
      })
      newAchievements.push(check.code)
    }
  }

  return newAchievements
}

export async function getUserAchievements(userId: string) {
  return prisma.userAchievement.findMany({
    where: { userId },
    include: { achievement: true },
    orderBy: { earnedAt: 'desc' },
  })
}

export async function initializeAchievements() {
  for (const ach of ACHIEVEMENTS) {
    await prisma.achievement.upsert({
      where: { code: ach.code },
      create: ach,
      update: ach,
    })
  }
}
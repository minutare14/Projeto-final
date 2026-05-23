import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { getUserAchievements, checkAchievements } from '@/lib/achievements/service'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const achievements = await getUserAchievements(session.user.id)
  return NextResponse.json(achievements)
}

export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const newAchievements = await checkAchievements(session.user.id)
  return NextResponse.json({ newAchievements })
}
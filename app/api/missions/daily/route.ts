import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { getDailyMissions, claimMission } from '@/lib/missions/service'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const missions = await getDailyMissions(session.user.id)
  return NextResponse.json(missions)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const { missionId } = await request.json()
  if (!missionId) {
    return NextResponse.json({ error: 'missionId é obrigatório' }, { status: 400 })
  }

  const result = await claimMission(session.user.id, missionId)
  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }

  return NextResponse.json(result)
}
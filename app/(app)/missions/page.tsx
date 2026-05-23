import { MissionList } from '@/components/missions/MissionCard'

export default function MissionsPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-green-800 mb-6">Missões Diárias</h1>
      <MissionList />
    </div>
  )
}
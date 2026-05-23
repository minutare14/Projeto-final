import { AchievementList } from '@/components/achievements/AchievementCard'

export default function AchievementsPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-green-800 mb-6">Conquistas</h1>
      <AchievementList />
    </div>
  )
}
'use client'

import { useSession } from 'next-auth/react'

export default function DashboardPage() {
  const { data: session } = useSession()

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Olá, {session?.user?.name || 'Usuário'}!
      </h1>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-green-700 mb-4">
          Seu Progresso
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Pontos</p>
            <p className="text-2xl font-bold text-green-700">
              {session?.user?.totalPoints || 0}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Tier Atual</p>
            <p className="text-2xl font-bold text-green-700">
              {session?.user?.currentTier || 1}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Dias de Sequência</p>
            <p className="text-2xl font-bold text-green-700">0</p>
          </div>
        </div>
      </div>
    </div>
  )
}
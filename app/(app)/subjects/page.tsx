'use client'

import { useSession } from 'next-auth/react'
import { Header } from '@/components/Header'
import { StreakBadge } from '@/components/ui/StreakBadge'

export default function SubjectsPage() {
  const { data: session } = useSession()

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Matérias Disponíveis
      </h1>
      <p className="text-gray-600 mb-8">
        Escolha uma matéria para começar a estudar
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6 cursor-pointer hover:shadow-lg transition">
          <h2 className="text-xl font-bold text-green-700 mb-2">ICTA13</h2>
          <p className="text-gray-600 mb-4">Ecologia e Meio Ambiente</p>
          <div className="flex justify-between text-sm text-gray-500">
            <span>5 blocos</span>
            <span className="text-green-600">Iniciar →</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6 cursor-pointer hover:shadow-lg transition opacity-75">
          <h2 className="text-xl font-bold text-green-700 mb-2">CTIA03</h2>
          <p className="text-gray-600 mb-4">Bases Matemáticas (em breve)</p>
          <div className="flex justify-between text-sm text-gray-500">
            <span>9 blocos</span>
            <span className="text-gray-400">Em breve</span>
          </div>
        </div>
      </div>
    </div>
  )
}
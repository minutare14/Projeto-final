'use client'

import { useState } from 'react'
import { CO2Counter } from '@/components/ui/CO2Counter'
import { TreeShop } from '@/components/shop/TreeShop'

interface ForestMapProps {
  userId: string
  forest: any[]
  biomes: any[]
  co2Kg: number
  currentTier: number
  totalPoints: number
}

export function ForestMap({ userId, forest, biomes, co2Kg, currentTier, totalPoints }: ForestMapProps) {
  const [showShop, setShowShop] = useState(false)
  const currentBiome = biomes.find((b: any) => b.tier === currentTier)

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-green-400 to-green-600">
      <div className="absolute top-4 right-4 z-10">
        <CO2Counter value={co2Kg} />
      </div>

      <div className="absolute top-4 left-4 z-10 bg-white/80 rounded-lg p-4">
        <p className="font-bold text-green-800">{currentBiome?.name || 'Caatinga'}</p>
        <p className="text-sm text-gray-600">{totalPoints} pontos</p>
      </div>

      {forest.map((tree: any) => (
        <div
          key={tree.id}
          className="absolute w-8 h-8 bg-green-700 rounded-full flex items-center justify-center text-white text-xs cursor-pointer hover:w-12 hover:h-12 transition-all"
          style={{ left: `${tree.posX}%`, top: `${tree.posY}%` }}
          title={`${tree.tree.commonName}\n${tree.tree.scientificName}\n🌿 ${tree.tree.funFact}`}
        >
          🌳
        </div>
      ))}

      <button
        onClick={() => setShowShop(true)}
        className="absolute bottom-8 right-8 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-700"
      >
        🛒 Loja de Árvores
      </button>

      {showShop && (
        <TreeShop
          onClose={() => setShowShop(false)}
          currentTier={currentTier}
          totalPoints={totalPoints}
        />
      )}
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'

interface TreeShopProps {
  onClose: () => void
  currentTier: number
  totalPoints: number
}

export function TreeShop({ onClose, currentTier, totalPoints }: TreeShopProps) {
  const [trees, setTrees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/trees').then(r => r.json()).then(d => { setTrees(d); setLoading(false) })
  }, [])

  const handlePlant = async (treeId: number) => {
    const posX = Math.random() * 80 + 10
    const posY = Math.random() * 60 + 20
    const res = await fetch('/api/forest/plant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ treeId, posX, posY }),
    })
    if (res.ok) window.location.reload()
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex">
      <div className="bg-white w-96 h-full overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-green-800">Loja de Árvores</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <div className="space-y-4">
            {trees.map((tree) => (
              <div key={tree.id} className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-green-800">{tree.commonName}</h3>
                    <p className="text-sm text-gray-500 italic">{tree.scientificName}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    tree.rarity === 'lendario' ? 'bg-purple-100 text-purple-700' :
                    tree.rarity === 'epico' ? 'bg-orange-100 text-orange-700' :
                    tree.rarity === 'raro' ? 'bg-blue-100 text-blue-700' :
                    tree.rarity === 'incomum' ? 'bg-cyan-100 text-cyan-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>{tree.rarity}</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{tree.description}</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-green-700">{tree.costPoints} pts</span>
                  <button
                    onClick={() => handlePlant(tree.id)}
                    disabled={!tree.canBuy}
                    className={`px-4 py-2 rounded ${tree.canBuy ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                  >
                    {tree.canBuy ? 'Plantar' : `Tier ${tree.tierRequired}`}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex-1" onClick={onClose} />
    </div>
  )
}
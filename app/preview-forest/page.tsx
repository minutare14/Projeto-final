'use client'

import { useState } from 'react'
import { ForestMap } from '@/components/forest/ForestMap'

const TREES = [
  { id:1, commonName:'Mandacaru',  scientificName:'Cereus jamacaru',         rarity:'comum' },
  { id:2, commonName:'Buriti',     scientificName:'Mauritia flexuosa',        rarity:'raro' },
  { id:3, commonName:'Ipê',        scientificName:'Handroanthus impetiginosus',rarity:'incomum' },
  { id:4, commonName:'Araucária',  scientificName:'Araucaria angustifolia',   rarity:'epico' },
  { id:5, commonName:'Pau-Brasil',  scientificName:'Paubrasilia echinata',     rarity:'lendario' },
]

let nextId = 100
const MOCK_FOREST: any[] = [
  { id:'1',  plantedAt:'2024-01-01', tree:{ commonName:'Mandacaru',  scientificName:'Cereus jamacaru',         rarity:'comum'    }, biome:{ name:'Caatinga', tier:1 } },
  { id:'2',  plantedAt:'2024-01-02', tree:{ commonName:'Buriti',     scientificName:'Mauritia flexuosa',        rarity:'raro'     }, biome:{ name:'Caatinga', tier:1 } },
  { id:'3',  plantedAt:'2024-01-03', tree:{ commonName:'Ipê',        scientificName:'Handroanthus impetiginosus', rarity:'incomum'  }, biome:{ name:'Caatinga', tier:1 } },
  { id:'4',  plantedAt:'2024-01-04', tree:{ commonName:'Araucária',   scientificName:'Araucaria angustifolia',   rarity:'epico'    }, biome:{ name:'Caatinga', tier:1 } },
  { id:'5',  plantedAt:'2024-01-05', tree:{ commonName:'Pau-Brasil',  scientificName:'Paubrasilia echinata',     rarity:'lendario' }, biome:{ name:'Caatinga', tier:1 } },
  { id:'6',  plantedAt:'2024-02-01', tree:{ commonName:'Mandacaru',  scientificName:'Cereus jamacaru',         rarity:'comum'    }, biome:{ name:'Caatinga', tier:1 } },
]

export default function PreviewForestPage() {
  const [forest, setForest] = useState(MOCK_FOREST)
  const [showShop, setShowShop] = useState(false)

  const plantTree = (tree: any) => {
    setForest(prev => [...prev, {
      id: String(nextId++),
      plantedAt: new Date().toISOString(),
      tree,
      biome:{ name:'Caatinga', tier:1 },
    }])
  }

  return (
    <div className="h-screen">
      {/* Toolbar */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex gap-3 bg-white/90 backdrop-blur rounded-full px-6 py-3 shadow-lg">
        <button onClick={() => setShowShop(true)} className="bg-green-600 text-white px-4 py-2 rounded-full font-bold hover:bg-green-700">
          🌱 Plantar Árvore
        </button>
        <button onClick={() => setForest([])} className="bg-red-500 text-white px-4 py-2 rounded-full font-bold hover:bg-red-600">
          🗑️ Limpar
        </button>
        <span className="px-4 py-2 font-bold text-gray-700">{forest.length} árvores</span>
      </div>

      {/* Forest */}
      <ForestMap
        userId="preview"
        forest={forest}
        biomes={[]}
        co2Kg={forest.length * 22}
        currentTier={1}
        totalPoints={99999}
      />

      {/* Shop Modal */}
      {showShop && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setShowShop(false)}>
          <div className="bg-white rounded-2xl p-6 w-96 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-green-800 mb-4">🌳 Plantar Árvore</h2>
            <div className="space-y-3">
              {TREES.map(tree => (
                <div key={tree.id} className="flex items-center justify-between bg-green-50 rounded-xl p-3 border border-green-200">
                  <div>
                    <span className="font-bold text-green-800">{tree.commonName}</span>
                    <span className={`ml-2 text-xs px-2 py-0.5 rounded ${
                      tree.rarity === 'lendario' ? 'bg-purple-100 text-purple-700' :
                      tree.rarity === 'epico' ? 'bg-orange-100 text-orange-700' :
                      tree.rarity === 'raro' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>{tree.rarity}</span>
                  </div>
                  <button onClick={() => { plantTree(tree); setShowShop(false) }}
                    className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold hover:bg-green-700">
                    Plantar
                  </button>
                </div>
              ))}
            </div>
            <button onClick={() => setShowShop(false)} className="mt-4 w-full text-gray-500 hover:text-gray-700">Fechar</button>
          </div>
        </div>
      )}
    </div>
  )
}
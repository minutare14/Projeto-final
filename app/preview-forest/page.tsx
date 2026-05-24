import { ForestMap } from '@/components/forest/ForestMap'

const MOCK_FOREST = [
  { id: '1', posX: 12, posY: 80, tree: { commonName: 'Mandacaru', scientificName: 'Cereus jamacaru',        rarity: 'comum',    funFact: 'Reservatório de água natural'   }, biome: { name: 'Caatinga', tier: 1 } },
  { id: '2', posX: 28, posY: 80, tree: { commonName: 'Juazeiro',  scientificName: 'Ziziphus joazeiro',      rarity: 'incomum',  funFact: 'Árvore sagrada do sertão'       }, biome: { name: 'Caatinga', tier: 1 } },
  { id: '3', posX: 45, posY: 80, tree: { commonName: 'Aroeira',   scientificName: 'Myracrodruon urundeuva', rarity: 'raro',     funFact: 'Madeira mais dura do Brasil'    }, biome: { name: 'Caatinga', tier: 1 } },
  { id: '4', posX: 62, posY: 80, tree: { commonName: 'Mandacaru', scientificName: 'Cereus jamacaru',        rarity: 'epico',    funFact: 'Floresce apenas à noite'        }, biome: { name: 'Caatinga', tier: 1 } },
  { id: '5', posX: 80, posY: 80, tree: { commonName: 'Juazeiro',  scientificName: 'Ziziphus joazeiro',      rarity: 'lendario', funFact: 'Resistiu a todas as secas'      }, biome: { name: 'Caatinga', tier: 1 } },
]

export default function PreviewForestPage() {
  return (
    <ForestMap
      userId="preview"
      forest={MOCK_FOREST}
      biomes={[]}
      co2Kg={142.5}
      currentTier={1}
      totalPoints={3200}
    />
  )
}

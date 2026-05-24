import { ForestMap } from '@/components/forest/ForestMap'

// 14 árvores → grid MEDIUM 6×4 (24 slots)
const MOCK_FOREST = [
  { id:'1',  posX:10, posY:10, plantedAt:'2024-01-01', tree:{ commonName:'Mandacaru',  scientificName:'Cereus jamacaru',         rarity:'comum',    funFact:'Reservatório de água natural'     }, biome:{ name:'Caatinga', tier:1 } },
  { id:'2',  posX:25, posY:10, plantedAt:'2024-01-02', tree:{ commonName:'Juazeiro',   scientificName:'Ziziphus joazeiro',       rarity:'incomum',  funFact:'Árvore sagrada do sertão'         }, biome:{ name:'Caatinga', tier:1 } },
  { id:'3',  posX:40, posY:10, plantedAt:'2024-01-03', tree:{ commonName:'Aroeira',    scientificName:'Myracrodruon urundeuva',  rarity:'raro',     funFact:'Madeira mais dura do Brasil'      }, biome:{ name:'Caatinga', tier:1 } },
  { id:'4',  posX:55, posY:10, plantedAt:'2024-01-04', tree:{ commonName:'Mandacaru',  scientificName:'Cereus jamacaru',         rarity:'epico',    funFact:'Floresce apenas à noite'          }, biome:{ name:'Caatinga', tier:1 } },
  { id:'5',  posX:70, posY:10, plantedAt:'2024-01-05', tree:{ commonName:'Juazeiro',   scientificName:'Ziziphus joazeiro',       rarity:'lendario', funFact:'Resistiu a todas as secas'        }, biome:{ name:'Caatinga', tier:1 } },
  { id:'6',  posX:85, posY:10, plantedAt:'2024-01-06', tree:{ commonName:'Mandacaru',  scientificName:'Cereus jamacaru',         rarity:'comum',    funFact:'Resistente à seca extrema'        }, biome:{ name:'Caatinga', tier:1 } },
  { id:'7',  posX:10, posY:40, plantedAt:'2024-02-01', tree:{ commonName:'Aroeira',    scientificName:'Myracrodruon urundeuva',  rarity:'incomum',  funFact:'Casca medicinal poderosa'         }, biome:{ name:'Caatinga', tier:1 } },
  { id:'8',  posX:25, posY:40, plantedAt:'2024-02-02', tree:{ commonName:'Juazeiro',   scientificName:'Ziziphus joazeiro',       rarity:'raro',     funFact:'Frutos comestíveis no sertão'     }, biome:{ name:'Caatinga', tier:1 } },
  { id:'9',  posX:40, posY:40, plantedAt:'2024-02-03', tree:{ commonName:'Mandacaru',  scientificName:'Cereus jamacaru',         rarity:'comum',    funFact:'Habitat para pássaros'            }, biome:{ name:'Caatinga', tier:1 } },
  { id:'10', posX:55, posY:40, plantedAt:'2024-02-04', tree:{ commonName:'Aroeira',    scientificName:'Myracrodruon urundeuva',  rarity:'epico',    funFact:'Vive mais de 500 anos'            }, biome:{ name:'Caatinga', tier:1 } },
  { id:'11', posX:70, posY:40, plantedAt:'2024-02-05', tree:{ commonName:'Juazeiro',   scientificName:'Ziziphus joazeiro',       rarity:'comum',    funFact:'Sombra refrescante no sertão'     }, biome:{ name:'Caatinga', tier:1 } },
  { id:'12', posX:85, posY:40, plantedAt:'2024-02-06', tree:{ commonName:'Mandacaru',  scientificName:'Cereus jamacaru',         rarity:'incomum',  funFact:'Flor branca perfumada'            }, biome:{ name:'Caatinga', tier:1 } },
  { id:'13', posX:10, posY:70, plantedAt:'2024-03-01', tree:{ commonName:'Aroeira',    scientificName:'Myracrodruon urundeuva',  rarity:'raro',     funFact:'Raízes profundíssimas'            }, biome:{ name:'Caatinga', tier:1 } },
  { id:'14', posX:25, posY:70, plantedAt:'2024-03-02', tree:{ commonName:'Juazeiro',   scientificName:'Ziziphus joazeiro',       rarity:'lendario', funFact:'Árvore lendária do Nordeste'      }, biome:{ name:'Caatinga', tier:1 } },
]

export default function PreviewForestPage() {
  return (
    <ForestMap
      userId="preview"
      forest={MOCK_FOREST}
      biomes={[]}
      co2Kg={387.2}
      currentTier={1}
      totalPoints={8500}
    />
  )
}

'use client'

import { useState, useMemo } from 'react'
import { TreeSprite } from '@/components/forest/TreeSprite'

/* ─────────────────────────────────────────────
   BIOME PALETTES (pixel art)
───────────────────────────────────────────── */
type BiomeKey = 'caatinga' | 'cerrado' | 'mata-atlantica' | 'pantanal' | 'amazonia'

const BIOME: Record<BiomeKey, { main:string; dark:string; light:string; name:string }> = {
  caatinga:       { main:'#C8A96E', dark:'#A07840', light:'#DFC090', name:'Caatinga'       },
  cerrado:         { main:'#8FAD5A', dark:'#6A8A35', light:'#AECB72', name:'Cerrado'        },
  'mata-atlantica':{ main:'#4A8C3F', dark:'#2D6B28', light:'#6DB560', name:'Mata Atlântica' },
  pantanal:        { main:'#5A9E7A', dark:'#3A7A58', light:'#7DC49A', name:'Pantanal'       },
  amazonia:        { main:'#2D7A3A', dark:'#1A5A25', light:'#4AAA55', name:'Amazônia'       },
}

const TIER_BIOME: Record<number, BiomeKey> = {
  1:'caatinga', 2:'cerrado', 3:'mata-atlantica', 4:'pantanal', 5:'amazonia',
}

/* ─────────────────────────────────────────────
   GRID SIZES by points
───────────────────────────────────────────── */
function gridSize(pts: number) {
  if (pts < 3000)  return { cols:5, rows:4 }
  if (pts < 6000)  return { cols:6, rows:5 }
  if (pts < 10000) return { cols:8, rows:6 }
  return { cols:10, rows:7 }
}

/* ─────────────────────────────────────────────
   SPRITE LOOKUP
───────────────────────────────────────────── */
const SPRITE_DIMS: Record<string, Record<string, [number, number]>> = {
  mandacaru:    { pequeno: [161,237],  medio:  [212,384],  grande: [326,559]  },
  buriti:       { pequeno: [189,204],  medio:  [277,408],  grande: [383,536]  },
  ipe:          { pequeno: [213,415],  medio:  [304,556]                      },
  araucaria:    { pequena: [266,534],  media:  [266,520],  grande: [679,1024] },
  'pau brasil': { pequeno: [153,213],  medio:  [294,486],  grande: [505,739]  },
}

function norm(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim()
}

function spriteKey(name: string): string | null {
  const n = norm(name)
  if (n.includes('mandacaru'))                           return 'mandacaru'
  if (n.includes('buriti'))                              return 'buriti'
  if (n.includes('ipe') || n.includes('ipê'))            return 'ipe'
  if (n.includes('araucaria') || n.includes('araucária')) return 'araucaria'
  if (n.includes('pau brasil') || n.includes('pau-brasil')) return 'pau brasil'
  return null
}

function sizeLabel(key: string, rarity: string): string {
  const fem = key === 'araucaria'
  if (rarity === 'epico' || rarity === 'lendario') return 'grande'
  if (rarity === 'raro')   return fem ? 'media' : 'medio'
  return fem ? 'pequena' : 'pequeno'
}

function getSprite(name: string, rarity: string) {
  const key   = spriteKey(name)
  if (!key) return null
  const label = sizeLabel(key, rarity)
  const dims  = SPRITE_DIMS[key]?.[label]
  if (!dims) return null
  return { src:`/sprites/${key} ${label}.png`, w:dims[0], h:dims[1] }
}

/* ─────────────────────────────────────────────
   DECORATIVE SPRITES
───────────────────────────────────────────── */
const DECOS = ['arbusto','cacto','barril','galho']

function decoStyle(idx: number, decoIdx: number) {
  const left = ((idx * 37 + decoIdx * 61) % 80) + 10
  const top  = ((idx * 53 + decoIdx * 41) % 70) + 15
  return {
    position:'absolute' as const,
    left:`${left}%`, top:`${top}%`,
    width:24, height:24,
    imageRendering:'pixelated' as const,
    pointerEvents:'none' as const,
    opacity: 0.7,
  }
}

function hasDeco(idx: number) {
  return idx % 3 !== 0 // 2/3 das células vazias têm deco
}

/* ─────────────────────────────────────────────
   TOOLTIP COMPONENT
───────────────────────────────────────────── */
function TreeTooltip({ entry, onClose }: { entry: any; onClose: () => void }) {
  const rarity = entry.tree?.rarity ?? 'comum'
  return (
    <div style={{
      position:'absolute', top:'8%', left:'50%', transform:'translateX(-50%)',
      background:'rgba(255,253,240,0.98)',
      border:'2px solid #5a3e1b',
      borderRadius:8, padding:'12px 16px',
      boxShadow:'0 4px 16px rgba(0,0,0,0.35)',
      zIndex:200, minWidth:180, maxWidth:240,
      fontFamily:'monospace, monospace',
    }}>
      <button
        onClick={onClose}
        style={{ position:'absolute', top:6, right:8, background:'none', border:'none', cursor:'pointer', fontSize:14, color:'#888' }}
      >✕</button>
      <div style={{ fontWeight:'bold', color:'#2d5016', fontSize:15, marginBottom:2 }}>
        {entry.tree?.commonName ?? 'Árvore'}
      </div>
      <div style={{ fontSize:11, color:'#888', fontStyle:'italic', marginBottom:6 }}>
        {entry.tree?.scientificName}
      </div>
      <div style={{ fontSize:12, color:'#444', marginBottom:8, lineHeight:1.4 }}>
        {entry.tree?.funFact ?? 'Uma árvore magnificent.'}
      </div>
      <div style={{ display:'flex', gap:4 }}>
        <span style={{
          fontSize:11, padding:'2px 8px', borderRadius:12,
          background: rarity==='lendario'?'#e9d5ff':rarity==='epico'?'#fed7aa':rarity==='raro'?'#dbeafe':'#e5e7eb',
          color:      rarity==='lendario'?'#7c3aed':rarity==='epico'?'#ea580c':rarity==='raro'?'#2563eb':'#374151',
          fontWeight:600,
        }}>
          {rarity}
        </span>
        <span style={{ fontSize:11, color:'#888', alignSelf:'center' }}>
          🌿 {entry.tree?.co2Absorption ?? 22} kg CO₂/ano
        </span>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   GRID CELL
───────────────────────────────────────────── */
function GridCell({
  entry, idx, biome, cellW, cellH,
}: {
  entry: any | null
  idx: number
  biome: BiomeKey
  cellW: number
  cellH: number
}) {
  const [showTip, setShowTip] = useState(false)
  const colors = BIOME[biome]
  const isEven = idx % 2 === 0

  const cellStyle: React.CSSProperties = {
    position:'relative',
    overflow:'hidden',
    background: isEven ? colors.main : colors.light,
    boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.12)',
    cursor: entry ? 'pointer' : 'default',
  }

  // Bottom soil strip (darker)
  const soilH = Math.max(6, cellH * 0.18)

  return (
    <div style={cellStyle} onClick={() => entry && setShowTip(p => !p)}>
      {/* Soil bottom */}
      <div style={{
        position:'absolute', bottom:0, left:0, right:0, height: soilH,
        background: colors.dark,
        opacity: 0.4,
      }} />

      {/* Decorative sprites on empty cells */}
      {!entry && hasDeco(idx) && (
        <>
          <img
            src={`/deco-sprites/${DECOS[idx % 2]}.png`}
            alt=""
            style={decoStyle(idx, 0)}
            onError={e => { (e.target as HTMLImageElement).style.display='none' }}
          />
          {idx % 5 === 1 && (
            <img
              src={`/deco-sprites/${DECOS[(idx+2) % 4]}.png`}
              alt=""
              style={decoStyle(idx, 1)}
              onError={e => { (e.target as HTMLImageElement).style.display='none' }}
            />
          )}
        </>
      )}

      {/* Tree sprite */}
      {entry && (() => {
        const name    = entry.tree?.commonName ?? ''
        const rarity  = entry.tree?.rarity ?? 'comum'
        const sp      = getSprite(name, rarity)
        const treeH   = cellH * 0.80
        const treeW   = sp ? Math.round(treeH * sp.w / sp.h) : 0

        return (
          <div style={{
            position:'absolute',
            bottom:0, left:'50%', transform:'translateX(-50%)',
            height: treeH,
            display:'flex', alignItems:'flex-end', justifyContent:'center',
          }}>
            {sp ? (
              <img
                src={sp.src}
                alt={name}
                draggable={false}
                style={{
                  height: treeH,
                  width: 'auto',
                  objectFit:'contain',
                  objectPosition:'bottom center',
                  imageRendering:'pixelated',
                  display:'block',
                  userSelect:'none',
                }}
              />
            ) : (
              <TreeSprite
                species={name}
                biome={biome}
                rarity={rarity as any}
                size={Math.round(treeH * 0.65)}
                animated={rarity === 'epico' || rarity === 'lendario'}
              />
            )}
          </div>
        )
      })()}

      {/* Tooltip */}
      {entry && showTip && <TreeTooltip entry={entry} onClose={() => setShowTip(false)} />}
    </div>
  )
}

/* ─────────────────────────────────────────────
   FOREST MAP
───────────────────────────────────────────── */
interface ForestMapProps {
  userId: string
  forest:  any[]
  biomes:  any[]
  co2Kg:   number
  currentTier: number
  totalPoints: number
}

export function ForestMap({ forest, co2Kg, currentTier, totalPoints }: ForestMapProps) {
  const biomeKey = TIER_BIOME[currentTier] ?? 'caatinga'
  const biome    = BIOME[biomeKey]
  const { cols, rows } = useMemo(() => gridSize(totalPoints), [totalPoints])

  // Pad forest to fill grid
  const cells = useMemo(() => {
    const result: (typeof forest)[number][] = [...forest]
    while (result.length < cols * rows) result.push(null)
    return result
  }, [forest, cols, rows])

  return (
    <div style={{
      width:'100vw', height:'100vh',
      display:'flex', flexDirection:'column',
      background: biome.main,
      overflow:'hidden',
      fontFamily:'monospace, monospace',
    }}>
      {/* ── HUD TOP BAR ── */}
      <div style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'8px 16px',
        background:'rgba(0,0,0,0.45)',
        color:'white',
        fontSize:12,
        flexShrink:0,
        gap:12,
      }}>
        {/* Left: biome + points */}
        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          <span style={{ fontWeight:'bold', fontSize:15 }}>🌳 Floresta</span>
          <span style={{ color:'#a8e6a3' }}>{biome.name}</span>
          <span>💰 {totalPoints.toLocaleString()} pts</span>
        </div>
        {/* Right: stats */}
        <div style={{ display:'flex', gap:12 }}>
          <span>🌱 {forest.length} árvores</span>
          <span>🌿 {co2Kg.toFixed(1)} kg CO₂</span>
          <span style={{ color:'#aecb72' }}>Grid {cols}×{rows}</span>
        </div>
      </div>

      {/* ── CSS GRID ── */}
      <div style={{
        flex:1,
        display:'grid',
        gridTemplateColumns:`repeat(${cols}, 1fr)`,
        gridTemplateRows:`repeat(${rows}, 1fr)`,
      }}>
        {cells.map((entry, idx) => (
          <GridCell
            key={entry?.id ?? `empty-${idx}`}
            entry={entry}
            idx={idx}
            biome={biomeKey}
            cellW={0}
            cellH={0}
          />
        ))}
      </div>
    </div>
  )
}
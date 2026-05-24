'use client'

import { useState, useMemo } from 'react'
import { CO2Counter } from '@/components/ui/CO2Counter'
import { TreeShop } from '@/components/shop/TreeShop'
import { TreeSprite } from '@/components/forest/TreeSprite'

/* ─────────────────────────────────────────────
   TILE GROUND CONSTANTS (px)
───────────────────────────────────────────── */
const EDGE_H    =  4   // top highlight stripe
const SURFACE_H = 38   // main textured soil
const SUBSOIL_H = 13   // dark bottom stripe
const GROUND_H  = EDGE_H + SURFACE_H + SUBSOIL_H  // 55 px total

/* ─────────────────────────────────────────────
   GRID PRESETS
───────────────────────────────────────────── */
const GRID = {
  small:  { cols: 4, rows: 3 },   // ≤ 12 trees
  medium: { cols: 6, rows: 4 },   // ≤ 24 trees
  large:  { cols: 8, rows: 5 },   // ≤ 40 trees
  xlarge: { cols: 10, rows: 6 },  // ≤ 60 trees
} as const
type GridPreset = keyof typeof GRID

function gridPresetFor(count: number): GridPreset {
  if (count < GRID.small.cols  * GRID.small.rows)  return 'small'
  if (count < GRID.medium.cols * GRID.medium.rows) return 'medium'
  if (count < GRID.large.cols  * GRID.large.rows)  return 'large'
  return 'xlarge'
}

/* ─────────────────────────────────────────────
   TREE SIZE + PLANT DEPTH PER RARITY
───────────────────────────────────────────── */
const RARITY_CFG: Record<string, { size: number; depth: number }> = {
  comum:    { size:  58, depth:  6 },
  incomum:  { size:  72, depth:  9 },
  raro:     { size:  88, depth: 10 },
  epico:    { size: 106, depth: 12 },
  lendario: { size: 132, depth: 16 },
}

/* ─────────────────────────────────────────────
   BIOME TERRAIN CONFIG
───────────────────────────────────────────── */
type BiomeKey = 'caatinga' | 'cerrado' | 'mata-atlantica' | 'pantanal' | 'amazonia'

interface TerrainCfg {
  displayName:  string
  skyGradient:  string
  surfaceColor: string
  subsoilColor: string
  edgeColor:    string
  emptyColor:   string   // tint for empty-slot indicator
  detail:       'pebbles' | 'sparse-grass' | 'dense-grass' | 'puddles' | 'roots'
}

const TERRAIN: Record<BiomeKey, TerrainCfg> = {
  caatinga: {
    displayName:  'Caatinga',
    skyGradient:  'linear-gradient(to bottom,#B8621A 0%,#E08A3A 40%,#F5C060 100%)',
    surfaceColor: '#C8A96E',
    subsoilColor: '#8B6914',
    edgeColor:    '#DFBA7A',
    emptyColor:   '#F5C060',
    detail:       'pebbles',
  },
  cerrado: {
    displayName:  'Cerrado',
    skyGradient:  'linear-gradient(to bottom,#2E6CA0 0%,#5AA0D0 50%,#A8D0EE 100%)',
    surfaceColor: '#8B7355',
    subsoilColor: '#6B4E10',
    edgeColor:    '#9D8462',
    emptyColor:   '#A8D0EE',
    detail:       'sparse-grass',
  },
  'mata-atlantica': {
    displayName:  'Mata Atlântica',
    skyGradient:  'linear-gradient(to bottom,#0A3258 0%,#145898 50%,#3882BE 100%)',
    surfaceColor: '#4A7C3F',
    subsoilColor: '#2E5A1C',
    edgeColor:    '#5C9C50',
    emptyColor:   '#5CB870',
    detail:       'dense-grass',
  },
  pantanal: {
    displayName:  'Pantanal',
    skyGradient:  'linear-gradient(to bottom,#1E5878 0%,#409AC6 50%,#88C8E8 100%)',
    surfaceColor: '#5B8A4A',
    subsoilColor: '#3A6B2A',
    edgeColor:    '#6C9A5C',
    emptyColor:   '#88C8E8',
    detail:       'puddles',
  },
  amazonia: {
    displayName:  'Amazônia',
    skyGradient:  'linear-gradient(to bottom,#021020 0%,#062840 60%,#0C4468 100%)',
    surfaceColor: '#2D5A1C',
    subsoilColor: '#1A3D0E',
    edgeColor:    '#3E7828',
    emptyColor:   '#3AAA50',
    detail:       'roots',
  },
}

const TIER_BIOME: Record<number, BiomeKey> = {
  1: 'caatinga', 2: 'cerrado', 3: 'mata-atlantica', 4: 'pantanal', 5: 'amazonia',
}

function toBiomeKey(name: string): BiomeKey {
  const n = name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  if (n.includes('caatinga'))  return 'caatinga'
  if (n.includes('cerrado'))   return 'cerrado'
  if (n.includes('mata'))      return 'mata-atlantica'
  if (n.includes('pantanal'))  return 'pantanal'
  if (n.includes('amaz'))      return 'amazonia'
  return 'cerrado'
}

/* ─────────────────────────────────────────────
   GROUND TEXTURE OVERLAY (fills the surface div)
───────────────────────────────────────────── */
function GroundTexture({ detail }: { detail: TerrainCfg['detail'] }) {
  if (detail === 'pebbles') {
    const stones = Array.from({ length: 14 }, (_, i) => ({
      cx: ((i * 137 + 23) % 92) + 4,
      cy: 20 + (i % 4) * 20,
      rx: 1.2 + (i % 3) * 0.6,
      ry: 0.7 + (i % 2) * 0.4,
    }))
    return (
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0 }}>
        {stones.map((s, i) => (
          <ellipse key={i} cx={`${s.cx}%`} cy={`${s.cy}%`}
            rx={s.rx} ry={s.ry} fill="rgba(70,44,4,0.32)" />
        ))}
      </svg>
    )
  }
  if (detail === 'sparse-grass') {
    const blades = Array.from({ length: 16 }, (_, i) => ({
      x: ((i * 153 + 7) % 90) + 5,
      lean: ((i % 3) - 1) * 3,
      h: 10 + (i % 4) * 4,
    }))
    return (
      <svg width="100%" height="100%" viewBox="0 0 100 30" preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0 }}>
        {blades.map((b, i) => (
          <path key={i}
            d={`M${b.x},30 Q${b.x + b.lean / 2},${30 - b.h / 2} ${b.x + b.lean},${30 - b.h}`}
            stroke="#7A6028" strokeWidth="0.9" fill="none" opacity="0.55" />
        ))}
      </svg>
    )
  }
  if (detail === 'dense-grass') {
    const blades = Array.from({ length: 22 }, (_, i) => ({
      x: ((i * 113 + 5) % 92) + 4,
      lean: ((i % 5) - 2) * 2.5,
      h: 12 + (i % 4) * 5,
    }))
    return (
      <svg width="100%" height="100%" viewBox="0 0 100 30" preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0 }}>
        {blades.map((b, i) => (
          <path key={i}
            d={`M${b.x},30 Q${b.x + b.lean / 2},${30 - b.h / 2} ${b.x + b.lean},${30 - b.h}`}
            stroke="#2C7025" strokeWidth="1.1" fill="none" opacity="0.65" />
        ))}
      </svg>
    )
  }
  if (detail === 'puddles') {
    const puddles = Array.from({ length: 5 }, (_, i) => ({
      cx: ((i * 197 + 13) % 80) + 10,
      cy: 30 + (i % 3) * 25,
    }))
    return (
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0 }}>
        {puddles.map((p, i) => (
          <ellipse key={i} cx={`${p.cx}%`} cy={`${p.cy}%`}
            rx={3 + (i % 3)} ry={1.4} fill="rgba(80,148,210,0.28)" />
        ))}
      </svg>
    )
  }
  // roots
  return (
    <svg width="100%" height="100%" viewBox="0 0 100 30" preserveAspectRatio="none"
      style={{ position: 'absolute', inset: 0 }}>
      <path d="M4,30 Q18,10 36,22 Q56,2 74,16 Q86,5 97,12"
        stroke="#183C0C" strokeWidth="1.6" fill="none" opacity="0.4" />
      <path d="M10,30 Q24,16 44,24 Q62,8 78,20 Q88,12 96,18"
        stroke="#183C0C" strokeWidth="1" fill="none" opacity="0.3" />
    </svg>
  )
}

/* ─────────────────────────────────────────────
   COVER STRIP — biome vegetation over tree base
───────────────────────────────────────────── */
function CoverStrip({ detail, surfaceColor }: { detail: TerrainCfg['detail']; surfaceColor: string }) {
  const blades = Array.from({ length: 7 }, (_, i) => ({
    x: i * 14 + 5,
    lean: ((i % 3) - 1) * 5,
  }))
  const bg = <rect width="100" height="100" fill={surfaceColor} />

  if (detail === 'dense-grass') {
    return (
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0 }}>
        {bg}
        {blades.map((b, i) => (
          <path key={i} d={`M${b.x},100 Q${b.x + b.lean / 2},50 ${b.x + b.lean},10`}
            stroke="#2C7025" strokeWidth="2.5" fill="none" opacity="0.7" />
        ))}
      </svg>
    )
  }
  if (detail === 'sparse-grass') {
    return (
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0 }}>
        {bg}
        {blades.map((b, i) => (
          <path key={i} d={`M${b.x},100 Q${b.x + b.lean / 2},55 ${b.x + b.lean},15`}
            stroke="#7A6028" strokeWidth="2" fill="none" opacity="0.6" />
        ))}
      </svg>
    )
  }
  if (detail === 'roots') {
    return (
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0 }}>
        {bg}
        <path d="M10,100 Q32,55 58,78 Q72,36 92,62"
          stroke="#183C0C" strokeWidth="3" fill="none" opacity="0.45" />
      </svg>
    )
  }
  if (detail === 'puddles') {
    return (
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0 }}>
        {bg}
        <ellipse cx="50" cy="55" rx="22" ry="7" fill="rgba(80,148,210,0.22)" />
      </svg>
    )
  }
  return <div style={{ position: 'absolute', inset: 0, background: surfaceColor }} />
}

/* ─────────────────────────────────────────────
   GROUND TILE — bottom of each grid cell
───────────────────────────────────────────── */
function GroundTile({ terrain, isEmpty }: { terrain: TerrainCfg; isEmpty: boolean }) {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {/* Top edge highlight */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: EDGE_H,
        background: terrain.edgeColor,
      }} />
      {/* Surface */}
      <div style={{
        position: 'absolute', top: EDGE_H, left: 0, right: 0,
        bottom: SUBSOIL_H,
        background: terrain.surfaceColor,
        overflow: 'hidden',
      }}>
        <GroundTexture detail={terrain.detail} />
      </div>
      {/* Subsoil */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: SUBSOIL_H,
        background: terrain.subsoilColor,
      }} />
      {/* Right cell border */}
      <div style={{
        position: 'absolute', inset: 0,
        borderRight: '1px solid rgba(0,0,0,0.12)',
        pointerEvents: 'none',
      }} />
    </div>
  )
}

/* ─────────────────────────────────────────────
   FOREST CELL — one tile in the grid
───────────────────────────────────────────── */
interface PlantedTree {
  commonName: string
  scientificName: string
  rarity: string
  funFact?: string
}

function ForestCell({
  tree,
  biomeName,
  biomeKey,
  terrain,
  rowDepth,
}: {
  tree?: PlantedTree
  biomeName: string
  biomeKey: BiomeKey
  terrain: TerrainCfg
  rowDepth: number   // higher = front row = higher z-index
}) {
  const rarity = tree?.rarity ?? 'comum'
  const cfg    = RARITY_CFG[rarity] ?? RARITY_CFG.comum
  const z      = rowDepth * 10   // front rows on top

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      overflow: 'visible',   // trees may extend above cell top
    }}>

      {/* ── Shadow ellipse ── */}
      {tree && (
        <div style={{
          position: 'absolute',
          bottom: GROUND_H + 1,
          left: '50%',
          transform: 'translate(-50%, 50%)',
          width: Math.round(cfg.size * 0.68),
          height: 7,
          background: 'rgba(0,0,0,0.20)',
          borderRadius: '50%',
          filter: 'blur(3px)',
          zIndex: z + 2,
          pointerEvents: 'none',
        }} />
      )}

      {/* ── Tree sprite ── */}
      {tree && (
        <div
          style={{
            position: 'absolute',
            bottom: GROUND_H - cfg.depth,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: z + 3,
            cursor: 'pointer',
          }}
          title={[tree.commonName, tree.scientificName, tree.funFact]
            .filter(Boolean).join('\n')}
        >
          <TreeSprite
            species={tree.commonName}
            biome={biomeKey}
            rarity={rarity as any}
            size={cfg.size}
            animated={rarity === 'epico' || rarity === 'lendario'}
          />
        </div>
      )}

      {/* ── Cover strip — buries tree base in ground ── */}
      {tree && (
        <div style={{
          position: 'absolute',
          bottom: GROUND_H - cfg.depth,
          left: '50%',
          transform: 'translateX(-50%)',
          width: cfg.size,
          height: cfg.depth,
          zIndex: z + 4,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}>
          <CoverStrip detail={terrain.detail} surfaceColor={terrain.surfaceColor} />
        </div>
      )}

      {/* ── Ground tile ── */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: GROUND_H,
        zIndex: z + 1,
      }}>
        <GroundTile terrain={terrain} isEmpty={!tree} />
      </div>

      {/* ── Empty slot indicator ── */}
      {!tree && (
        <div style={{
          position: 'absolute',
          bottom: GROUND_H + 12,
          left: '50%',
          transform: 'translateX(-50%)',
          color: `${terrain.emptyColor}55`,
          fontSize: 22,
          lineHeight: 1,
          userSelect: 'none',
          pointerEvents: 'none',
          zIndex: z + 1,
        }}>
          +
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────
   FOREST MAP — main export
───────────────────────────────────────────── */
interface ForestMapProps {
  userId: string
  forest: any[]
  biomes: any[]
  co2Kg: number
  currentTier: number
  totalPoints: number
}

export function ForestMap({ forest, co2Kg, currentTier, totalPoints }: ForestMapProps) {
  const [showShop, setShowShop] = useState(false)

  const biomeKey = TIER_BIOME[currentTier] ?? 'caatinga'
  const terrain  = TERRAIN[biomeKey]

  // Sort by plantedAt (oldest first) to fill grid top-left → bottom-right
  const sortedForest = useMemo(
    () => [...forest].sort((a, b) =>
      new Date(a.plantedAt ?? 0).getTime() - new Date(b.plantedAt ?? 0).getTime()
    ),
    [forest],
  )

  const preset       = gridPresetFor(sortedForest.length)
  const { cols, rows } = GRID[preset]
  const totalCells   = cols * rows

  // Build cell array: planted trees fill slots in order, rest are empty
  const cells = Array.from({ length: totalCells }, (_, i) =>
    sortedForest[i]?.tree ?? null
  )

  const planted  = sortedForest.length
  const capacity = totalCells

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100vh',
      overflow: 'hidden',
      background: terrain.skyGradient,
    }}>

      {/* ── HUD top-left ── */}
      <div className="absolute top-4 left-4 z-[500] bg-black/35 backdrop-blur-sm rounded-xl px-4 py-3 select-none">
        <p className="font-bold text-white text-base leading-tight">{terrain.displayName}</p>
        <p className="text-xs text-white/75 mt-0.5">{totalPoints} pontos</p>
        <p className="text-xs text-white/60 mt-0.5">{planted}/{capacity} árvores</p>
      </div>

      {/* ── HUD top-right ── */}
      <div className="absolute top-4 right-4 z-[500]">
        <CO2Counter value={co2Kg} />
      </div>

      {/* ── Grid ── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}>
        {cells.map((tree, idx) => {
          const row     = Math.floor(idx / cols)
          const rowDepth = row + 1   // row 0 = back, row (rows-1) = front

          return (
            <ForestCell
              key={idx}
              tree={tree ?? undefined}
              biomeName={terrain.displayName}
              biomeKey={biomeKey}
              terrain={terrain}
              rowDepth={rowDepth}
            />
          )
        })}
      </div>

      {/* ── Shop button ── */}
      <button
        onClick={() => setShowShop(true)}
        className="absolute bottom-6 right-6 z-[500] bg-green-600 hover:bg-green-500 text-white px-5 py-2.5 rounded-full shadow-lg transition-colors font-medium"
      >
        🛒 Plantar Árvore
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

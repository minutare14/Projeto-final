'use client'

import { useState, useMemo } from 'react'
import { CO2Counter } from '@/components/ui/CO2Counter'
import { TreeShop } from '@/components/shop/TreeShop'
import { TreeSprite } from '@/components/forest/TreeSprite'

/* ─────────────────────────────────────────────
   TILE GROUND CONSTANTS (px)
───────────────────────────────────────────── */
const EDGE_H    =  4
const SURFACE_H = 38
const SUBSOIL_H = 13
const GROUND_H  = EDGE_H + SURFACE_H + SUBSOIL_H   // 55 px

/* ─────────────────────────────────────────────
   GRID PRESETS
───────────────────────────────────────────── */
const GRID = {
  small:  { cols: 4, rows: 3 },
  medium: { cols: 6, rows: 4 },
  large:  { cols: 8, rows: 5 },
  xlarge: { cols: 10, rows: 6 },
} as const
type GridPreset = keyof typeof GRID

function gridPresetFor(n: number): GridPreset {
  if (n < GRID.small.cols  * GRID.small.rows)  return 'small'
  if (n < GRID.medium.cols * GRID.medium.rows) return 'medium'
  if (n < GRID.large.cols  * GRID.large.rows)  return 'large'
  return 'xlarge'
}

/* ─────────────────────────────────────────────
   PNG SPRITE LOOKUP
   Files in /public/sprites/:
     mandacaru  pequeno/medio/grande
     buriti     pequeno/medio/grande
     ipe        pequeno/medio          (no grande)
     araucaria  pequena/media/grande   (feminine)
     pau brasil pequeno/medio/grande
───────────────────────────────────────────── */

// Natural dimensions (px) — used to compute rendered width from target height
const SPRITE_DIMS: Record<string, Record<string, [number, number]>> = {
  mandacaru:   { pequeno: [161, 237],  medio:  [212, 384],  grande: [326, 559]  },
  buriti:      { pequeno: [189, 204],  medio:  [277, 408],  grande: [383, 536]  },
  ipe:         { pequeno: [213, 415],  medio:  [304, 556]                       },
  araucaria:   { pequena: [266, 534],  media:  [266, 520],  grande: [679, 1024] },
  'pau brasil':{ pequeno: [153, 213],  medio:  [294, 486],  grande: [505, 739]  },
}

function normalizeName(name: string) {
  return name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim()
}

function spriteKey(commonName: string): string | null {
  const n = normalizeName(commonName)
  if (n.includes('mandacaru'))               return 'mandacaru'
  if (n.includes('buriti'))                  return 'buriti'
  if (n.includes('ipe') || n.includes('ipê'))return 'ipe'
  if (n.includes('araucaria'))               return 'araucaria'
  if (n.includes('pau brasil') || n.includes('pau-brasil')) return 'pau brasil'
  return null
}

function sizeLabel(key: string, rarity: string): string {
  const isFem = key === 'araucaria'
  if (rarity === 'epico' || rarity === 'lendario') return 'grande'
  if (rarity === 'raro')   return isFem ? 'media'   : 'medio'
  /* comum / incomum */    return isFem ? 'pequena'  : 'pequeno'
}

interface SpriteInfo {
  src: string          // URL
  naturalW: number
  naturalH: number
}

function getSpriteInfo(commonName: string, rarity: string): SpriteInfo | null {
  const key   = spriteKey(commonName)
  if (!key) return null
  const label = sizeLabel(key, rarity)
  const dims  = SPRITE_DIMS[key]?.[label]
  if (!dims) return null
  return { src: `/sprites/${key} ${label}.png`, naturalW: dims[0], naturalH: dims[1] }
}

/* ─────────────────────────────────────────────
   TREE SIZE + PLANT DEPTH PER RARITY
───────────────────────────────────────────── */
const RARITY_CFG: Record<string, { height: number; depth: number }> = {
  comum:    { height:  80, depth:  6 },
  incomum:  { height: 100, depth:  9 },
  raro:     { height: 120, depth: 10 },
  epico:    { height: 145, depth: 12 },
  lendario: { height: 175, depth: 16 },
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
  emptyColor:   string
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
  const n = normalizeName(name)
  if (n.includes('caatinga'))  return 'caatinga'
  if (n.includes('cerrado'))   return 'cerrado'
  if (n.includes('mata'))      return 'mata-atlantica'
  if (n.includes('pantanal'))  return 'pantanal'
  if (n.includes('amaz'))      return 'amazonia'
  return 'cerrado'
}

/* ─────────────────────────────────────────────
   GROUND TEXTURE
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
   COVER STRIP
───────────────────────────────────────────── */
function CoverStrip({ detail, surfaceColor }: { detail: TerrainCfg['detail']; surfaceColor: string }) {
  const blades = Array.from({ length: 7 }, (_, i) => ({ x: i * 14 + 5, lean: ((i % 3) - 1) * 5 }))
  const bg = <rect width="100" height="100" fill={surfaceColor} />
  if (detail === 'dense-grass') return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
      {bg}{blades.map((b, i) => <path key={i} d={`M${b.x},100 Q${b.x + b.lean / 2},50 ${b.x + b.lean},10`} stroke="#2C7025" strokeWidth="2.5" fill="none" opacity="0.7" />)}
    </svg>
  )
  if (detail === 'sparse-grass') return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
      {bg}{blades.map((b, i) => <path key={i} d={`M${b.x},100 Q${b.x + b.lean / 2},55 ${b.x + b.lean},15`} stroke="#7A6028" strokeWidth="2" fill="none" opacity="0.6" />)}
    </svg>
  )
  if (detail === 'roots') return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
      {bg}<path d="M10,100 Q32,55 58,78 Q72,36 92,62" stroke="#183C0C" strokeWidth="3" fill="none" opacity="0.45" />
    </svg>
  )
  return <div style={{ position: 'absolute', inset: 0, background: surfaceColor }} />
}

/* ─────────────────────────────────────────────
   GROUND TILE
───────────────────────────────────────────── */
function GroundTile({ terrain }: { terrain: TerrainCfg }) {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: EDGE_H, background: terrain.edgeColor }} />
      <div style={{ position: 'absolute', top: EDGE_H, left: 0, right: 0, bottom: SUBSOIL_H, background: terrain.surfaceColor, overflow: 'hidden' }}>
        <GroundTexture detail={terrain.detail} />
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: SUBSOIL_H, background: terrain.subsoilColor }} />
      <div style={{ position: 'absolute', inset: 0, borderRight: '1px solid rgba(0,0,0,0.12)', pointerEvents: 'none' }} />
    </div>
  )
}

/* ─────────────────────────────────────────────
   TREE RENDERER — PNG sprite or SVG fallback
───────────────────────────────────────────── */
function TreeImage({
  commonName, biomeKey, rarity, targetHeight,
}: {
  commonName: string
  biomeKey: BiomeKey
  rarity: string
  targetHeight: number
}) {
  const info = getSpriteInfo(commonName, rarity)

  if (info) {
    const renderedW = Math.round(targetHeight * info.naturalW / info.naturalH)
    return (
      <img
        src={info.src}
        alt={commonName}
        draggable={false}
        style={{
          height: targetHeight,
          width: renderedW,
          display: 'block',
          imageRendering: 'auto',
          userSelect: 'none',
        }}
      />
    )
  }

  // SVG fallback — TreeSprite uses width as `size`
  return (
    <TreeSprite
      species={commonName}
      biome={biomeKey}
      rarity={rarity as any}
      size={Math.round(targetHeight * 0.65)}
      animated={rarity === 'epico' || rarity === 'lendario'}
    />
  )
}

/* ─────────────────────────────────────────────
   FOREST CELL
───────────────────────────────────────────── */
interface PlantedTree {
  commonName: string
  scientificName: string
  rarity: string
  funFact?: string
}

function ForestCell({
  tree, biomeKey, terrain, rowDepth,
}: {
  tree?: PlantedTree
  biomeKey: BiomeKey
  terrain: TerrainCfg
  rowDepth: number
}) {
  const rarity  = tree?.rarity ?? 'comum'
  const cfg     = RARITY_CFG[rarity] ?? RARITY_CFG.comum
  const z       = rowDepth * 10

  // Compute rendered width of PNG sprite for shadow sizing
  const info       = tree ? getSpriteInfo(tree.commonName, rarity) : null
  const shadowW    = info
    ? Math.round(cfg.height * info.naturalW / info.naturalH * 0.65)
    : Math.round(cfg.height * 0.5)
  const coverW     = info
    ? Math.round(cfg.height * info.naturalW / info.naturalH)
    : Math.round(cfg.height * 0.65)

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'visible' }}>

      {/* Shadow ellipse */}
      {tree && (
        <div style={{
          position: 'absolute',
          bottom: GROUND_H + 1,
          left: '50%',
          transform: 'translate(-50%, 50%)',
          width: shadowW,
          height: 7,
          background: 'rgba(0,0,0,0.22)',
          borderRadius: '50%',
          filter: 'blur(3px)',
          zIndex: z + 2,
          pointerEvents: 'none',
        }} />
      )}

      {/* Tree sprite (PNG or SVG) */}
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
          title={[tree.commonName, tree.scientificName, tree.funFact].filter(Boolean).join('\n')}
        >
          <TreeImage
            commonName={tree.commonName}
            biomeKey={biomeKey}
            rarity={rarity}
            targetHeight={cfg.height}
          />
        </div>
      )}

      {/* Cover strip — buries the sprite base in the ground */}
      {tree && (
        <div style={{
          position: 'absolute',
          bottom: GROUND_H - cfg.depth,
          left: '50%',
          transform: 'translateX(-50%)',
          width: coverW,
          height: cfg.depth,
          zIndex: z + 4,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}>
          <CoverStrip detail={terrain.detail} surfaceColor={terrain.surfaceColor} />
        </div>
      )}

      {/* Ground tile */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: GROUND_H, zIndex: z + 1 }}>
        <GroundTile terrain={terrain} />
      </div>

      {/* Empty slot indicator */}
      {!tree && (
        <div style={{
          position: 'absolute',
          bottom: GROUND_H + 10,
          left: '50%',
          transform: 'translateX(-50%)',
          color: `${terrain.emptyColor}55`,
          fontSize: 22,
          userSelect: 'none',
          pointerEvents: 'none',
          zIndex: z + 1,
        }}>+</div>
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

  const sortedForest = useMemo(
    () => [...forest].sort((a, b) =>
      new Date(a.plantedAt ?? 0).getTime() - new Date(b.plantedAt ?? 0).getTime()
    ),
    [forest],
  )

  const preset         = gridPresetFor(sortedForest.length)
  const { cols, rows } = GRID[preset]
  const totalCells     = cols * rows

  const cells = Array.from({ length: totalCells }, (_, i) =>
    sortedForest[i]?.tree ?? null
  )

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100vh',
      overflow: 'hidden',
      background: terrain.skyGradient,
    }}>

      {/* HUD */}
      <div className="absolute top-4 left-4 z-[500] bg-black/35 backdrop-blur-sm rounded-xl px-4 py-3 select-none">
        <p className="font-bold text-white text-base leading-tight">{terrain.displayName}</p>
        <p className="text-xs text-white/75 mt-0.5">{totalPoints} pontos</p>
        <p className="text-xs text-white/60 mt-0.5">{sortedForest.length}/{totalCells} árvores</p>
      </div>
      <div className="absolute top-4 right-4 z-[500]">
        <CO2Counter value={co2Kg} />
      </div>

      {/* Grid */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}>
        {cells.map((tree, idx) => {
          const row = Math.floor(idx / cols)
          return (
            <ForestCell
              key={idx}
              tree={tree ?? undefined}
              biomeKey={biomeKey}
              terrain={terrain}
              rowDepth={row + 1}
            />
          )
        })}
      </div>

      {/* Shop */}
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

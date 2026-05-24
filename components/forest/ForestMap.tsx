'use client'

import { useState, useMemo } from 'react'
import { CO2Counter } from '@/components/ui/CO2Counter'
import { TreeShop } from '@/components/shop/TreeShop'
import { TreeSprite } from '@/components/forest/TreeSprite'

/* ── Ground layer heights (px) ── */
const SUBSOIL_H = 20  // dark bottom layer
const SURFACE_H = 30  // main textured layer
const EDGE_H    =  4  // bright top highlight
const GROUND_H  = SUBSOIL_H + SURFACE_H + EDGE_H  // 54 px total

/* ── Tree size + plant depth per rarity ── */
const RARITY_CFG: Record<string, { size: number; depth: number }> = {
  comum:    { size:  64, depth:  6 },
  incomum:  { size:  80, depth: 10 },
  raro:     { size:  96, depth: 10 },
  epico:    { size: 112, depth: 10 },
  lendario: { size: 140, depth: 16 },
}

/* ── Biome terrain palette ── */
type BiomeKey = 'caatinga' | 'cerrado' | 'mata-atlantica' | 'pantanal' | 'amazonia'

interface TerrainCfg {
  skyGradient:  string
  surfaceColor: string
  subsoilColor: string
  edgeColor:    string
  detail:       'pebbles' | 'sparse-grass' | 'dense-grass' | 'puddles' | 'roots'
  displayName:  string
}

const TERRAIN: Record<BiomeKey, TerrainCfg> = {
  caatinga: {
    displayName:  'Caatinga',
    skyGradient:  'linear-gradient(to bottom,#C4721A 0%,#E89E48 45%,#FFD070 100%)',
    surfaceColor: '#C8A96E',
    subsoilColor: '#8B6914',
    edgeColor:    '#DFBA7A',
    detail:       'pebbles',
  },
  cerrado: {
    displayName:  'Cerrado',
    skyGradient:  'linear-gradient(to bottom,#3A7CB0 0%,#6AAEDE 55%,#B8DCF4 100%)',
    surfaceColor: '#8B7355',
    subsoilColor: '#6B4E10',
    edgeColor:    '#9D8462',
    detail:       'sparse-grass',
  },
  'mata-atlantica': {
    displayName:  'Mata Atlântica',
    skyGradient:  'linear-gradient(to bottom,#0C3460 0%,#1860A0 55%,#3E90C4 100%)',
    surfaceColor: '#4A7C3F',
    subsoilColor: '#2E5A1C',
    edgeColor:    '#5A9C50',
    detail:       'dense-grass',
  },
  pantanal: {
    displayName:  'Pantanal',
    skyGradient:  'linear-gradient(to bottom,#246688 0%,#4E9EC4 55%,#94CCEA 100%)',
    surfaceColor: '#5B8A4A',
    subsoilColor: '#3A6B2A',
    edgeColor:    '#6C9A5C',
    detail:       'puddles',
  },
  amazonia: {
    displayName:  'Amazônia',
    skyGradient:  'linear-gradient(to bottom,#041828 0%,#083050 60%,#0E5075 100%)',
    surfaceColor: '#2D5A1C',
    subsoilColor: '#1A3D0E',
    edgeColor:    '#3E7828',
    detail:       'roots',
  },
}

const TIER_BIOME: Record<number, BiomeKey> = {
  1: 'caatinga', 2: 'cerrado', 3: 'mata-atlantica', 4: 'pantanal', 5: 'amazonia',
}

function toBiomeKey(name: string): BiomeKey {
  const n = name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  if (n.includes('caatinga'))             return 'caatinga'
  if (n.includes('cerrado'))              return 'cerrado'
  if (n.includes('mata') || n.includes('atlantica')) return 'mata-atlantica'
  if (n.includes('pantanal'))             return 'pantanal'
  if (n.includes('amaz'))                 return 'amazonia'
  return 'cerrado'
}

/* ── Ground surface texture (SVG overlay, fills the surface div) ── */
function GroundTexture({ detail }: { detail: TerrainCfg['detail'] }) {
  if (detail === 'pebbles') {
    const stones = Array.from({ length: 20 }, (_, i) => ({
      cx: ((i * 137 + 23) % 95) + 2,
      cy: 20 + (i % 4) * 22,
      rx: 1.2 + (i % 3) * 0.6,
      ry: 0.8 + (i % 2) * 0.4,
    }))
    return (
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0 }}>
        {stones.map((s, i) => (
          <ellipse key={i} cx={`${s.cx}%`} cy={`${s.cy}%`}
            rx={s.rx} ry={s.ry} fill="rgba(70,44,4,0.35)" />
        ))}
      </svg>
    )
  }
  if (detail === 'sparse-grass') {
    const blades = Array.from({ length: 18 }, (_, i) => ({
      x: ((i * 153 + 7) % 93) + 3,
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
    const blades = Array.from({ length: 24 }, (_, i) => ({
      x: ((i * 113 + 5) % 95) + 2,
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
    const puddles = Array.from({ length: 7 }, (_, i) => ({
      cx: ((i * 197 + 13) % 82) + 9,
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
  // roots (Amazônia)
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

/* ── Cover strip rendered over each tree's buried base ── */
function CoverStrip({ detail, surfaceColor }: { detail: TerrainCfg['detail']; surfaceColor: string }) {
  const blades = Array.from({ length: 8 }, (_, i) => ({
    x: i * 13 + 4,
    lean: ((i % 3) - 1) * 5,
    h: 65 + (i % 3) * 20,
  }))

  const base = (
    <rect width="100" height="100" fill={surfaceColor} />
  )

  if (detail === 'dense-grass') {
    return (
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0 }}>
        {base}
        {blades.map((b, i) => (
          <path key={i}
            d={`M${b.x},100 Q${b.x + b.lean / 2},${100 - b.h / 2} ${b.x + b.lean},${100 - b.h}`}
            stroke="#2C7025" strokeWidth="2.5" fill="none" opacity="0.7" />
        ))}
      </svg>
    )
  }
  if (detail === 'sparse-grass') {
    return (
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0 }}>
        {base}
        {blades.map((b, i) => (
          <path key={i}
            d={`M${b.x},100 Q${b.x + b.lean / 2},${100 - b.h / 2} ${b.x + b.lean},${100 - b.h}`}
            stroke="#7A6028" strokeWidth="2" fill="none" opacity="0.6" />
        ))}
      </svg>
    )
  }
  if (detail === 'roots') {
    return (
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0 }}>
        {base}
        <path d="M10,100 Q32,55 58,78 Q72,36 92,62"
          stroke="#183C0C" strokeWidth="3" fill="none" opacity="0.45" />
      </svg>
    )
  }
  if (detail === 'puddles') {
    return (
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0 }}>
        {base}
        <ellipse cx="50" cy="55" rx="22" ry="7" fill="rgba(80,148,210,0.22)" />
      </svg>
    )
  }
  // pebbles / default
  return <div style={{ position: 'absolute', inset: 0, background: surfaceColor }} />
}

/* ── Props ── */
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

  // Stable sort by posX for basic left→right depth ordering
  const sortedForest = useMemo(
    () => [...forest].sort((a, b) => a.posX - b.posX),
    [forest],
  )

  /*
   * Z-index stacking:
   *  1  — subsoil (behind all)
   *  2  — surface ground (behind trees)
   *  3  — edge highlight (behind trees)
   *  4  — shadow ellipses (in front of ground, behind trees)
   *  5… — tree sprites (one z-level per tree for depth sorting)
   * 60  — cover strips (in FRONT of tree bases → planted-in-ground effect)
   * 200 — HUD
   */

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100vh',
      overflow: 'hidden',
      background: terrain.skyGradient,
    }}>

      {/* ── HUD ── */}
      <div className="absolute top-4 right-4 z-[200]">
        <CO2Counter value={co2Kg} />
      </div>
      <div className="absolute top-4 left-4 z-[200] bg-black/30 backdrop-blur-sm rounded-xl px-4 py-3">
        <p className="font-bold text-white text-lg">{terrain.displayName}</p>
        <p className="text-sm text-white/80">{totalPoints} pontos</p>
      </div>

      {/* ── LAYER 1 — Subsoil ── */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: SUBSOIL_H,
        background: terrain.subsoilColor,
        zIndex: 1,
      }} />

      {/* ── LAYER 2 — Surface (behind tree sprites; cover strips occlude bases) ── */}
      <div style={{
        position: 'absolute',
        bottom: SUBSOIL_H,
        left: 0,
        right: 0,
        height: SURFACE_H,
        background: terrain.surfaceColor,
        zIndex: 2,
        overflow: 'hidden',
      }}>
        <GroundTexture detail={terrain.detail} />
      </div>

      {/* ── LAYER 3 — Edge highlight ── */}
      <div style={{
        position: 'absolute',
        bottom: SUBSOIL_H + SURFACE_H,
        left: 0,
        right: 0,
        height: EDGE_H,
        background: terrain.edgeColor,
        zIndex: 3,
      }} />

      {/* ── LAYER 4 — Shadow ellipses (above ground, below tree sprites) ── */}
      {sortedForest.map((entry) => {
        const rarity = entry.tree?.rarity ?? 'comum'
        const cfg    = RARITY_CFG[rarity] ?? RARITY_CFG.comum
        // Center shadow on the edge/top of the surface
        const shadowBottom = SUBSOIL_H + SURFACE_H - 2
        return (
          <div
            key={entry.id + '-shadow'}
            style={{
              position: 'absolute',
              left: `${entry.posX}%`,
              bottom: shadowBottom,
              transform: 'translate(-50%, 50%)',
              width: `${Math.round(cfg.size * 0.7)}px`,
              height: '8px',
              background: 'rgba(0,0,0,0.22)',
              borderRadius: '50%',
              filter: 'blur(3px)',
              zIndex: 4,
            }}
          />
        )
      })}

      {/* ── LAYERS 5+ — Tree sprites anchored to ground ── */}
      {sortedForest.map((entry, idx) => {
        const rarity   = entry.tree?.rarity ?? 'comum'
        const cfg      = RARITY_CFG[rarity] ?? RARITY_CFG.comum
        const treeBiome = toBiomeKey(entry.biome?.name ?? '')

        /*
         * Anchor formula:
         *   GROUND_TOP = GROUND_H (from container bottom)
         *   tree base enters ground by cfg.depth pixels
         *   → bottom of sprite div = GROUND_TOP - cfg.depth
         */
        const treeBottom = GROUND_H - cfg.depth

        return (
          <div
            key={entry.id}
            style={{
              position: 'absolute',
              left: `${entry.posX}%`,
              bottom: `${treeBottom}px`,
              transform: 'translateX(-50%)',
              zIndex: 5 + idx,
              cursor: 'pointer',
            }}
            title={[
              entry.tree?.commonName,
              entry.tree?.scientificName,
              entry.tree?.funFact,
            ].filter(Boolean).join('\n')}
          >
            <TreeSprite
              species={entry.tree?.commonName ?? ''}
              biome={treeBiome}
              rarity={rarity}
              size={cfg.size}
              animated={rarity === 'lendario' || rarity === 'epico'}
            />
          </div>
        )
      })}

      {/* ── LAYER 6 — Cover strips (front of tree bases, creates planted effect) ── */}
      {sortedForest.map((entry) => {
        const rarity = entry.tree?.rarity ?? 'comum'
        const cfg    = RARITY_CFG[rarity] ?? RARITY_CFG.comum

        /*
         * Strip covers exactly the cfg.depth pixels that the sprite
         * descends into the ground surface.
         *   bottom = GROUND_H - cfg.depth  (= same as tree bottom)
         *   height = cfg.depth
         * → top edge of strip aligns with ground top (GROUND_H)
         */
        return (
          <div
            key={entry.id + '-cover'}
            style={{
              position: 'absolute',
              left: `${entry.posX}%`,
              bottom: `${GROUND_H - cfg.depth}px`,
              transform: 'translateX(-50%)',
              width: `${cfg.size}px`,
              height: `${cfg.depth}px`,
              zIndex: 60,
              overflow: 'hidden',
              pointerEvents: 'none',
            }}
          >
            <CoverStrip detail={terrain.detail} surfaceColor={terrain.surfaceColor} />
          </div>
        )
      })}

      {/* ── Shop button ── */}
      <button
        onClick={() => setShowShop(true)}
        className="absolute bottom-8 right-8 z-[200] bg-green-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-700 transition-colors"
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

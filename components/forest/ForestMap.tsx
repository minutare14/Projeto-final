'use client'

import { useState, useMemo } from 'react'
import { CO2Counter } from '@/components/ui/CO2Counter'
import { TreeShop } from '@/components/shop/TreeShop'
import { TreeSprite } from '@/components/forest/TreeSprite'

/* ─────────────────────────────────────────────
   GRID PRESETS  (slot management only — not visual)
───────────────────────────────────────────── */
const GRID = {
  small:  { cols: 5, rows: 3 },
  medium: { cols: 6, rows: 4 },
  large:  { cols: 8, rows: 5 },
  xlarge: { cols: 10, rows: 6 },
} as const
type GridPreset = keyof typeof GRID

function gridPresetFor(n: number): GridPreset {
  if (n <= GRID.small.cols  * GRID.small.rows)  return 'small'
  if (n <= GRID.medium.cols * GRID.medium.rows) return 'medium'
  if (n <= GRID.large.cols  * GRID.large.rows)  return 'large'
  return 'xlarge'
}

/* ─────────────────────────────────────────────
   PERSPECTIVE SCENE GEOMETRY  (in vh units)
   Row 0 = back (far), Row rows-1 = front (near)
───────────────────────────────────────────── */
const SCENE_FRONT_VH = 12   // bottom of scene where front row bases sit
const SCENE_BACK_VH  = 72   // back row bases sit this high from bottom

function rowBaseVh(row: number, rows: number): number {
  const t = row / Math.max(rows - 1, 1)              // 0 = back, 1 = front
  return SCENE_BACK_VH - t * (SCENE_BACK_VH - SCENE_FRONT_VH)
}

function rowScale(row: number, rows: number): number {
  const t = row / Math.max(rows - 1, 1)
  return 0.32 + t * 0.68                             // 0.32 (back) → 1.0 (front)
}

function rowOpacity(row: number, rows: number): number {
  const t = row / Math.max(rows - 1, 1)
  return 0.55 + t * 0.45                             // 0.55 (back) → 1.0 (front)
}

/* Natural X position: stagger odd rows + deterministic jitter */
function cellLeftPct(col: number, row: number, cols: number): number {
  const cellW  = 100 / cols
  const stagger = (row % 2 === 1) ? cellW * 0.45 : 0
  const seed    = ((col * 37 + row * 61) % 100)
  const jitter  = (seed / 100 - 0.5) * cellW * 0.55
  return Math.max(3, Math.min(97, (col + 0.5) * cellW + stagger + jitter))
}

/* ─────────────────────────────────────────────
   BASE TREE HEIGHT PER RARITY  (px, at scale=1)
───────────────────────────────────────────── */
const RARITY_H: Record<string, number> = {
  comum:    85,
  incomum: 105,
  raro:    130,
  epico:   158,
  lendario:190,
}
const PLANT_DEPTH: Record<string, number> = {
  comum: 6, incomum: 9, raro: 12, epico: 15, lendario: 20,
}

/* ─────────────────────────────────────────────
   PNG SPRITE LOOKUP
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
  if (n.includes('mandacaru'))                         return 'mandacaru'
  if (n.includes('buriti'))                            return 'buriti'
  if (n.includes('ipe') || n.includes('ipê'))          return 'ipe'
  if (n.includes('araucaria') || n.includes('araucária')) return 'araucaria'
  if (n.includes('pau brasil') || n.includes('pau-brasil')) return 'pau brasil'
  return null
}
function sizeLabel(key: string, rarity: string): string {
  const fem = key === 'araucaria'
  if (rarity === 'epico' || rarity === 'lendario') return 'grande'
  if (rarity === 'raro')   return fem ? 'media'   : 'medio'
  return fem ? 'pequena' : 'pequeno'
}
function getSprite(name: string, rarity: string) {
  const key   = spriteKey(name);  if (!key) return null
  const label = sizeLabel(key, rarity)
  const dims  = SPRITE_DIMS[key]?.[label];  if (!dims) return null
  return { src: `/sprites/${key} ${label}.png`, w: dims[0], h: dims[1] }
}

/* ─────────────────────────────────────────────
   BIOME TERRAIN
───────────────────────────────────────────── */
type BiomeKey = 'caatinga' | 'cerrado' | 'mata-atlantica' | 'pantanal' | 'amazonia'

interface Terrain {
  displayName:  string
  skyGradient:  string
  surfaceColor: string
  subsoilColor: string
  edgeColor:    string
  depthFogColor:string   // atmospheric haze tint
  detail:       'pebbles'|'sparse-grass'|'dense-grass'|'puddles'|'roots'
}

const TERRAIN: Record<BiomeKey, Terrain> = {
  caatinga: {
    displayName:   'Caatinga',
    skyGradient:   'linear-gradient(to bottom,#9E3E08 0%,#D06820 35%,#F0A840 70%,#FFD878 100%)',
    surfaceColor:  '#C8A96E',
    subsoilColor:  '#8B6914',
    edgeColor:     '#DFBA7A',
    depthFogColor: '#F0B85088',
    detail:        'pebbles',
  },
  cerrado: {
    displayName:   'Cerrado',
    skyGradient:   'linear-gradient(to bottom,#1A4C80 0%,#3A80BE 45%,#78B8E0 80%,#C0DDF5 100%)',
    surfaceColor:  '#8B7355',
    subsoilColor:  '#6B4E10',
    edgeColor:     '#9D8462',
    depthFogColor: '#88BBD888',
    detail:        'sparse-grass',
  },
  'mata-atlantica': {
    displayName:   'Mata Atlântica',
    skyGradient:   'linear-gradient(to bottom,#061A38 0%,#0E3E78 40%,#2068A8 75%,#4090C8 100%)',
    surfaceColor:  '#4A7C3F',
    subsoilColor:  '#2E5A1C',
    edgeColor:     '#5C9C50',
    depthFogColor: '#2A7A4088',
    detail:        'dense-grass',
  },
  pantanal: {
    displayName:   'Pantanal',
    skyGradient:   'linear-gradient(to bottom,#0E3850 0%,#2878A8 45%,#5AAAC8 80%,#98D0E8 100%)',
    surfaceColor:  '#5B8A4A',
    subsoilColor:  '#3A6B2A',
    edgeColor:     '#6C9A5C',
    depthFogColor: '#50A8C888',
    detail:        'puddles',
  },
  amazonia: {
    displayName:   'Amazônia',
    skyGradient:   'linear-gradient(to bottom,#010810 0%,#041828 40%,#083848 75%,#0E5868 100%)',
    surfaceColor:  '#2D5A1C',
    subsoilColor:  '#1A3D0E',
    edgeColor:     '#3E7828',
    depthFogColor: '#083A1888',
    detail:        'roots',
  },
}

const TIER_BIOME: Record<number,BiomeKey> = {
  1:'caatinga', 2:'cerrado', 3:'mata-atlantica', 4:'pantanal', 5:'amazonia',
}
function toBiomeKey(name: string): BiomeKey {
  const n = norm(name)
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
function GroundTexture({ detail }: { detail: Terrain['detail'] }) {
  if (detail === 'pebbles') {
    const st = Array.from({length:20},(_,i)=>({
      cx:((i*137+23)%92)+4, cy:15+(i%5)*18, rx:1.4+(i%3)*.7, ry:.8+(i%2)*.4
    }))
    return <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{position:'absolute',inset:0}}>
      {st.map((s,i)=><ellipse key={i} cx={`${s.cx}%`} cy={`${s.cy}%`} rx={s.rx} ry={s.ry} fill="rgba(70,44,4,0.3)"/>)}
    </svg>
  }
  if (detail === 'sparse-grass') {
    const bl = Array.from({length:20},(_,i)=>({x:((i*153+7)%90)+5,lean:((i%3)-1)*3,h:10+(i%4)*4}))
    return <svg width="100%" height="100%" viewBox="0 0 100 30" preserveAspectRatio="none" style={{position:'absolute',inset:0}}>
      {bl.map((b,i)=><path key={i} d={`M${b.x},30 Q${b.x+b.lean/2},${30-b.h/2} ${b.x+b.lean},${30-b.h}`} stroke="#7A6028" strokeWidth=".9" fill="none" opacity=".55"/>)}
    </svg>
  }
  if (detail === 'dense-grass') {
    const bl = Array.from({length:28},(_,i)=>({x:((i*113+5)%92)+4,lean:((i%5)-2)*2.5,h:12+(i%4)*5}))
    return <svg width="100%" height="100%" viewBox="0 0 100 30" preserveAspectRatio="none" style={{position:'absolute',inset:0}}>
      {bl.map((b,i)=><path key={i} d={`M${b.x},30 Q${b.x+b.lean/2},${30-b.h/2} ${b.x+b.lean},${30-b.h}`} stroke="#2C7025" strokeWidth="1.1" fill="none" opacity=".65"/>)}
    </svg>
  }
  if (detail === 'puddles') {
    const pu = Array.from({length:7},(_,i)=>({cx:((i*197+13)%80)+10,cy:25+(i%4)*20}))
    return <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{position:'absolute',inset:0}}>
      {pu.map((p,i)=><ellipse key={i} cx={`${p.cx}%`} cy={`${p.cy}%`} rx={3+(i%3)} ry={1.4} fill="rgba(80,148,210,0.28)"/>)}
    </svg>
  }
  return <svg width="100%" height="100%" viewBox="0 0 100 30" preserveAspectRatio="none" style={{position:'absolute',inset:0}}>
    <path d="M4,30 Q18,10 36,22 Q56,2 74,16 Q86,5 97,12" stroke="#183C0C" strokeWidth="1.6" fill="none" opacity=".4"/>
    <path d="M10,30 Q24,16 44,24 Q62,8 78,20 Q88,12 96,18" stroke="#183C0C" strokeWidth="1" fill="none" opacity=".3"/>
  </svg>
}

/* ─────────────────────────────────────────────
   COVER STRIP  (hides the root/base junction)
───────────────────────────────────────────── */
function CoverStrip({ detail, color }: { detail: Terrain['detail']; color: string }) {
  const bl = Array.from({length:7},(_,i)=>({x:i*14+5,lean:((i%3)-1)*5}))
  const bg = <rect width="100" height="100" fill={color}/>
  if (detail==='dense-grass') return <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{position:'absolute',inset:0}}>
    {bg}{bl.map((b,i)=><path key={i} d={`M${b.x},100 Q${b.x+b.lean/2},50 ${b.x+b.lean},5`} stroke="#2C7025" strokeWidth="2.5" fill="none" opacity=".7"/>)}
  </svg>
  if (detail==='sparse-grass') return <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{position:'absolute',inset:0}}>
    {bg}{bl.map((b,i)=><path key={i} d={`M${b.x},100 Q${b.x+b.lean/2},55 ${b.x+b.lean},12`} stroke="#7A6028" strokeWidth="2" fill="none" opacity=".6"/>)}
  </svg>
  if (detail==='roots') return <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{position:'absolute',inset:0}}>
    {bg}<path d="M10,100 Q32,55 58,78 Q72,36 92,62" stroke="#183C0C" strokeWidth="3" fill="none" opacity=".45"/>
  </svg>
  return <div style={{position:'absolute',inset:0,background:color}}/>
}

/* ─────────────────────────────────────────────
   TREE RENDERER  (PNG or SVG fallback)
───────────────────────────────────────────── */
function TreeImage({ name, biome, rarity, h }: { name:string; biome:BiomeKey; rarity:string; h:number }) {
  const sp = getSprite(name, rarity)
  if (sp) {
    const w = Math.round(h * sp.w / sp.h)
    return <img src={sp.src} alt={name} draggable={false}
      style={{ height:h, width:w, display:'block', userSelect:'none' }} />
  }
  return <TreeSprite species={name} biome={biome} rarity={rarity as any}
    size={Math.round(h*.65)} animated={rarity==='epico'||rarity==='lendario'} />
}

/* ─────────────────────────────────────────────
   FOREST MAP
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
    () => [...forest].sort((a,b) =>
      new Date(a.plantedAt??0).getTime() - new Date(b.plantedAt??0).getTime()
    ), [forest],
  )

  const preset         = gridPresetFor(sortedForest.length)
  const { cols, rows } = GRID[preset]
  const capacity       = cols * rows

  /* Build positioned tree list */
  const trees = useMemo(() => sortedForest.map((entry, idx) => {
    const col    = idx % cols
    const row    = Math.floor(idx / cols)
    const scale  = rowScale(row, rows)
    const opac   = rowOpacity(row, rows)
    const bvh    = rowBaseVh(row, rows)
    const rarity = entry.tree?.rarity ?? 'comum'
    const h      = Math.round((RARITY_H[rarity] ?? 85) * scale)
    const depth  = Math.round((PLANT_DEPTH[rarity] ?? 8) * scale)
    const sp     = getSprite(entry.tree?.commonName ?? '', rarity)
    const shadowW = sp ? Math.round(h * sp.w / sp.h * 0.65) : Math.round(h * 0.5)
    const coverW  = sp ? Math.round(h * sp.w / sp.h) : Math.round(h * 0.65)

    return {
      id:      entry.id,
      name:    entry.tree?.commonName ?? '',
      sci:     entry.tree?.scientificName ?? '',
      fact:    entry.tree?.funFact ?? '',
      biome:   toBiomeKey(entry.biome?.name ?? ''),
      rarity,
      leftPct: cellLeftPct(col, row, cols),
      bvh,      // base Y in vh from bottom
      depth,    // pixels tree enters ground
      h,        // rendered height
      shadowW,
      coverW,
      opacity: opac,
      zIndex:  10 + row * 10,
      row,
    }
  }), [sortedForest, cols, rows])

  /* Sort back→front so front trees render on top */
  const sorted = useMemo(() => [...trees].sort((a,b) => a.row - b.row), [trees])

  /* Ground height (px) */
  const GROUND_H = 80

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100vh',
      overflow: 'hidden',
      background: terrain.skyGradient,
    }}>

      {/* ── Depth fog layers (atmospheric perspective) ── */}
      {Array.from({length: rows - 1}, (_, i) => {
        const r   = i                          // back rows 0..(rows-2)
        const bvh = rowBaseVh(r, rows)
        const op  = 0.18 - i * 0.03
        return (
          <div key={i} style={{
            position: 'absolute',
            bottom: `calc(${bvh}vh - 4px)`,
            left: 0, right: 0,
            height: 10,
            background: terrain.depthFogColor,
            opacity: op,
            zIndex: 5 + i,
            pointerEvents: 'none',
          }} />
        )
      })}

      {/* ── Tree sprites (back→front) ── */}
      {sorted.map(t => (
        <div key={t.id} style={{ position: 'absolute', left: `${t.leftPct}%`, zIndex: t.zIndex }}>

          {/* Shadow */}
          <div style={{
            position: 'absolute',
            bottom: `calc(${t.bvh}vh - 2px)`,
            left: '50%',
            transform: 'translate(-50%, 50%)',
            width: t.shadowW,
            height: Math.max(4, Math.round(7 * (t.h / 85))),
            background: 'rgba(0,0,0,0.22)',
            borderRadius: '50%',
            filter: `blur(${Math.round(2 + t.h / 60)}px)`,
            opacity: t.opacity * 0.9,
            pointerEvents: 'none',
          }} />

          {/* Tree */}
          <div
            style={{
              position: 'absolute',
              bottom: `calc(${t.bvh}vh - ${t.depth}px)`,
              left: '50%',
              transform: 'translateX(-50%)',
              opacity: t.opacity,
              cursor: 'pointer',
            }}
            title={[t.name, t.sci, t.fact].filter(Boolean).join('\n')}
          >
            <TreeImage name={t.name} biome={t.biome} rarity={t.rarity} h={t.h} />
          </div>

          {/* Cover strip */}
          <div style={{
            position: 'absolute',
            bottom: `calc(${t.bvh}vh - ${t.depth}px)`,
            left: '50%',
            transform: 'translateX(-50%)',
            width: t.coverW,
            height: t.depth,
            zIndex: t.zIndex + 1,
            overflow: 'hidden',
            pointerEvents: 'none',
          }}>
            <CoverStrip detail={terrain.detail} color={terrain.surfaceColor} />
          </div>
        </div>
      ))}

      {/* ── Front ground terrain (full width) ── */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        height: GROUND_H,
        zIndex: 200,
        overflow: 'hidden',
      }}>
        {/* Edge highlight */}
        <div style={{ position:'absolute', top:0, left:0, right:0, height:5, background: terrain.edgeColor }} />
        {/* Surface */}
        <div style={{ position:'absolute', top:5, left:0, right:0, bottom:20, background: terrain.surfaceColor, overflow:'hidden' }}>
          <GroundTexture detail={terrain.detail} />
        </div>
        {/* Subsoil */}
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:20, background: terrain.subsoilColor }} />
      </div>

      {/* ── HUD ── */}
      <div className="absolute top-4 left-4 z-[500] bg-black/35 backdrop-blur-sm rounded-xl px-4 py-3 select-none">
        <p className="font-bold text-white text-base leading-tight">{terrain.displayName}</p>
        <p className="text-xs text-white/75 mt-0.5">{totalPoints} pontos</p>
        <p className="text-xs text-white/60 mt-0.5">{sortedForest.length}/{capacity} árvores</p>
      </div>
      <div className="absolute top-4 right-4 z-[500]">
        <CO2Counter value={co2Kg} />
      </div>

      {/* ── Shop ── */}
      <button
        onClick={() => setShowShop(true)}
        className="absolute bottom-6 right-6 z-[500] bg-green-600 hover:bg-green-500 text-white px-5 py-2.5 rounded-full shadow-lg transition-colors font-medium"
      >
        🛒 Plantar Árvore
      </button>

      {showShop && (
        <TreeShop onClose={() => setShowShop(false)} currentTier={currentTier} totalPoints={totalPoints} />
      )}
    </div>
  )
}

'use client'

import { useState, useMemo } from 'react'
import { TreeSprite } from '@/components/forest/TreeSprite'
import { TreeShop } from '@/components/shop/TreeShop'

/* ─────────────────────────────────────────────
   CELL SIZE — árvores têm ~80px, decos ~20px
───────────────────────────────────────────── */
const CELL = 96   // px — tamanho de cada tile do grid
const TREE_H = 82 // px — altura do sprite da árvore dentro do tile
const DECO_H = 22 // px — altura dos sprites decorativos

/* ─────────────────────────────────────────────
   BIOME PALETTES
───────────────────────────────────────────── */
type BiomeKey = 'caatinga' | 'cerrado' | 'mata-atlantica' | 'pantanal' | 'amazonia'

const BIOME: Record<BiomeKey, { main: string; dark: string; light: string; border: string; name: string }> = {
  caatinga:        { main: '#C8A96E', dark: '#8B6340', light: '#DDC080', border: '#9A7040', name: 'Caatinga'       },
  cerrado:         { main: '#8FAD5A', dark: '#5A7830', light: '#AECB72', border: '#607840', name: 'Cerrado'        },
  'mata-atlantica':{ main: '#4A8C3F', dark: '#2D5C28', light: '#62A858', border: '#2D5C28', name: 'Mata Atlântica' },
  pantanal:        { main: '#5A9E7A', dark: '#3A6A50', light: '#72B890', border: '#3A6A50', name: 'Pantanal'       },
  amazonia:        { main: '#2D7A3A', dark: '#1A4A22', light: '#3EA84A', border: '#1A4A22', name: 'Amazônia'       },
}

const TIER_BIOME: Record<number, BiomeKey> = {
  1: 'caatinga', 2: 'cerrado', 3: 'mata-atlantica', 4: 'pantanal', 5: 'amazonia',
}

/* ─────────────────────────────────────────────
   GRID COLS by points
───────────────────────────────────────────── */
function gridCols(pts: number) {
  if (pts < 3000)  return 5
  if (pts < 6000)  return 7
  if (pts < 10000) return 9
  return 11
}

/* ─────────────────────────────────────────────
   SPRITE LOOKUP
───────────────────────────────────────────── */
const SPRITE_DIMS: Record<string, Record<string, [number, number]>> = {
  mandacaru:    { pequeno: [161, 237], medio: [212, 384], grande: [326, 559] },
  buriti:       { pequeno: [189, 204], medio: [277, 408], grande: [383, 536] },
  ipe:          { pequeno: [213, 415], medio: [304, 556] },
  araucaria:    { pequena: [266, 534], media: [266, 520], grande: [679, 1024] },
  'pau brasil': { pequeno: [153, 213], medio: [294, 486], grande: [505, 739] },
}

function norm(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim()
}

function spriteKey(name: string): string | null {
  const n = norm(name)
  if (n.includes('mandacaru'))                              return 'mandacaru'
  if (n.includes('buriti'))                                 return 'buriti'
  if (n.includes('ipe'))                                    return 'ipe'
  if (n.includes('araucaria'))                              return 'araucaria'
  if (n.includes('pau brasil') || n.includes('pau-brasil')) return 'pau brasil'
  return null
}

function sizeLabel(key: string, rarity: string): string {
  const fem = key === 'araucaria'
  if (rarity === 'epico' || rarity === 'lendario') return 'grande'
  if (rarity === 'raro') return fem ? 'media' : 'medio'
  return fem ? 'pequena' : 'pequeno'
}

function getSprite(name: string, rarity: string) {
  const key = spriteKey(name)
  if (!key) return null
  const label = sizeLabel(key, rarity)
  const dims = SPRITE_DIMS[key]?.[label]
  if (!dims) return null
  return { src: `/sprites/${key} ${label}.png`, w: dims[0], h: dims[1] }
}

/* ─────────────────────────────────────────────
   DECO SPRITES
   Arquivos reais em /public/deco-sprites/
───────────────────────────────────────────── */
const DECOS = ['grama', 'matinho', 'graveto_chao', 'grama', 'matinho', 'graveto_chao']

/* posições determinísticas para 3 decos por célula */
const DECO_POSITIONS = [
  { leftPct: 10, bottomPct: 12 },
  { leftPct: 62, bottomPct: 10 },
  { leftPct: 38, bottomPct: 8  },
]

/* ─────────────────────────────────────────────
   RARITY GLOW
───────────────────────────────────────────── */
const RARITY_GLOW: Record<string, string> = {
  comum:    'none',
  incomum:  'drop-shadow(0 0 4px rgba(52,211,153,0.7))',
  raro:     'drop-shadow(0 0 5px rgba(96,165,250,0.8))',
  epico:    'drop-shadow(0 0 6px rgba(167,139,250,0.9))',
  lendario: 'drop-shadow(0 0 8px rgba(251,191,36,1))',
}

const RARITY_BADGE: Record<string, { bg: string; color: string }> = {
  comum:    { bg: '#e5e7eb', color: '#374151' },
  incomum:  { bg: '#d1fae5', color: '#065f46' },
  raro:     { bg: '#dbeafe', color: '#1e40af' },
  epico:    { bg: '#ede9fe', color: '#5b21b6' },
  lendario: { bg: '#fef3c7', color: '#92400e' },
}

/* ─────────────────────────────────────────────
   TOOLTIP
───────────────────────────────────────────── */
function TreeTooltip({ entry, onClose }: { entry: any; onClose: () => void }) {
  const rarity = entry.tree?.rarity ?? 'comum'
  const badge  = RARITY_BADGE[rarity] ?? RARITY_BADGE.comum
  return (
    <div
      onClick={e => e.stopPropagation()}
      style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        background: '#fffdf0',
        border: '3px solid #5a3e1b',
        borderRadius: 4,
        padding: '14px 18px',
        boxShadow: '4px 4px 0 rgba(0,0,0,0.5)',
        zIndex: 1000,
        minWidth: 200, maxWidth: 260,
        fontFamily: 'monospace',
      }}
    >
      <button
        onClick={onClose}
        style={{ position: 'absolute', top: 6, right: 8, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#888' }}
      >✕</button>
      <div style={{ fontWeight: 'bold', color: '#2d5016', fontSize: 13, marginBottom: 4 }}>
        {entry.tree?.commonName ?? 'Árvore'}
      </div>
      <div style={{ fontSize: 10, color: '#888', fontStyle: 'italic', marginBottom: 8 }}>
        {entry.tree?.scientificName}
      </div>
      <div style={{ fontSize: 11, color: '#444', marginBottom: 10, lineHeight: 1.5 }}>
        {entry.tree?.funFact ?? ''}
      </div>
      <span style={{
        fontSize: 10, padding: '2px 8px', borderRadius: 2,
        background: badge.bg, color: badge.color,
        fontWeight: 700, border: `1px solid ${badge.color}44`,
      }}>
        {rarity}
      </span>
    </div>
  )
}

/* ─────────────────────────────────────────────
   TILE TEXTURE (pixel art dots)
───────────────────────────────────────────── */
function TileTexture({ idx, dark }: { idx: number; dark: string }) {
  const dots = Array.from({ length: 3 }, (_, i) => ({
    x: ((idx * 31 + i * 67) % 80) + 8,
    y: ((idx * 47 + i * 53) % 65) + 12,
  }))
  return (
    <svg
      width={CELL} height={CELL}
      viewBox={`0 0 ${CELL} ${CELL}`}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    >
      {dots.map((d, i) => (
        <rect key={i} x={d.x} y={d.y} width={2} height={2} fill={dark} opacity={0.2} />
      ))}
      {/* Bottom shadow line for 2.5D depth */}
      <rect x={0} y={CELL - 6} width={CELL} height={6} fill={dark} opacity={0.3} />
    </svg>
  )
}

/* ─────────────────────────────────────────────
   GRID CELL — tamanho fixo CELL×CELL px
───────────────────────────────────────────── */
function GridCell({ entry, idx, biomeKey }: { entry: any | null; idx: number; biomeKey: BiomeKey }) {
  const [showTip, setShowTip] = useState(false)
  const colors = BIOME[biomeKey]
  const isLight = (idx + Math.floor(idx / 11)) % 2 === 0

  const rarity = entry?.tree?.rarity ?? 'comum'
  const name   = entry?.tree?.commonName ?? ''
  const sp     = entry ? getSprite(name, rarity) : null

  // Calc rendered tree width preserving aspect ratio
  const treeW = sp ? Math.round(TREE_H * sp.w / sp.h) : TREE_H

  // Which decos to show in this empty cell (2-3 decos)
  const numDecos = (idx % 3 === 0) ? 2 : 3

  return (
    <div
      onClick={() => entry && setShowTip(p => !p)}
      style={{
        position: 'relative',
        width: CELL,
        height: CELL,
        flexShrink: 0,
        background: isLight ? colors.light : colors.main,
        outline: `1px solid ${colors.border}`,
        cursor: entry ? 'pointer' : 'default',
        overflow: 'visible',
      }}
    >
      <TileTexture idx={idx} dark={colors.dark} />

      {/* ── Deco sprites on EMPTY cells ── */}
      {!entry && DECO_POSITIONS.slice(0, numDecos).map((pos, di) => {
        const decoName = DECOS[(idx + di * 2) % DECOS.length]
        return (
          <img
            key={di}
            src={`/deco-sprites/${decoName}.png`}
            alt=""
            draggable={false}
            style={{
              position: 'absolute',
              left: `${pos.leftPct}%`,
              bottom: `${pos.bottomPct}%`,
              height: DECO_H,
              width: 'auto',
              imageRendering: 'pixelated',
              pointerEvents: 'none',
              opacity: 0.9,
            }}
            onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        )
      })}

      {/* ── Tree sprite — centered, anchored to bottom ── */}
      {entry && (
        <div style={{
          position: 'absolute',
          bottom: 4,
          left: '50%',
          transform: 'translateX(-50%)',
          width: treeW,
          height: TREE_H,
          filter: RARITY_GLOW[rarity] ?? 'none',
          zIndex: 2,
          // árvore pode crescer acima do tile (overflow: visible no pai)
        }}>
          {sp ? (
            <img
              src={sp.src}
              alt={name}
              draggable={false}
              style={{
                width: treeW,
                height: TREE_H,
                objectFit: 'contain',
                objectPosition: 'bottom center',
                imageRendering: 'pixelated',
                display: 'block',
                userSelect: 'none',
              }}
            />
          ) : (
            <TreeSprite
              species={name}
              biome={biomeKey}
              rarity={rarity as any}
              size={56}
              animated={rarity === 'epico' || rarity === 'lendario'}
            />
          )}
        </div>
      )}

      {showTip && entry && <TreeTooltip entry={entry} onClose={() => setShowTip(false)} />}
    </div>
  )
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
  const colors   = BIOME[biomeKey]

  const cols    = useMemo(() => gridCols(totalPoints), [totalPoints])
  const sorted  = useMemo(() =>
    [...forest].sort((a, b) =>
      new Date(a.plantedAt ?? 0).getTime() - new Date(b.plantedAt ?? 0).getTime()
    ), [forest])

  // Número de linhas: suficiente para conter todas as árvores + mínimo de 3 linhas extras vazias
  const rows    = Math.max(4, Math.ceil(sorted.length / cols) + 3)
  const capacity = cols * rows

  const cells   = useMemo(() => {
    const arr: (typeof forest[number] | null)[] = [...sorted]
    while (arr.length < capacity) arr.push(null)
    return arr
  }, [sorted, capacity])

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: colors.dark,
      fontFamily: 'monospace',
      overflow: 'hidden',
    }}>

      {/* ── HUD ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '6px 14px',
        background: 'rgba(0,0,0,0.80)',
        color: 'white',
        fontSize: 11,
        flexShrink: 0,
        borderBottom: `2px solid ${colors.dark}`,
        zIndex: 50,
        gap: 12,
      }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <span style={{ fontWeight: 'bold', fontSize: 13, color: '#a8e6a3' }}>🌳 {colors.name}</span>
          <span>💰 {totalPoints.toLocaleString()} pts</span>
          <span>🌱 {forest.length} árvores  ({cols}×{rows})</span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span>🌿 {co2Kg.toFixed(1)} kg CO₂/ano</span>
          <button
            onClick={() => setShowShop(true)}
            style={{
              background: '#16a34a', color: 'white',
              border: '2px solid #15803d', borderRadius: 4,
              padding: '4px 12px', cursor: 'pointer',
              fontSize: 11, fontWeight: 'bold',
              boxShadow: '2px 2px 0 #14532d',
            }}
          >
            + Plantar Árvore
          </button>
        </div>
      </div>

      {/* ── SCROLLABLE GRID ── */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        // fundo entre os tiles
        background: colors.dark,
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          width: cols * CELL,
          // centraliza horizontalmente se grid menor que tela
          margin: '0 auto',
          gap: 0,
        }}>
          {cells.map((entry, idx) => (
            <GridCell
              key={entry?.id ?? `empty-${idx}`}
              entry={entry}
              idx={idx}
              biomeKey={biomeKey}
            />
          ))}
        </div>
      </div>

      {/* ── SHOP ── */}
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

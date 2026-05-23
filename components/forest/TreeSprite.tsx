'use client'

import React from 'react'

interface TreeSpriteProps {
  species: string
  biome: 'caatinga' | 'cerrado' | 'mata-atlantica' | 'pantanal' | 'amazonia'
  rarity: 'comum' | 'incomum' | 'raro' | 'epico' | 'lendario'
  size?: number
  animated?: boolean
}

const BIOME_COLORS = {
  'caatinga': { light: '#C8B560', dark: '#7A9A3A', trunk: '#8B6914', trunkDark: '#5C4A0F' },
  'cerrado': { light: '#4A7C2F', dark: '#2D5A1E', trunk: '#6B4423', trunkDark: '#4A2F18' },
  'mata-atlantica': { light: '#2E9E5A', dark: '#1A6B35', trunk: '#5D4037', trunkDark: '#3E2723' },
  'pantanal': { light: '#3AB8A0', dark: '#1E7A6A', trunk: '#5D6B3A', trunkDark: '#3D4530' },
  'amazonia': { light: '#1D5C2A', dark: '#0D3A18', trunk: '#4A3728', trunkDark: '#2E221A' },
}

const RARITY_GLOW = {
  comum: 'none',
  incomum: 'none',
  raro: 'none',
  epico: 'drop-shadow(0 0 4px rgba(255,180,50,0.4))',
  lendario: 'drop-shadow(0 0 8px rgba(255,215,0,0.6))',
}

function Mandacaru({ size = 80, animated = false }: { size?: number; animated?: boolean }) {
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 80 100" style={{ filter: RARITY_GLOW.comum }}>
      <defs>
        <linearGradient id="mand-top" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#E8D98A" />
          <stop offset="100%" stopColor="#C8B560" />
        </linearGradient>
        <linearGradient id="mand-front" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7A9A3A" />
          <stop offset="100%" stopColor="#4A6B25" />
        </linearGradient>
        <linearGradient id="mand-side" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#5A7A2A" />
          <stop offset="100%" stopColor="#3A5A18" />
        </linearGradient>
        <linearGradient id="mand-trunk" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#A07828" />
          <stop offset="100%" stopColor="#6B4F14" />
        </linearGradient>
      </defs>

      {/* Sombra no chão */}
      <ellipse cx="40" cy="92" rx="22" ry="6" fill="rgba(0,0,0,0.15)" />

      {/* Tronco isométrico */}
      <rect x="36" y="70" width="8" height="22" fill="url(#mand-trunk)" />
      <rect x="36" y="70" width="3" height="22" fill="#5C4A0F" opacity="0.5" />

      {/* Cacto colunar principal - 3 faces */}
      {/* Topo */}
      <polygon points="40,15 55,27 40,35 25,27" fill="url(#mand-top)" />
      {/* Frente esquerda */}
      <polygon points="25,27 40,35 40,85 25,72" fill="url(#mand-front)" />
      {/* Frente direita */}
      <polygon points="55,27 40,35 40,85 55,72" fill="url(#mand-side)" />

      {/* Espinhos - linhas diagonais na face */}
      <line x1="28" y1="45" x2="38" y2="50" stroke="#E8D98A" strokeWidth="1" opacity="0.6" />
      <line x1="30" y1="55" x2="40" y2="60" stroke="#E8D98A" strokeWidth="1" opacity="0.6" />
      <line x1="32" y1="65" x2="40" y2="68" stroke="#E8D98A" strokeWidth="1" opacity="0.6" />

      {animated && (
        <style>{`
          @keyframes mandacaru-sway {
            0%, 100% { transform: rotate(-1deg); transform-origin: center top; }
            50% { transform: rotate(1deg); transform-origin: center top; }
          }
          .mandacaru-animated { animation: mandacaru-sway 4s ease-in-out infinite; }
        `}</style>
      )}
      <g className={animated ? 'mandacaru-animated' : ''}>
        {/* Braços laterais do cacto */}
        <polygon points="20,50 25,55 25,72 20,68" fill="url(#mand-front)" />
        <polygon points="60,50 55,55 55,72 60,68" fill="url(#mand-side)" />
        {/* Topo dos braços */}
        <polygon points="20,50 25,55 20,60 15,55" fill="url(#mand-top)" />
        <polygon points="60,50 55,55 60,60 65,55" fill="url(#mand-top)" />
      </g>
    </svg>
  )
}

function IpeAmarelo({ size = 80, animated = false }: { size?: number; animated?: boolean }) {
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 80 100" style={{ filter: RARITY_GLOW.raro }}>
      <defs>
        <linearGradient id="ipe-top" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F5D23B" />
          <stop offset="100%" stopColor="#E8B82A" />
        </linearGradient>
        <linearGradient id="ipe-front" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4A7C2F" />
          <stop offset="100%" stopColor="#2D5A1E" />
        </linearGradient>
        <linearGradient id="ipe-side" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3A6B25" />
          <stop offset="100%" stopColor="#1A4A10" />
        </linearGradient>
        <linearGradient id="ipe-trunk" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6B4423" />
          <stop offset="100%" stopColor="#4A2F18" />
        </linearGradient>
        {/* Gradiente para flores amarelas */}
        <radialGradient id="ipe-flower" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#F5A623" />
        </radialGradient>
      </defs>

      {/* Sombra no chão */}
      <ellipse cx="40" cy="94" rx="28" ry="6" fill="rgba(0,0,0,0.18)" />

      {/* Copa - múltiplas camadas isométricas */}
      {/* Camada inferior */}
      <polygon points="40,35 65,50 40,60 15,50" fill="url(#ipe-side)" />
      {/* Camada do meio */}
      <polygon points="40,28 60,42 40,52 20,42" fill="url(#ipe-front)" />
      {/* Camada do topo */}
      <polygon points="40,20 55,32 40,40 25,32" fill="url(#ipe-top)" />

      {/* Flores isométricas na copa */}
      <circle cx="30" cy="35" r="4" fill="url(#ipe-flower)" />
      <circle cx="50" cy="33" r="5" fill="url(#ipe-flower)" />
      <circle cx="40" cy="28" r="4" fill="url(#ipe-flower)" />
      <circle cx="25" cy="42" r="3" fill="url(#ipe-flower)" />
      <circle cx="55" cy="40" r="4" fill="url(#ipe-flower)" />
      <circle cx="35" cy="45" r="3" fill="url(#ipe-flower)" />

      {/* Tronco isométrico */}
      <rect x="35" y="58" width="10" height="36" fill="url(#ipe-trunk)" />
      <rect x="35" y="58" width="4" height="36" fill="#4A2F18" opacity="0.4" />

      {animated && (
        <style>{`
          @keyframes ipe-sway {
            0%, 100% { transform: rotate(-1.5deg); transform-origin: center bottom; }
            50% { transform: rotate(1.5deg); transform-origin: center bottom; }
          }
          .ipe-animated { animation: ipe-sway 4s ease-in-out infinite; }
        `}</style>
      )}
      <g className={animated ? 'ipe-animated' : ''}>
        {/* Copa folhas extras */}
        <polygon points="15,48 25,55 20,65 10,58" fill="url(#ipe-side)" />
        <polygon points="65,48 55,55 60,65 70,58" fill="url(#ipe-side)" />
      </g>
    </svg>
  )
}

function Buriti({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 80 110">
      <defs>
        <linearGradient id="buriti-trunk" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8B7355" />
          <stop offset="100%" stopColor="#5C4A3A" />
        </linearGradient>
        <linearGradient id="buriti-frond" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4A7C2F" />
          <stop offset="100%" stopColor="#2D5A1E" />
        </linearGradient>
      </defs>

      {/* Sombra */}
      <ellipse cx="40" cy="105" rx="15" ry="5" fill="rgba(0,0,0,0.15)" />

      {/* Tronco fino e alto */}
      <rect x="37" y="50" width="6" height="55" fill="url(#buriti-trunk)" />

      {/* Palmeira - крунна isométrica */}
      {/* Cima */}
      <polygon points="40,15 50,22 40,28 30,22" fill="#5A8A3A" />
      {/* Folhas em leque */}
      <polygon points="40,20 70,35 40,45 10,35" fill="url(#buriti-frond)" />
      <polygon points="40,22 65,30 40,40 15,30" fill="#3A6B25" />

      {/* Frutos */}
      <circle cx="45" cy="38" r="3" fill="#8B4513" />
      <circle cx="50" cy="42" r="2.5" fill="#A0522D" />
      <circle cx="38" cy="40" r="2" fill="#8B4513" />
    </svg>
  )
}

function Castanheira({ size = 80, animated = false }: { size?: number; animated?: boolean }) {
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 80 105" style={{ filter: RARITY_GLOW.epico }}>
      <defs>
        <linearGradient id="casta-trunk" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#5D4037" />
          <stop offset="100%" stopColor="#3E2723" />
        </linearGradient>
        <linearGradient id="casta-crown" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1D5C2A" />
          <stop offset="100%" stopColor="#0D3A18" />
        </linearGradient>
        <radialGradient id="casta-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#2A7A3A" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#0D3A18" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Aura épica */}
      <ellipse cx="40" cy="35" rx="35" ry="30" fill="url(#casta-glow)" />

      {/* Sombra */}
      <ellipse cx="40" cy="98" rx="30" ry="7" fill="rgba(0,0,0,0.2)" />

      {/* Copa gigante em camadas */}
      <polygon points="40,10 72,28 40,45 8,28" fill="url(#casta-crown)" />
      <polygon points="40,18 65,32 40,48 15,32" fill="#1A5A22" />
      <polygon points="40,25 58,36 40,48 22,36" fill="#0D4A18" />

      {/* Tronco massivo */}
      <rect x="32" y="45" width="16" height="53" fill="url(#casta-trunk)" />
      <rect x="32" y="45" width="5" height="53" fill="#3E2723" opacity="0.4" />

      {/* Textura casca */}
      <line x1="34" y1="60" x2="34" y2="85" stroke="#2A1F1A" strokeWidth="1" opacity="0.3" />
      <line x1="40" y1="55" x2="40" y2="90" stroke="#2A1F1A" strokeWidth="1" opacity="0.2" />
      <line x1="46" y1="58" x2="46" y2="88" stroke="#2A1F1A" strokeWidth="1" opacity="0.3" />

      {animated && (
        <style>{`
          @keyframes casta-sway {
            0%, 100% { transform: rotate(-0.5deg); transform-origin: center bottom; }
            50% { transform: rotate(0.5deg); transform-origin: center bottom; }
          }
          .casta-animated { animation: casta-sway 5s ease-in-out infinite; }
        `}</style>
      )}
      <g className={animated ? 'casta-animated' : ''}>
        {/* Copa extensions */}
        <polygon points="8,32 20,42 15,55 5,45" fill="#1A5A22" />
        <polygon points="72,32 60,42 65,55 75,45" fill="#0D3A18" />
      </g>
    </svg>
  )
}

function Samauma({ size = 80, animated = false }: { size?: number; animated?: boolean }) {
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 80 115" style={{ filter: RARITY_GLOW.lendario }}>
      <defs>
        <linearGradient id="sama-trunk" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#5D4A3A" />
          <stop offset="100%" stopColor="#3E2E22" />
        </linearGradient>
        <linearGradient id="sama-crown" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1D5C2A" />
          <stop offset="100%" stopColor="#0A3A15" />
        </linearGradient>
        <radialGradient id="sama-legend-glow" cx="50%" cy="60%" r="60%">
          <stop offset="0%" stopColor="#FFD700" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#FFA500" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#0A3A15" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Aura lendária */}
      <ellipse cx="40" cy="45" rx="38" ry="45" fill="url(#sama-legend-glow)" />

      {/* Sombra */}
      <ellipse cx="40" cy="108" rx="32" ry="7" fill="rgba(0,0,0,0.25)" />

      {/* Raízes tabulares (soco) - 3 pares */}
      <polygon points="20,85 35,75 35,95 20,100" fill="#4A3A2A" />
      <polygon points="60,85 45,75 45,95 60,100" fill="#3A2A1A" />
      <polygon points="15,90 32,78 30,100 15,105" fill="#5A4A3A" opacity="0.8" />
      <polygon points="65,90 48,78 50,100 65,105" fill="#4A3A2A" opacity="0.8" />

      {/* Copa em múltiplas camadas */}
      <polygon points="40,5 78,30 40,50 2,30" fill="url(#sama-crown)" />
      <polygon points="40,12 70,32 40,50 10,32" fill="#1A5A25" />
      <polygon points="40,20 62,35 40,48 18,35" fill="#0D4A18" />
      <polygon points="40,28 55,38 40,48 25,38" fill="#0A3A12" />

      {/* Tronco central */}
      <rect x="33" y="48" width="14" height="60" fill="url(#sama-trunk)" />
      <rect x="33" y="48" width="4" height="60" fill="#3E2E22" opacity="0.4" />

      {animated && (
        <style>{`
          @keyframes sama-sway {
            0%, 100% { transform: rotate(-0.8deg); transform-origin: center bottom; }
            50% { transform: rotate(0.8deg); transform-origin: center bottom; }
          }
          .sama-animated { animation: sama-sway 6s ease-in-out infinite; }
        `}</style>
      )}
      <g className={animated ? 'sama-animated' : ''}>
        {/* Copa additional layers */}
        <polygon points="2,30 18,40 12,55 0,45" fill="#1A5A22" />
        <polygon points="78,30 62,40 68,55 80,45" fill="#0D3A18" />
      </g>

      {/* Partículas de luz */}
      <circle cx="25" cy="20" r="1.5" fill="#FFD700" opacity="0.6" />
      <circle cx="55" cy="15" r="1" fill="#FFF" opacity="0.5" />
      <circle cx="60" cy="30" r="1.2" fill="#FFD700" opacity="0.4" />
      <circle cx="20" cy="35" r="1" fill="#FFF" opacity="0.3" />
    </svg>
  )
}

function PauBrasil({ size = 80, animated = false }: { size?: number; animated?: boolean }) {
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 80 105" style={{ filter: RARITY_GLOW.lendario }}>
      <defs>
        <linearGradient id="pau-trunk" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8B4513" />
          <stop offset="100%" stopColor="#5D2E0C" />
        </linearGradient>
        <linearGradient id="pau-crown" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2E9E5A" />
          <stop offset="100%" stopColor="#1A6B35" />
        </linearGradient>
        <radialGradient id="pau-glow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#FFD700" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#1A6B35" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Aura dourada */}
      <ellipse cx="40" cy="38" rx="35" ry="35" fill="url(#pau-glow)" />

      {/* Sombra */}
      <ellipse cx="40" cy="98" rx="28" ry="6" fill="rgba(0,0,0,0.2)" />

      {/* Copa em multiple layers com verde vibrante */}
      <polygon points="40,8 70,28 40,48 10,28" fill="url(#pau-crown)" />
      <polygon points="40,15 62,32 40,48 18,32" fill="#2A8A4A" />
      <polygon points="40,23 55,36 40,46 25,36" fill="#1A7A3A" />
      <polygon points="40,30 48,38 40,45 32,38" fill="#0D6A2A" />

      {/* Tronco com listras naturais (característica do pau-brasil) */}
      <rect x="32" y="48" width="16" height="50" fill="url(#pau-trunk)" />
      <rect x="32" y="48" width="5" height="50" fill="#5D2E0C" opacity="0.4" />
      {/* Listras avermelhadas no tronco */}
      <rect x="34" y="55" width="12" height="2" fill="#A0522D" opacity="0.3" />
      <rect x="34" y="65" width="12" height="2" fill="#A0522D" opacity="0.25" />
      <rect x="34" y="75" width="12" height="2" fill="#A0522D" opacity="0.2" />
      <rect x="34" y="85" width="12" height="2" fill="#A0522D" opacity="0.15" />

      {animated && (
        <style>{`
          @keyframes pau-sway {
            0%, 100% { transform: rotate(-0.7deg); transform-origin: center bottom; }
            50% { transform: rotate(0.7deg); transform-origin: center bottom; }
          }
          .pau-animated { animation: pau-sway 5s ease-in-out infinite; }
        `}</style>
      )}
      <g className={animated ? 'pau-animated' : ''}>
        <polygon points="10,32 25,42 18,55 5,45" fill="#2A8A4A" />
        <polygon points="70,32 55,42 62,55 75,45" fill="#1A6B35" />
      </g>

      {/* Brilho especial */}
      <circle cx="30" cy="25" r="2" fill="#FFD700" opacity="0.5" />
      <circle cx="52" cy="20" r="1.5" fill="#FFF" opacity="0.4" />
      <circle cx="45" cy="35" r="1" fill="#FFD700" opacity="0.3" />
    </svg>
  )
}

function GenericTree({ biome, size = 80 }: { biome: keyof typeof BIOME_COLORS; size?: number }) {
  const colors = BIOME_COLORS[biome]
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 80 100">
      <defs>
        <linearGradient id={`gt-crown-${biome}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={colors.light} />
          <stop offset="100%" stopColor={colors.dark} />
        </linearGradient>
        <linearGradient id={`gt-trunk-${biome}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={colors.trunk} />
          <stop offset="100%" stopColor={colors.trunkDark} />
        </linearGradient>
      </defs>

      <ellipse cx="40" cy="92" rx="20" ry="5" fill="rgba(0,0,0,0.15)" />

      <polygon points="40,15 60,30 40,42 20,30" fill={`url(#gt-crown-${biome})`} />
      <polygon points="40,22 55,34 40,44 25,34" fill={colors.dark} />

      <rect x="35" y="42" width="10" height="50" fill={`url(#gt-trunk-${biome})`} />
      <rect x="35" y="42" width="3" height="50" fill={colors.trunkDark} opacity="0.4" />
    </svg>
  )
}

const TREE_COMPONENTS: Record<string, React.FC<{ size?: number; animated?: boolean }>> = {
  'mandacaru': Mandacaru,
  'buriti': Buriti,
  'ipe-amarelo': IpeAmarelo,
  'castanheira': Castanheira,
  'samauma': Samauma,
  'pau-brasil': PauBrasil,
}

export function TreeSprite({ species, biome, rarity, size = 80, animated = false }: TreeSpriteProps) {
  const key = species.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  const Component = TREE_COMPONENTS[key]

  if (Component) {
    return (
      <div style={{
        width: size,
        height: size * 1.2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Component size={size} animated={animated || rarity === 'epico' || rarity === 'lendario'} />
      </div>
    )
  }

  return <GenericTree biome={biome} size={size} />
}

export default TreeSprite
'use client'

import React from 'react'

interface TreeSpriteProps {
  species: string
  biome: 'caatinga' | 'cerrado' | 'mata-atlantica' | 'pantanal' | 'amazonia'
  rarity: 'comum' | 'incomum' | 'raro' | 'epico' | 'lendario'
  size?: number
  animated?: boolean
}

const BIOME_GRADIENTS = {
  'caatinga': { light: '#C8B560', dark: '#7A9A3A', base: '#9A8A40' },
  'cerrado': { light: '#5A9A3A', dark: '#2D5A1E', base: '#4A7A2F' },
  'mata-atlantica': { light: '#3AAB5A', dark: '#1A6B35', base: '#2A8A4A' },
  'pantanal': { light: '#3AB8A0', dark: '#1E7A6A', base: '#2AA08A' },
  'amazonia': { light: '#2A7A3A', dark: '#0D3A18', base: '#1A5A28' },
}

function generateFoliage(id: string, colors: { light: string; dark: string; base: string }, layer: number = 0) {
  const basePoints = layer === 0
    ? '40,15 C28,8 12,12 15,26 C8,22 6,36 18,38 C12,48 22,55 32,50 C28,62 38,68 50,60 C55,68 68,60 66,48 C78,42 75,28 64,24 C70,12 55,5 40,15 Z'
    : layer === 1
    ? '42,20 C30,14 18,18 20,30 C14,27 12,40 22,42 C18,50 26,55 34,52 C32,60 40,65 48,58 C52,65 62,58 60,48 C70,44 68,32 58,28 C62,18 50,12 42,20 Z'
    : '38,18 C26,12 14,16 16,28 C10,24 8,36 18,38 C14,46 22,52 30,48 C28,56 36,62 44,55 C48,62 58,55 56,46 C66,42 64,30 54,26 C58,16 46,10 38,18 Z'

  return basePoints
}

export function TreeSprite({ species, biome, rarity, size = 80, animated = false }: TreeSpriteProps) {
  const key = species.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  const colors = BIOME_GRADIENTS[biome]

  const glowFilter = rarity === 'lendario' ? 'drop-shadow(0 0 10px rgba(255,215,0,0.7))'
    : rarity === 'epico' ? 'drop-shadow(0 0 6px rgba(255,180,50,0.5))' : 'none'

  return (
    <div style={{ width: size, height: size * 1.3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {key === 'ipe-amarelo' && <IpeAmarelo size={size} animated={animated || rarity === 'raro'} />}
      {key === 'samauma' && <Samauma size={size} animated={animated || rarity === 'lendario'} />}
      {key === 'mandacaru' && <Mandacaru size={size} animated={animated} />}
      {key === 'buriti' && <Buriti size={size} />}
      {key === 'castanheira' && <Castanheira size={size} animated={animated || rarity === 'epico'} />}
      {key === 'pau-brasil' && <PauBrasil size={size} animated={animated || rarity === 'lendario'} />}
      {key === 'jequitiba' && <Jequitiba size={size} animated={animated || rarity === 'epico'} />}
      {key === 'palmito-juçara' && <Palmito size={size} />}
      {key === 'caranda' && <Caranda size={size} />}
      {key === 'cambara' && <Cambara size={size} animated={animated} />}
      {key === 'pequizeiro' && <Pequizeiro size={size} animated={animated} />}
      {key === 'seringueira' && <Seringueira size={size} animated={animated || rarity === 'epico'} />}
      {!['ipe-amarelo','samauma','mandacaru','buriti','castanheira','pau-brasil','jequitiba','palmito-juçara','caranda','cambara','pequizeiro','seringueira'].includes(key) && (
        <GenericTree biome={biome} rarity={rarity} size={size} />
      )}
    </div>
  )
}

function IpeAmarelo({ size = 80, animated = false }: { size?: number; animated?: boolean }) {
  return (
    <svg width={size} height={size * 1.25} viewBox="0 0 80 100" style={{ filter: 'drop-shadow(0 0 6px rgba(255,200,50,0.45))' }}>
      <defs>
        <linearGradient id="foliage1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6AAB3A"/>
          <stop offset="100%" stopColor="#3A7A1E"/>
        </linearGradient>
        <linearGradient id="foliage2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4A8A28"/>
          <stop offset="100%" stopColor="#2A5A10"/>
        </linearGradient>
        <linearGradient id="foliage3" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5A9A32"/>
          <stop offset="100%" stopColor="#3A7A18"/>
        </linearGradient>
        <linearGradient id="trunk1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7A5A3A"/>
          <stop offset="100%" stopColor="#5A3A20"/>
        </linearGradient>
        <radialGradient id="flower1" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FFE44D"/>
          <stop offset="100%" stopColor="#F5A823"/>
        </radialGradient>
        <radialGradient id="glow1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFD700" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="#FFA500" stopOpacity="0"/>
        </radialGradient>
      </defs>

      {/* Aura de luz */}
      <ellipse cx="40" cy="40" rx="38" ry="35" fill="url(#glow1)"/>

      {/* Sombra no chão */}
      <ellipse cx="40" cy="94" rx="28" ry="7" fill="rgba(0,0,0,0.25)" filter="blur(3px)"/>

      {/* Camadas de copa orgânica — Bézier curves */}
      {/* Camada traseira */}
      <path d="M20,42 C10,35 8,50 18,55 C10,65 20,75 32,70 C28,80 38,82 45,75 C55,82 68,75 65,65 C75,60 72,48 62,45 C68,35 55,30 45,35 C52,25 40,22 32,28 C22,22 15,30 20,42 Z"
            fill="#2A5A10" opacity="0.7"/>
      {/* Camada média */}
      <path d="M18,38 C8,30 12,48 20,52 C12,62 25,72 35,68 C30,78 42,80 48,72 C58,80 72,72 68,60 C78,54 72,40 62,38 C70,28 55,22 46,28 C54,18 42,15 32,22 C22,15 12,25 18,38 Z"
            fill="url(#foliage2)"/>
      {/* Camada frontal */}
      <path d="M15,35 C5,26 10,45 18,50 C8,60 22,70 34,66 C28,76 40,78 48,70 C60,78 75,70 70,58 C82,50 75,36 65,34 C72,24 58,18 48,24 C56,14 44,12 32,20 C20,12 8,22 15,35 Z"
            fill="url(#foliage1)"/>
      {/* Topo da copa */}
      <path d="M22,32 C12,24 16,40 24,45 C16,54 28,62 38,58 C34,68 44,70 50,62 C60,68 72,60 68,50 C78,44 72,32 62,30 C68,22 56,16 48,22 C54,14 44,12 34,20 C24,14 14,22 22,32 Z"
            fill="#5A9A32"/>

      {/* Flores amarelas isométricas */}
      <circle cx="22" cy="32" r="3.5" fill="url(#flower1)"/>
      <circle cx="35" cy="28" r="4" fill="url(#flower1)"/>
      <circle cx="52" cy="30" r="3.5" fill="url(#flower1)"/>
      <circle cx="28" cy="42" r="3" fill="url(#flower1)"/>
      <circle cx="45" cy="38" r="4" fill="url(#flower1)"/>
      <circle cx="60" cy="40" r="3" fill="url(#flower1)"/>
      <circle cx="38" cy="50" r="3" fill="url(#flower1)"/>
      <circle cx="55" cy="48" r="3.5" fill="url(#flower1)"/>
      <circle cx="18" cy="48" r="2.5" fill="url(#flower1)"/>
      <circle cx="65" cy="36" r="2.5" fill="url(#flower1)"/>
      <circle cx="30" cy="55" r="2" fill="url(#flower1)"/>

      {/* Tronco orgânico afunilado */}
      <path d="M35,58 C33,58 32,60 32,65 L30,88 C30,91 33,92 36,92 C39,92 42,91 42,88 L40,65 C40,60 39,58 37,58 C36,58 35.5,58.5 35,58 Z"
            fill="url(#trunk1)"/>
      {/* Textura casca */}
      <path d="M33,65 Q35,70 34,75 Q36,72 35,68" stroke="#4A2A15" strokeWidth="0.8" fill="none" opacity="0.5"/>
      <path d="M37,62 Q38,68 37,75 Q39,70 38,64" stroke="#4A2A15" strokeWidth="0.6" fill="none" opacity="0.4"/>
      <path d="M35,78 Q36,82 35,86" stroke="#4A2A15" strokeWidth="0.7" fill="none" opacity="0.35"/>

      {animated && (
        <style>{`
          @keyframes ipe-sway {
            0%, 100% { transform: rotate(-1.5deg) translateX(-0.5px); transform-origin: 40px 92px; }
            50% { transform: rotate(1.5deg) translateX(0.5px); transform-origin: 40px 92px; }
          }
          .ipe-anim { animation: ipe-sway 4.5s ease-in-out infinite; transform-origin: 40px 92px; }
        `}</style>
      )}
      <g className={animated ? 'ipe-anim' : ''}>
        {/* Ramificações extras */}
        <path d="M25,50 C18,48 12,52 8,58 C10,56 14,54 20,56" fill="#4A8A28"/>
        <path d="M55,48 C62,46 68,50 72,56 C70,54 66,52 60,54" fill="#3A7A18"/>
      </g>
    </svg>
  )
}

function Samauma({ size = 80, animated = false }: { size?: number; animated?: boolean }) {
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 80 112" style={{ filter: 'drop-shadow(0 0 12px rgba(255,215,0,0.65))' }}>
      <defs>
        <linearGradient id="sama-trunk" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6A5040"/>
          <stop offset="100%" stopColor="#4A3020"/>
        </linearGradient>
        <linearGradient id="sama-crown1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2A7A35"/>
          <stop offset="100%" stopColor="#1A5A20"/>
        </linearGradient>
        <linearGradient id="sama-crown2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1A6A2A"/>
          <stop offset="100%" stopColor="#0D4A15"/>
        </linearGradient>
        <linearGradient id="sama-root" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5A4030"/>
          <stop offset="100%" stopColor="#3A2518"/>
        </linearGradient>
        <radialGradient id="sama-glow" cx="50%" cy="55%" r="55%">
          <stop offset="0%" stopColor="#FFD700" stopOpacity="0.35"/>
          <stop offset="50%" stopColor="#FFA500" stopOpacity="0.2"/>
          <stop offset="100%" stopColor="#0D3A15" stopOpacity="0"/>
        </radialGradient>
      </defs>

      {/* Aura lendária */}
      <ellipse cx="40" cy="45" rx="40" ry="48" fill="url(#sama-glow)"/>

      {/* Sombra */}
      <ellipse cx="40" cy="106" rx="35" ry="8" fill="rgba(0,0,0,0.3)" filter="blur(4px)"/>

      {/* CONTRAFORTES — raízes tabulares orgânicas */}
      {/* Raiz esquerda */}
      <path d="M32,70 C28,72 22,75 15,78 C12,80 10,85 12,92 C16,90 20,86 28,82 C24,78 28,72 32,70 Z"
            fill="url(#sama-root)"/>
      <path d="M30,75 C26,78 20,82 14,86 C16,88 18,90 20,89 C26,86 30,82 32,78"
            stroke="#3A2518" strokeWidth="0.8" fill="none" opacity="0.5"/>
      {/* Raiz direita */}
      <path d="M48,70 C52,72 58,75 65,78 C68,80 70,85 68,92 C64,90 60,86 52,82 C56,78 52,72 48,70 Z"
            fill="#4A3020"/>
      <path d="M50,75 C54,78 60,82 66,86 C64,88 62,90 60,89 C54,86 50,82 48,78"
            stroke="#3A2518" strokeWidth="0.8" fill="none" opacity="0.5"/>
      {/* Raiz central esquerda */}
      <path d="M30,80 C24,82 18,86 12,92 C14,94 16,95 18,93 C24,88 28,84 32,80"
            fill="#5A4030" opacity="0.85"/>
      {/* Raiz central direita */}
      <path d="M50,80 C56,82 62,86 68,92 C66,94 64,95 62,93 C56,88 52,84 48,80"
            fill="#4A3020" opacity="0.85"/>

      {/* Copa em múltiplos andares — Bézier orgânicos */}
      {/* Andar inferior */}
      <path d="M5,38 C-2,32 2,50 12,52 C2,62 15,72 28,68 C22,78 35,82 44,75 C52,82 65,78 70,68 C82,62 78,48 68,45 C76,35 62,28 52,32 C58,22 45,18 35,24 C25,18 12,25 5,38 Z"
            fill="#0D4A15"/>
      {/* Andar médio */}
      <path d="M8,32 C0,25 5,42 15,44 C5,54 20,63 32,60 C25,70 38,74 46,67 C54,74 68,70 72,60 C82,54 78,40 68,38 C76,28 62,22 52,26 C58,17 46,14 36,20 C26,14 14,20 8,32 Z"
            fill="url(#sama-crown1)"/>
      {/* Andar superior */}
      <path d="M12,26 C4,20 10,36 20,38 C12,48 25,56 36,52 C30,62 42,65 50,58 C58,65 72,60 75,50 C85,44 80,30 70,28 C78,20 65,14 55,18 C60,10 48,8 40,14 C30,8 18,14 12,26 Z"
            fill="#1A6A2A"/>
      {/* Topo */}
      <path d="M18,22 C12,16 16,30 24,32 C18,40 28,46 38,42 C34,50 44,52 50,46 C56,52 68,48 70,40 C78,36 74,24 66,24 C72,16 62,12 54,16 C58,10 48,8 42,14 C34,8 24,14 18,22 Z"
            fill="#2A7A30"/>

      {/* Tronco */}
      <path d="M34,52 C32,52 31,55 31,60 L28,85 C28,89 32,91 36,91 C40,91 44,89 44,85 L42,60 C42,55 41,52 39,52 C38,52 34.5,52.5 34,52 Z"
            fill="url(#sama-trunk)"/>
      <path d="M32,56 Q34,62 33,70 Q36,65 35,58" stroke="#3A2010" strokeWidth="0.8" fill="none" opacity="0.4"/>
      <path d="M38,54 Q39,62 38,75 Q41,68 40,54" stroke="#3A2010" strokeWidth="0.6" fill="none" opacity="0.3"/>

      {/* Partículas de luz */}
      <circle cx="20" cy="18" r="1.8" fill="#FFD700" opacity="0.7"/>
      <circle cx="55" cy="14" r="1.2" fill="#FFF" opacity="0.6"/>
      <circle cx="62" cy="28" r="1.5" fill="#FFD700" opacity="0.55"/>
      <circle cx="15" cy="35" r="1" fill="#FFF" opacity="0.4"/>
      <circle cx="70" cy="22" r="1.3" fill="#FFD700" opacity="0.5"/>
      <circle cx="45" cy="12" r="1" fill="#FFF" opacity="0.45"/>

      {animated && (
        <style>{`
          @keyframes sama-sway {
            0%, 100% { transform: rotate(-1deg) translateX(-0.3px); transform-origin: 40px 95px; }
            50% { transform: rotate(1deg) translateX(0.3px); transform-origin: 40px 95px; }
          }
          .sama-anim { animation: sama-sway 6s ease-in-out infinite; transform-origin: 40px 95px; }
        `}</style>
      )}
      <g className={animated ? 'sama-anim' : ''}>
        <path d="M5,40 C-2,35 2,48 10,50" stroke="#1A5A20" strokeWidth="2" fill="none" opacity="0.4"/>
        <path d="M75,38 C82,33 78,46 70,48" stroke="#0D4A15" strokeWidth="2" fill="none" opacity="0.4"/>
      </g>
    </svg>
  )
}

function Mandacaru({ size = 80, animated = false }: { size?: number; animated?: boolean }) {
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 80 96">
      <defs>
        <linearGradient id="mand-body" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7A9A3A"/>
          <stop offset="50%" stopColor="#5A8A28"/>
          <stop offset="100%" stopColor="#3A6A18"/>
        </linearGradient>
        <linearGradient id="mand-top" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#A8C85A"/>
          <stop offset="100%" stopColor="#8AA838"/>
        </linearGradient>
        <linearGradient id="mand-trunk" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#9A7830"/>
          <stop offset="100%" stopColor="#6A5018"/>
        </linearGradient>
      </defs>

      {/* Sombra */}
      <ellipse cx="40" cy="90" rx="20" ry="5" fill="rgba(0,0,0,0.2)" filter="blur(3px)"/>

      {/* Tronco central */}
      <path d="M36,60 C34,60 34,62 34,68 L33,84 C33,88 36,89 39,89 C42,89 45,88 45,84 L44,68 C44,62 44,60 42,60 C41,60 36.5,60.5 36,60 Z"
            fill="url(#mand-trunk)"/>

      {/* Cacto principal — forma orgânica com arestas arredondadas */}
      <path d="M38,12 C32,10 28,16 28,24 C26,22 24,28 26,36 C22,34 20,42 24,50 C20,50 18,58 22,66 C18,68 18,76 24,80 C22,84 28,86 34,84 C32,88 36,90 40,88 C44,90 48,88 46,84 C52,86 58,84 56,80 C62,76 62,68 58,66 C62,58 60,50 56,50 C60,42 58,34 54,36 C56,28 54,22 50,24 C50,16 46,10 40,12 C39,11 38.5,11.5 38,12 Z"
            fill="url(#mand-body)"/>

      {/* Topo do cacto */}
      <ellipse cx="40" cy="12" rx="8" ry="5" fill="url(#mand-top)"/>

      {/* Braço esquerdo */}
      <path d="M30,35 C26,32 22,36 22,42 C20,40 18,46 22,52 C18,54 18,62 24,66 C24,70 28,72 32,70 C32,74 36,76 40,74"
            fill="url(#mand-body)" stroke="#4A6A18" strokeWidth="0.5" opacity="0.3"/>
      <ellipse cx="22" cy="35" rx="5" ry="4" fill="url(#mand-top)"/>

      {/* Braço direito */}
      <path d="M50,40 C54,37 58,41 58,47 C60,45 62,51 58,57 C62,59 62,67 56,71 C56,75 52,77 48,75"
            fill="url(#mand-body)" stroke="#4A6A18" strokeWidth="0.5" opacity="0.3"/>
      <ellipse cx="58" cy="40" rx="5" ry="4" fill="url(#mand-top)"/>

      {/* Espinhos — linhas curvas saindo */}
      <line x1="26" y1="28" x2="20" y2="24" stroke="#C8D88A" strokeWidth="1" strokeLinecap="round"/>
      <line x1="28" y1="38" x2="22" y2="36" stroke="#C8D88A" strokeWidth="1" strokeLinecap="round"/>
      <line x1="26" y1="50" x2="20" y2="50" stroke="#C8D88A" strokeWidth="1" strokeLinecap="round"/>
      <line x1="30" y1="62" x2="25" y2="64" stroke="#C8D88A" strokeWidth="1" strokeLinecap="round"/>
      <line x1="54" y1="30" x2="60" y2="26" stroke="#C8D88A" strokeWidth="1" strokeLinecap="round"/>
      <line x1="52" y1="42" x2="58" y2="40" stroke="#C8D88A" strokeWidth="1" strokeLinecap="round"/>
      <line x1="54" y1="55" x2="60" y2="55" stroke="#C8D88A" strokeWidth="1" strokeLinecap="round"/>
      <line x1="50" y1="68" x2="55" y2="72" stroke="#C8D88A" strokeWidth="1" strokeLinecap="round"/>

      {animated && (
        <style>{`
          @keyframes mand-sway {
            0%, 100% { transform: rotate(-0.5deg); transform-origin: center bottom; }
            50% { transform: rotate(0.5deg); transform-origin: center bottom; }
          }
          .mand-anim { animation: mand-sway 5s ease-in-out infinite; transform-origin: 40px 90px; }
        `}</style>
      )}
    </svg>
  )
}

function Buriti({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 80 112">
      <defs>
        <linearGradient id="buriti-trunk" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8B7355"/>
          <stop offset="100%" stopColor="#5C4A3A"/>
        </linearGradient>
        <linearGradient id="buriti-frond1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4A7C2F"/>
          <stop offset="100%" stopColor="#2D5A1E"/>
        </linearGradient>
        <linearGradient id="buriti-frond2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5A9A38"/>
          <stop offset="100%" stopColor="#3A7A20"/>
        </linearGradient>
      </defs>

      {/* Sombra */}
      <ellipse cx="40" cy="108" rx="12" ry="4" fill="rgba(0,0,0,0.18)" filter="blur(2px)"/>

      {/* Tronco fino e curvado */}
      <path d="M38,48 C37,48 37,50 37,55 L36,102 C36,106 38,107 40,107 C42,107 44,106 44,102 L43,55 C43,50 43,48 42,48 C41,48 38.5,48.5 38,48 Z"
            fill="url(#buriti-trunk)"/>

      {/* Palmeira — folhas arqueadas orgânicas */}
      {/* Folha central */}
      <path d="M40,15 C38,15 36,20 35,28 C32,25 28,30 26,38 C22,35 18,42 20,50 C16,52 18,60 22,62 C20,68 25,72 30,70 C32,75 38,76 42,72 C44,68 48,62 45,58 C50,60 52,54 50,48 C54,50 54,44 50,40 C54,36 50,30 45,32 C48,25 44,20 40,18 C40,16.5 40,15.5 40,15 Z"
            fill="url(#buriti-frond1)"/>
      {/* Folha esquerda alta */}
      <path d="M38,18 C32,15 22,20 18,30 C14,28 12,35 15,42 C10,45 12,55 18,58 C16,64 22,68 28,65 C30,70 36,72 40,68 C42,64 46,58 44,54 C48,56 50,50 48,44 C52,46 52,38 48,34 C52,30 48,24 44,26 C46,20 42,16 38,18 Z"
            fill="#3A6B25"/>
      {/* Folha direita alta */}
      <path d="M42,18 C48,15 58,20 62,30 C66,28 68,35 65,42 C70,45 68,55 62,58 C64,64 58,68 52,65 C50,70 44,72 40,68 C38,64 34,58 36,54 C32,56 30,50 32,44 C28,46 28,38 32,34 C28,30 32,24 36,26 C34,20 38,16 42,18 Z"
            fill="url(#buriti-frond2)"/>
      {/* Folha esquerda baixa */}
      <path d="M36,22 C28,20 20,26 18,35 C14,34 14,42 18,48 C14,52 16,60 22,62 C20,68 26,72 32,68 C34,72 40,73 44,70 C46,66 50,60 48,56 C52,58 54,52 52,46 C56,48 56,40 52,36 C56,32 52,26 48,28 C50,22 46,18 42,20"
            fill="#4A7C2F" opacity="0.8"/>

      {/* Frutos */}
      <ellipse cx="48" cy="55" rx="4" ry="5" fill="#6B4020"/>
      <ellipse cx="52" cy="60" rx="3" ry="4" fill="#8B5030"/>
      <ellipse cx="45" cy="62" rx="3" ry="4" fill="#6B4020"/>
      <ellipse cx="50" cy="50" rx="2.5" ry="3" fill="#7A4530"/>
    </svg>
  )
}

function Castanheira({ size = 80, animated = false }: { size?: number; animated?: boolean }) {
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 80 104" style={{ filter: 'drop-shadow(0 0 8px rgba(255,180,50,0.5))' }}>
      <defs>
        <linearGradient id="casta-trunk" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#5D4037"/>
          <stop offset="100%" stopColor="#3E2723"/>
        </linearGradient>
        <linearGradient id="casta-crown1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1D5C2A"/>
          <stop offset="100%" stopColor="#0D3A18"/>
        </linearGradient>
        <linearGradient id="casta-crown2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2A7A35"/>
          <stop offset="100%" stop-color="#1A5A20"/>
        </linearGradient>
        <radialGradient id="casta-glow" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#2A7A3A" stop-opacity="0.5"/>
          <stop offset="100%" stopColor="#0D3A18" stop-opacity="0"/>
        </radialGradient>
      </defs>

      {/* Aura */}
      <ellipse cx="40" cy="35" rx="38" ry="32" fill="url(#casta-glow)"/>

      {/* Sombra */}
      <ellipse cx="40" cy="96" rx="30" ry="7" fill="rgba(0,0,0,0.22)" filter="blur(4px)"/>

      {/* Copa achatada e extensa — múltiplas camadas orgânicas */}
      <path d="M2,38 C-5,30 5,48 15,50 C5,60 22,70 35,66 C28,78 42,82 50,74 C58,82 72,78 78,66 C90,60 85,45 75,42 C85,32 70,25 60,30 C68,20 55,15 45,22 C52,12 40,10 32,18 C22,10 8,18 2,38 Z"
            fill="#0D3A18"/>
      <path d="M5,34 C-2,26 8,44 18,46 C8,56 25,66 38,62 C32,74 46,78 54,70 C62,78 76,74 80,62 C90,56 86,41 76,38 C86,28 72,22 62,27 C70,18 58,14 48,21 C54,12 44,10 36,17 C26,10 12,18 5,34 Z"
            fill="url(#casta-crown1)"/>
      <path d="M8,30 C2,23 12,40 22,42 C14,52 30,60 42,56 C38,68 50,72 58,65 C65,72 78,68 82,57 C92,52 88,38 78,36 C86,28 74,22 65,27 C72,18 62,15 54,22 C60,14 50,12 42,18 C32,12 18,20 8,30 Z"
            fill="url(#casta-crown2)"/>

      {/* Tronco robusto */}
      <path d="M30,48 C28,48 27,52 27,60 L25,90 C25,94 30,95 38,95 C46,95 51,94 51,90 L49,60 C49,52 48,48 46,48 C44,48 31,48.5 30,48 Z"
            fill="url(#casta-trunk)"/>
      <path d="M28,55 Q30,65 29,78 Q32,68 31,55" stroke="#2A1F1A" strokeWidth="1.2" fill="none" opacity="0.4"/>
      <path d="M38,52 Q40,65 39,85 Q42,72 41,52" stroke="#2A1F1A" strokeWidth="1" fill="none" opacity="0.3"/>
      <path d="M48,54 Q49,70 48,82" stroke="#2A1F1A" strokeWidth="0.8" fill="none" opacity="0.25"/>

      {animated && (
        <style>{`
          @keyframes casta-sway {
            0%, 100% { transform: rotate(-0.6deg); transform-origin: 40px 95px; }
            50% { transform: rotate(0.6deg); transform-origin: 40px 95px; }
          }
          .casta-anim { animation: casta-sway 6s ease-in-out infinite; transform-origin: 40px 95px; }
        `}</style>
      )}
      <g className={animated ? 'casta-anim' : ''}>
        <path d="M5,38 C-2,32 4,46 12,48" stroke="#1A5A25" strokeWidth="2" fill="none" opacity="0.3"/>
        <path d="M75,36 C82,30 78,44 70,46" stroke="#0D3A18" strokeWidth="2" fill="none" opacity="0.3"/>
      </g>
    </svg>
  )
}

function PauBrasil({ size = 80, animated = false }: { size?: number; animated?: boolean }) {
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 80 104" style={{ filter: 'drop-shadow(0 0 10px rgba(255,215,0,0.65))' }}>
      <defs>
        <linearGradient id="pau-trunk" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#9A5A20"/>
          <stop offset="100%" stopColor="#6A3A10"/>
        </linearGradient>
        <linearGradient id="pau-crown" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3AAB5A"/>
          <stop offset="100%" stopColor="#1A7A35"/>
        </linearGradient>
        <radialGradient id="pau-glow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#FFD700" stop-opacity="0.45"/>
          <stop offset="100%" stopColor="#2A8A45" stop-opacity="0"/>
        </radialGradient>
      </defs>

      {/* Aura dourada */}
      <ellipse cx="40" cy="36" rx="38" ry="34" fill="url(#pau-glow)"/>

      {/* Sombra */}
      <ellipse cx="40" cy="96" rx="26" ry="6" fill="rgba(0,0,0,0.22)" filter="blur(3px)"/>

      {/* Copa verde densa em camadas orgânicas */}
      <path d="M10,40 C2,32 8,50 18,52 C8,62 25,72 38,68 C30,80 45,84 54,76 C62,84 78,78 80,65 C90,58 85,42 74,40 C84,30 70,22 60,28 C68,18 55,12 46,20 C54,10 42,8 34,16 C24,8 10,18 10,40 Z"
            fill="#1A7A35"/>
      <path d="M12,36 C5,28 12,46 22,48 C12,58 28,68 40,64 C34,76 48,80 56,72 C64,80 78,74 80,62 C90,56 84,40 74,38 C84,28 72,22 62,28 C70,18 58,14 50,22 C56,12 46,10 38,18 C28,10 15,20 12,36 Z"
            fill="url(#pau-crown)"/>
      <path d="M15,32 C8,24 16,42 26,44 C18,54 32,62 44,58 C38,70 52,74 60,66 C67,74 78,68 78,56 C88,50 82,36 72,36 C80,26 70,20 62,26 C68,18 58,14 50,22 C56,14 48,12 40,20 C32,12 20,22 15,32 Z"
            fill="#4A9A52"/>

      {/* Tronco com listras características */}
      <path d="M32,48 C30,48 29,52 29,60 L27,90 C27,94 32,95 40,95 C48,95 53,94 53,90 L51,60 C51,52 50,48 48,48 C46,48 33,48.5 32,48 Z"
            fill="url(#pau-trunk)"/>
      {/* Listras avermelhadas */}
      <path d="M31,55 Q33,62 32,72 Q35,65 34,55" stroke="#A0502D" strokeWidth="1" fill="none" opacity="0.4"/>
      <path d="M36,52 Q38,62 37,78 Q40,68 39,52" stroke="#A0502D" strokeWidth="0.8" fill="none" opacity="0.35"/>
      <path d="M41,54 Q43,65 42,80 Q45,70 44,54" stroke="#A0502D" strokeWidth="1.2" fill="none" opacity="0.3"/>
      <path d="M46,56 Q48,68 47,84" stroke="#A0502D" strokeWidth="0.7" fill="none" opacity="0.25"/>

      {/* Brilhos dourados */}
      <circle cx="22" cy="24" r="2.2" fill="#FFD700" opacity="0.6"/>
      <circle cx="55" cy="20" r="1.8" fill="#FFF" opacity="0.5"/>
      <circle cx="48" cy="38" r="1.5" fill="#FFD700" opacity="0.4"/>
      <circle cx="30" cy="45" r="1.2" fill="#FFF" opacity="0.35"/>

      {animated && (
        <style>{`
          @keyframes pau-sway {
            0%, 100% { transform: rotate(-0.8deg); transform-origin: 40px 95px; }
            50% { transform: rotate(0.8deg); transform-origin: 40px 95px; }
          }
          .pau-anim { animation: pau-sway 5.5s ease-in-out infinite; transform-origin: 40px 95px; }
        `}</style>
      )}
      <g className={animated ? 'pau-anim' : ''}>
        <path d="M10,40 C2,34 8,48 16,50" stroke="#2A8A4A" strokeWidth="1.5" fill="none" opacity="0.3"/>
        <path d="M70,38 C78,32 74,46 66,48" stroke="#1A7A35" strokeWidth="1.5" fill="none" opacity="0.3"/>
      </g>
    </svg>
  )
}

function Jequitiba({ size = 80, animated = false }: { size?: number; animated?: boolean }) {
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 80 96" style={{ filter: 'drop-shadow(0 0 5px rgba(255,180,50,0.4))' }}>
      <defs>
        <linearGradient id="jeq-trunk" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6B4A3A"/>
          <stop offset="100%" stopColor="#4A3020"/>
        </linearGradient>
        <linearGradient id="jeq-crown" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2E9E5A"/>
          <stop offset="100%" stopColor="#1A6B35"/>
        </linearGradient>
      </defs>

      <ellipse cx="40" cy="90" rx="28" ry="6" fill="rgba(0,0,0,0.2)" filter="blur(3px)"/>

      {/* Copa irregular e densa */}
      <path d="M8,38 C0,30 6,48 16,50 C6,60 22,70 35,66 C28,78 42,82 50,74 C58,82 74,76 78,64 C88,56 82,40 72,38 C82,28 68,20 58,26 C66,16 54,12 46,20 C54,10 42,8 34,16 C22,8 8,18 8,38 Z"
            fill="#1A6B35"/>
      <path d="M10,34 C3,26 10,44 20,46 C10,56 26,66 38,62 C32,74 46,78 54,70 C62,78 76,72 78,60 C88,52 82,36 72,34 C82,24 68,18 60,24 C68,14 56,10 48,18 C54,8 44,6 36,14 C26,6 12,16 10,34 Z"
            fill="url(#jeq-crown)"/>
      <path d="M14,30 C8,22 15,40 25,42 C16,52 30,60 42,56 C36,68 50,72 58,64 C65,72 78,66 78,54 C88,48 82,32 72,32 C80,22 68,16 60,22 C66,14 56,10 48,18 C54,10 46,8 38,16 C28,8 16,18 14,30 Z"
            fill="#3AAB5A"/>

      {/* Tronco muito largo */}
      <path d="M28,45 C25,45 24,50 24,58 L22,88 C22,93 28,94 38,94 C48,94 54,93 54,88 L52,58 C52,50 51,45 48,45 C46,45 29,45.5 28,45 Z"
            fill="url(#jeq-trunk)"/>
      <path d="M26,52 Q30,62 28,78 Q33,68 32,52" stroke="#3A2515" strokeWidth="1.5" fill="none" opacity="0.4"/>
      <path d="M36,50 Q40,62 38,84 Q43,72 42,50" stroke="#3A2515" strokeWidth="1.2" fill="none" opacity="0.3"/>
      <path d="M46,52 Q48,65 47,80" stroke="#3A2515" strokeWidth="0.8" fill="none" opacity="0.25"/>

      {animated && (
        <style>{`
          @keyframes jeq-sway {
            0%, 100% { transform: rotate(-0.7deg); transform-origin: 40px 92px; }
            50% { transform: rotate(0.7deg); transform-origin: 40px 92px; }
          }
          .jeq-anim { animation: jeq-sway 5s ease-in-out infinite; transform-origin: 40px 92px; }
        `}</style>
      )}
    </svg>
  )
}

function Palmito({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 80 112">
      <defs>
        <linearGradient id="pal-trunk" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7A6A5A"/>
          <stop offset="100%" stopColor="#5A4A3A"/>
        </linearGradient>
        <linearGradient id="pal-frond" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2E9E5A"/>
          <stop offset="100%" stopColor="#1A6B35"/>
        </linearGradient>
      </defs>

      <ellipse cx="40" cy="108" rx="10" ry="3" fill="rgba(0,0,0,0.15)" filter="blur(2px)"/>

      {/* Tronco esbelto */}
      <path d="M37,45 C36,45 36,48 36,52 L35,102 C35,106 38,107 42,107 C46,107 49,106 49,102 L48,52 C48,48 48,45 47,45 C46,45 37.5,45.5 37,45 Z"
            fill="url(#pal-trunk)"/>

      {/* Palmeira esbelta com folhas em leque */}
      <path d="M40,12 C38,12 35,18 34,26 C30,22 26,28 24,36 C20,32 16,40 18,48 C14,52 16,60 20,62 C18,68 24,72 30,70 C32,75 38,76 44,72 C46,68 50,62 48,58 C52,60 54,54 52,48 C56,50 56,42 52,38 C56,34 52,28 48,30 C50,24 46,18 42,16 C41,14 40.5,12.5 40,12 Z"
            fill="url(#pal-frond)"/>
      <path d="M38,16 C32,12 22,18 18,28 C14,26 12,34 16,40 C10,44 12,54 18,56 C16,62 22,66 28,64 C28,70 35,72 40,68 C43,64 48,58 46,54 C50,56 52,50 50,44 C54,46 54,38 50,34 C54,30 50,24 46,26 C48,20 44,14 40,16 Z"
            fill="#2A7A45" opacity="0.8"/>
      <path d="M42,16 C48,12 58,18 62,28 C66,26 68,34 64,40 C70,44 68,54 62,56 C64,62 58,66 52,64 C52,70 45,72 40,68 C37,64 32,58 34,54 C30,56 28,50 30,44 C26,46 26,38 30,34 C26,30 30,24 34,26 C32,20 36,14 40,16 Z"
            fill="#3AAB5A" opacity="0.8"/>
    </svg>
  )
}

function Caranda({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 80 104">
      <defs>
        <linearGradient id="car-trunk" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6A5A4A"/>
          <stop offset="100%" stopColor="#4A3A2A"/>
        </linearGradient>
        <linearGradient id="car-frond" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3AB8A0"/>
          <stop offset="100%" stopColor="#1E7A6A"/>
        </linearGradient>
      </defs>

      <ellipse cx="40" cy="100" rx="12" ry="4" fill="rgba(0,0,0,0.15)" filter="blur(2px)"/>

      <path d="M37,45 C36,45 36,50 36,55 L35,96 C35,100 38,101 42,101 C46,101 49,100 49,96 L48,55 C48,50 48,45 47,45 C46,45 37.5,45.5 37,45 Z"
            fill="url(#car-trunk)"/>

      {/* Palmeira do Pantanal */}
      <path d="M40,12 C38,12 35,18 34,26 C30,22 26,28 24,36 C20,32 16,40 18,48 C14,52 16,60 20,62 C18,68 24,72 30,70 C32,75 38,76 44,72 C46,68 50,62 48,58 C52,60 54,54 52,48 C56,50 56,42 52,38 C56,34 52,28 48,30 C50,24 46,18 42,16 C41,14 40.5,12.5 40,12 Z"
            fill="url(#car-frond)"/>
      <path d="M38,15 C30,10 20,16 18,26 C14,24 12,32 16,38 C10,42 12,52 18,54 C16,60 22,64 28,62 C28,68 35,70 40,66 C43,62 48,56 46,52 C50,54 52,48 50,42 C54,44 54,36 50,32 C54,28 50,22 46,24 C48,18 44,12 40,15 Z"
            fill="#2AA08A" opacity="0.85"/>
      <path d="M42,15 C50,10 60,16 62,26 C66,24 68,32 64,38 C70,42 68,52 62,54 C64,60 58,64 52,62 C52,68 45,70 40,66 C37,62 32,56 34,52 C30,54 28,48 30,42 C26,44 26,36 30,32 C26,28 30,22 34,24 C32,18 36,12 40,15 Z"
            fill="#3AB8A0" opacity="0.85"/>

      <ellipse cx="40" cy="12" rx="6" ry="4" fill="#4AC8B0"/>
    </svg>
  )
}

function Cambara({ size = 80, animated = false }: { size?: number; animated?: boolean }) {
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 80 96">
      <defs>
        <linearGradient id="cam-trunk" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#5A6A4A"/>
          <stop offset="100%" stopColor="#3A4A3A"/>
        </linearGradient>
        <linearGradient id="cam-crown" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3AB8A0"/>
          <stop offset="100%" stopColor="#1E7A6A"/>
        </linearGradient>
      </defs>

      <ellipse cx="40" cy="90" rx="22" ry="5" fill="rgba(0,0,0,0.18)" filter="blur(3px)"/>

      <path d="M18,38 C8,30 12,50 22,52 C12,64 28,74 40,70 C32,82 48,86 56,78 C64,86 80,80 82,66 C92,58 86,42 76,40 C86,30 72,22 62,28 C70,18 56,14 48,22 C54,12 42,10 32,18 C20,10 6,22 18,38 Z"
            fill="#1E7A6A"/>
      <path d="M20,34 C12,26 16,46 26,48 C16,60 32,70 44,66 C36,78 52,82 60,74 C68,82 82,76 82,62 C92,54 86,38 76,36 C86,26 72,20 64,26 C70,16 58,12 50,20 C56,10 46,8 36,16 C24,8 10,20 20,34 Z"
            fill="url(#cam-crown)"/>

      <path d="M33,48 C31,48 30,52 30,58 L28,86 C28,90 33,91 41,91 C49,91 54,90 54,86 L52,58 C52,52 51,48 49,48 C47,48 34,48.5 33,48 Z"
            fill="url(#cam-trunk)"/>

      {/* Galhos retorcidos */}
      <path d="M28,55 C20,52 12,56 6,64" stroke="#3A4A3A" strokeWidth="2" fill="none" opacity="0.5"/>
      <path d="M52,55 C60,52 68,56 74,64" stroke="#3A4A3A" strokeWidth="2" fill="none" opacity="0.5"/>

      {animated && (
        <style>{`
          @keyframes cam-sway {
            0%, 100% { transform: rotate(-1deg); transform-origin: 40px 90px; }
            50% { transform: rotate(1deg); transform-origin: 40px 90px; }
          }
          .cam-anim { animation: cam-sway 5s ease-in-out infinite; transform-origin: 40px 90px; }
        `}</style>
      )}
    </svg>
  )
}

function Pequizeiro({ size = 80, animated = false }: { size?: number; animated?: boolean }) {
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 80 96">
      <defs>
        <linearGradient id="peq-trunk" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#5A4020"/>
          <stop offset="100%" stopColor="#3A2A15"/>
        </linearGradient>
        <linearGradient id="peq-crown" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5A9A3A"/>
          <stop offset="100%" stopColor="#2D5A1E"/>
        </linearGradient>
      </defs>

      <ellipse cx="40" cy="90" rx="24" ry="5" fill="rgba(0,0,0,0.18)" filter="blur(3px)"/>

      <path d="M8,40 C0,32 8,50 18,52 C8,64 26,74 40,70 C32,82 48,86 56,78 C64,86 80,80 80,66 C90,58 84,42 74,40 C84,30 70,22 60,28 C68,18 55,14 47,22 C54,12 43,10 35,18 C23,10 8,22 8,40 Z"
            fill="#2D5A1E"/>
      <path d="M10,36 C3,28 12,46 22,48 C12,60 30,70 42,66 C34,78 50,82 58,74 C66,82 80,76 78,62 C88,54 82,38 72,36 C82,26 68,20 60,26 C68,16 55,12 47,20 C54,10 43,8 35,16 C23,8 10,20 10,36 Z"
            fill="url(#peq-crown)"/>

      <path d="M33,48 C31,48 30,52 30,58 L28,86 C28,90 33,91 41,91 C49,91 54,90 54,86 L52,58 C52,52 51,48 49,48 C47,48 34,48.5 33,48 Z"
            fill="url(#peq-trunk)"/>

      {animated && (
        <style>{`
          @keyframes peq-sway {
            0%, 100% { transform: rotate(-1.2deg); transform-origin: 40px 90px; }
            50% { transform: rotate(1.2deg); transform-origin: 40px 90px; }
          }
          .peq-anim { animation: peq-sway 4.5s ease-in-out infinite; transform-origin: 40px 90px; }
        `}</style>
      )}
    </svg>
  )
}

function Seringueira({ size = 80, animated = false }: { size?: number; animated?: boolean }) {
  return (
    <svg width={size} height={size * 1.25} viewBox="0 0 80 100" style={{ filter: 'drop-shadow(0 0 5px rgba(255,180,50,0.4))' }}>
      <defs>
        <linearGradient id="ser-trunk" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#5A4A3A"/>
          <stop offset="100%" stopColor="#3E2E2A"/>
        </linearGradient>
        <linearGradient id="ser-crown" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1D5C2A"/>
          <stop offset="100%" stopColor="#0D3A18"/>
        </linearGradient>
        <radialGradient id="ser-glow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#2A7A3A" stop-opacity="0.35"/>
          <stop offset="100%" stopColor="#0D3A18" stop-opacity="0"/>
        </radialGradient>
      </defs>

      <ellipse cx="40" cy="32" rx="35" ry="28" fill="url(#ser-glow)"/>
      <ellipse cx="40" cy="92" rx="26" ry="6" fill="rgba(0,0,0,0.2)" filter="blur(3px)"/>

      <path d="M5,38 C-2,30 5,48 15,50 C5,62 22,72 35,68 C28,80 42,84 50,76 C58,84 74,78 78,65 C88,58 82,42 72,40 C82,30 68,22 58,28 C66,18 53,14 45,22 C53,12 41,10 33,18 C21,10 6,22 5,38 Z"
            fill="#0D3A18"/>
      <path d="M8,34 C2,26 10,44 20,46 C10,58 28,68 40,64 C34,76 48,80 56,72 C64,80 78,74 80,61 C90,54 84,38 74,36 C84,26 70,20 62,26 C70,16 58,12 50,20 C56,10 46,8 38,16 C26,8 12,20 8,34 Z"
            fill="url(#ser-crown)"/>
      <path d="M12,30 C6,22 15,40 25,42 C16,54 32,62 44,58 C38,70 52,74 60,66 C67,74 78,68 78,56 C88,50 82,34 72,34 C80,24 68,18 60,24 C66,16 56,12 48,20 C54,12 46,10 38,18 C28,12 15,22 12,30 Z"
            fill="#2A7A35"/>

      <path d="M32,48 C30,48 29,52 29,58 L27,88 C27,92 32,93 40,93 C48,93 53,92 53,88 L51,58 C51,52 50,48 48,48 C46,48 33,48.5 32,48 Z"
            fill="url(#ser-trunk)"/>
      <path d="M30,55 Q33,65 32,78 Q36,68 35,55" stroke="#2A1F1A" strokeWidth="1" fill="none" opacity="0.35"/>
      <path d="M40,52 Q42,65 41,82 Q45,70 44,52" stroke="#2A1F1A" strokeWidth="0.8" fill="none" opacity="0.3"/>

      {animated && (
        <style>{`
          @keyframes ser-sway {
            0%, 100% { transform: rotate(-0.7deg); transform-origin: 40px 92px; }
            50% { transform: rotate(0.7deg); transform-origin: 40px 92px; }
          }
          .ser-anim { animation: ser-sway 5.5s ease-in-out infinite; transform-origin: 40px 92px; }
        `}</style>
      )}
    </svg>
  )
}

function GenericTree({ biome, rarity, size = 80 }: { biome: keyof typeof BIOME_GRADIENTS; rarity: string; size?: number }) {
  const colors = BIOME_GRADIENTS[biome]
  const glowFilter = rarity === 'lendario' ? 'drop-shadow(0 0 8px rgba(255,215,0,0.6))'
    : rarity === 'epico' ? 'drop-shadow(0 0 4px rgba(255,180,50,0.4))' : 'none'

  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 80 96" style={{ filter: glowFilter }}>
      <defs>
        <linearGradient id={`generic-crown-${biome}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={colors.light}/>
          <stop offset="100%" stopColor={colors.dark}/>
        </linearGradient>
        <linearGradient id={`generic-trunk-${biome}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={colors.base}/>
          <stop offset="100%" stopColor={colors.dark}/>
        </linearGradient>
      </defs>

      <ellipse cx="40" cy="90" rx="22" ry="5" fill="rgba(0,0,0,0.18)" filter="blur(3px)"/>

      <path d="M12,38 C4,30 10,48 20,50 C10,62 28,72 40,68 C32,80 48,84 56,76 C64,84 80,78 80,64 C90,56 84,40 74,38 C84,28 70,20 60,26 C68,16 55,12 47,20 C54,10 43,8 35,16 C23,8 10,20 12,38 Z"
            fill={colors.dark}/>
      <path d="M14,34 C7,26 14,44 24,46 C14,58 32,68 44,64 C36,76 50,80 58,72 C66,80 80,74 80,60 C90,52 84,36 74,34 C84,24 70,18 62,24 C70,14 58,10 50,18 C56,8 46,6 38,14 C26,6 12,18 14,34 Z"
            fill={`url(#generic-crown-${biome})`}/>
      <path d="M18,30 C12,22 18,40 28,42 C18,54 35,62 46,58 C40,70 54,74 62,66 C69,74 80,68 78,54 C88,48 82,32 72,32 C80,22 68,16 60,22 C66,14 56,10 48,18 C54,10 46,8 38,16 C28,8 16,18 18,30 Z"
            fill={colors.light}/>

      <path d="M33,48 C31,48 30,52 30,58 L28,86 C28,90 33,91 41,91 C49,91 54,90 54,86 L52,58 C52,52 51,48 49,48 C47,48 34,48.5 33,48 Z"
            fill={`url(#generic-trunk-${biome})`}/>
    </svg>
  )
}

export default TreeSprite
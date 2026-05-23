'use client'

import React from 'react'

interface TreeSpriteProps {
  species: string
  biome: 'caatinga' | 'cerrado' | 'mata-atlantica' | 'pantanal' | 'amazonia'
  rarity: 'comum' | 'incomum' | 'raro' | 'epico' | 'lendario'
  size?: number
  animated?: boolean
}

export function TreeSprite({ species, biome, rarity, size = 80, animated = false }: TreeSpriteProps) {
  const key = species.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  const glowIntensity = rarity === 'lendario' ? 1 : rarity === 'epico' ? 0.7 : rarity === 'raro' ? 0.4 : 0

  return (
    <div style={{ width: size, height: size * 1.4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {key === 'mandacaru' && <Mandacaru size={size} animated={animated} />}
      {key === 'juazeiro' && <Juazeiro size={size} animated={animated} />}
      {key === 'aroeira' && <Aroeira size={size} animated={animated} />}
      {key === 'ipe-amarelo' && <IpeAmarelo size={size} animated={animated || rarity === 'raro'} />}
      {key === 'ipe-rosa' && <IpeRosa size={size} animated={animated} />}
      {key === 'buriti' && <Buriti size={size} />}
      {key === 'pequizeiro' && <Pequizeiro size={size} animated={animated} />}
      {key === 'castanheira' && <Castanheira size={size} animated={animated} />}
      {key === 'jequitiba' && <Jequitiba size={size} animated={animated} />}
      {key === 'palmito-juçara' && <Palmito size={size} />}
      {key === 'pau-brasil' && <PauBrasil size={size} animated={animated || rarity === 'epico'} />}
      {key === 'caranda' && <Caranda size={size} />}
      {key === 'cambara' && <Cambara size={size} animated={animated} />}
      {key === 'samauma' && <Samauma size={size} animated={animated || rarity === 'lendario'} />}
      {key === 'seringueira' && <Seringueira size={size} animated={animated} />}
      {key === 'andiroba' && <Andiroba size={size} animated={animated} />}
      {key === 'acai' && <Acai size={size} animated={animated} />}
      {!['mandacaru','juazeiro','aroeira','ipe-amarelo','ipe-rosa','buriti','pequizeiro','castanheira','jequitiba','palmito-juçara','pau-brasil','caranda','cambara','samauma','seringueira','andiroba','acai'].includes(key) && (
        <GenericTree biome={biome} rarity={rarity} size={size} />
      )}
    </div>
  )
}

// ============================================================
// MANDACARU — Colunar 3D com costelas, braços e espinhos
// ============================================================
function Mandacaru({ size = 80, animated = false }: { size?: number; animated?: boolean }) {
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 80 104" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Gradientes do cacto — luz da esquerda */}
        <linearGradient id="mc-body" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7DAE38"/>
          <stop offset="25%" stopColor="#6A9E28"/>
          <stop offset="70%" stopColor="#4A7E18"/>
          <stop offset="100%" stopColor="#3A5E10"/>
        </linearGradient>
        <linearGradient id="mc-body-dark" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#5A8E20"/>
          <stop offset="100%" stopColor="#2A4E08"/>
        </linearGradient>
        <linearGradient id="mc-top" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#B8D860"/>
          <stop offset="100%" stopColor="#98B840"/>
        </linearGradient>
        <linearGradient id="mc-trunk-base" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8A6A28"/>
          <stop offset="50%" stopColor="#6A4A18"/>
          <stop offset="100%" stopColor="#4A3010"/>
        </linearGradient>
        {/* Sulcos / costelas */}
        <linearGradient id="mc-rib" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4A7E18"/>
          <stop offset="100%" stopColor="#3A5E10"/>
        </linearGradient>
        {/* Filtro espinho */}
        <filter id="mc-glow">
          <feGaussianBlur stdDeviation="1" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Sombra projetada no chão */}
      <ellipse cx="40" cy="100" rx="18" ry="5" fill="rgba(0,0,0,0.3)" filter="url(#mc-glow)"/>

      {/* Tronco-base */}
      <g id="trunk">
        <path d="M35,68 C33,68 32,70 32,76 L31,92 C31,96 34,97 38,97 C42,97 45,96 45,92 L44,76 C44,70 43,68 41,68 C40,68 35.5,68.5 35,68 Z"
              fill="url(#mc-trunk-base)"/>
        {/* Sulcos verticais no tronco */}
        <path d="M33,72 Q34,82 33,92" stroke="#3A2A08" strokeWidth="0.8" fill="none" opacity="0.4"/>
        <path d="M37,70 Q38,82 37,94" stroke="#3A2A08" strokeWidth="0.6" fill="none" opacity="0.3"/>
        <path d="M41,72 Q42,84 41,93" stroke="#3A2A08" strokeWidth="0.7" fill="none" opacity="0.35"/>
      </g>

      {/* Cacto principal — colunar com costelas */}
      <g id="canopy">
        {/* Costela principal — frente */}
        <path d="M38,10 C30,8 26,16 26,26 C24,24 22,30 24,38 C20,36 18,44 22,52 C18,52 16,60 20,68 C18,72 18,80 22,84 C21,88 26,90 32,89 C31,93 35,95 40,94 C45,95 49,93 48,89 C54,91 60,89 58,85 C64,81 64,73 60,71 C64,63 62,55 58,55 C62,47 60,39 56,41 C58,33 56,26 52,28 C52,20 48,13 42,14 C41,12 39.5,10.5 38,10 Z"
              fill="url(#mc-body)"/>

        {/* Costela esquerda (sombra) */}
        <path d="M38,12 C35,11 31,16 31,26 C29,24 27,30 29,38 C25,36 23,44 27,52 C23,52 21,60 25,68 C23,72 23,80 27,84 C27,88 32,89 36,89 C35,92 38,93 41,93"
              fill="none" stroke="#2A4E08" strokeWidth="1.5" opacity="0.5"/>

        {/* Highlight lado esquerdo (luz) */}
        <path d="M30,20 C28,28 30,36 28,44 C26,40 24,34 28,30 C26,38 28,46 26,54 C24,50 22,44 26,40"
              fill="none" stroke="#A8D050" strokeWidth="1.2" opacity="0.3"/>

        {/* Topo aredondado do cacto */}
        <ellipse cx="40" cy="10" rx="9" ry="6" fill="url(#mc-top)"/>
        <ellipse cx="40" cy="9" rx="5" ry="3" fill="#C8E060" opacity="0.4"/>

        {/* Braço esquerdo */}
        <path d="M30,40 C26,38 20,40 18,46 C16,44 14,50 18,56 C14,58 14,66 20,70 C20,74 24,76 28,74 C28,78 32,80 36,79"
              fill="url(#mc-body)"/>
        {/* Sulcos do braço esquerdo */}
        <path d="M24,48 Q22,56 22,64" stroke="#2A4E08" strokeWidth="0.6" fill="none" opacity="0.4"/>
        {/* Topo do braço esquerdo */}
        <ellipse cx="18" cy="45" rx="6" ry="4" fill="url(#mc-top)"/>

        {/* Braço direito */}
        <path d="M50,42 C54,40 60,42 62,48 C64,46 66,52 62,58 C66,60 66,68 60,72 C60,76 56,78 52,76 C52,80 48,82 44,81"
              fill="url(#mc-body)"/>
        <path d="M56,50 Q58,58 58,66" stroke="#2A4E08" strokeWidth="0.6" fill="none" opacity="0.4"/>
        <ellipse cx="62" cy="47" rx="6" ry="4" fill="url(#mc-top)"/>

        {/* Braço superior esquerdo (mais alto) */}
        <path d="M32,28 C28,26 24,28 22,34 C20,32 18,38 22,44 C18,46 18,54 22,58 C22,62 26,64 30,62"
              fill="url(#mc-body)"/>
        <ellipse cx="22" cy="33" rx="5" ry="3.5" fill="url(#mc-top)"/>

        {/* Espinhos — micro paths brancos/amarelados */}
        <g filter="url(#mc-glow)">
          {/* Espinhos lado esquerdo */}
          <path d="M26,22 L20,18 M26,32 L19,30 M26,44 L19,44 M28,56 L21,57"
                stroke="#E8F0A0" strokeWidth="0.8" strokeLinecap="round"/>
          {/* Espinhos lado direito */}
          <path d="M54,24 L60,20 M54,34 L61,32 M54,46 L61,46 M52,58 L59,59"
                stroke="#E8F0A0" strokeWidth="0.8" strokeLinecap="round"/>
          {/* Espinhos frente */}
          <path d="M36,16 L36,10 M42,18 L44,12 M38,30 L37,24"
                stroke="#E8F0A0" strokeWidth="0.7" strokeLinecap="round"/>
        </g>
      </g>

      {/* VFX — brilho sutil para comum */}
      {animated && (
        <style>{`
          @keyframes mand-sway {
            0%, 100% { transform: rotate(-0.4deg); transform-origin: 40px 97px; }
            50% { transform: rotate(0.4deg); transform-origin: 40px 97px; }
          }
          .mc-anim { animation: mand-sway 6s ease-in-out infinite; }
        `}</style>
      )}
      <g className={animated ? 'mc-anim' : ''}></g>
    </svg>
  )
}

// ============================================================
// IPÊ AMARELO — Copa de flores amarelas volumétrica
// ============================================================
function IpeAmarelo({ size = 80, animated = false }: { size?: number; animated?: boolean }) {
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 80 104" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Gradientes de flor — luz top-left */}
        <radialGradient id="ipe-flower-core" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#FFF060"/>
          <stop offset="40%" stopColor="#FFD700"/>
          <stop offset="75%" stopColor="#F5A823"/>
          <stop offset="100%" stopColor="#D88010"/>
        </radialGradient>
        <radialGradient id="ipe-flower-mid" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#FFE44D"/>
          <stop offset="50%" stopColor="#F5B823"/>
          <stop offset="100%" stopColor="#C07808"/>
        </radialGradient>
        <radialGradient id="ipe-flower-shadow" cx="60%" cy="60%" r="60%">
          <stop offset="0%" stopColor="#F5A823"/>
          <stop offset="100%" stopColor="#8B5010"/>
        </radialGradient>
        <linearGradient id="ipe-trunk" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6A4A30"/>
          <stop offset="40%" stopColor="#5A3A22"/>
          <stop offset="100%" stopColor="#3A2010"/>
        </linearGradient>
        <linearGradient id="ipe-trunk-dark" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4A2A15"/>
          <stop offset="100%" stopColor="#2A1808"/>
        </linearGradient>
        {/* Filtros de brilho */}
        <filter id="ipe-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur"/>
          <feColorMatrix in="blur" type="matrix"
            values="1 0.8 0 0 0.3  0.8 0.6 0 0 0.2  0 0 0 0 0  0 0 0 1 0" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="ipe-aura" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur"/>
          <feColorMatrix in="blur" type="matrix"
            values="1 0.9 0 0 0.5  0.9 0.7 0 0 0.3  0 0 0 0 0  0 0 0 0.5 0" result="auraBlur"/>
          <feMerge><feMergeNode in="auraBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="ipe-shadow-blur">
          <feGaussianBlur stdDeviation="2"/>
        </filter>
      </defs>

      {/* Aura dourada por trás da copa */}
      <ellipse cx="40" cy="42" rx="38" ry="36" fill="#FFD700" opacity="0.15" filter="url(#ipe-aura)"/>

      {/* Sombra projetada */}
      <ellipse cx="40" cy="98" rx="26" ry="7" fill="rgba(0,0,0,0.3)" filter="url(#ipe-shadow-blur)"/>

      {/* Copa — múltiplas camadas de flores em clusters orgânicos */}
      <g id="canopy" filter="url(#ipe-glow)">
        {/* Camada de trás (shadow cluster) */}
        <path d="M18,38 C8,30 6,50 16,55 C6,66 20,78 34,73 C28,85 42,90 50,82 C58,90 74,84 78,70 C88,62 82,45 72,42 C82,30 66,22 56,28 C64,18 52,14 44,22 C50,12 38,10 30,18 C20,10 8,22 18,38 Z"
              fill="#C07808" opacity="0.6"/>
        {/* Cluster médio */}
        <path d="M15,34 C5,26 10,46 20,50 C10,62 25,72 38,68 C32,80 46,84 54,76 C62,84 76,78 78,64 C88,56 82,40 72,38 C82,26 66,20 58,26 C66,16 54,12 46,20 C52,10 40,8 32,16 C22,8 8,20 15,34 Z"
              fill="url(#ipe-flower-shadow)"/>
        {/* Cluster frontal principal */}
        <path d="M12,32 C2,24 8,44 18,48 C6,60 22,70 36,66 C28,78 42,82 50,74 C58,82 74,76 76,62 C86,54 80,38 70,36 C80,24 64,18 56,24 C64,14 52,10 44,18 C50,8 38,6 30,14 C20,6 6,18 12,32 Z"
              fill="url(#ipe-flower-mid)"/>
        {/* Cluster superior (highlights) */}
        <path d="M18,28 C10,20 16,38 26,42 C16,54 30,62 42,58 C36,70 48,74 56,66 C62,72 74,66 74,54 C84,48 78,34 68,34 C76,24 64,18 56,24 C62,16 52,12 44,20 C50,12 40,10 32,18 C22,10 12,20 18,28 Z"
              fill="url(#ipe-flower-core)"/>

        {/* Clusters de flores individuais — aglomerados */}
        {/* Centro-cima */}
        <circle cx="40" cy="26" r="8" fill="url(#ipe-flower-core)" opacity="0.9"/>
        <circle cx="40" cy="26" r="4" fill="#FFFFA0" opacity="0.6"/>
        {/* Esquerda cima */}
        <circle cx="24" cy="30" r="7" fill="url(#ipe-flower-mid)" opacity="0.85"/>
        <circle cx="24" cy="30" r="3" fill="#FFF860" opacity="0.5"/>
        {/* Direita cima */}
        <circle cx="56" cy="28" r="7" fill="url(#ipe-flower-mid)" opacity="0.85"/>
        <circle cx="56" cy="28" r="3" fill="#FFF860" opacity="0.5"/>
        {/* Esquerda meio */}
        <circle cx="18" cy="44" r="6" fill="url(#ipe-flower-shadow)" opacity="0.8"/>
        <circle cx="18" cy="44" r="2.5" fill="#FFD700" opacity="0.5"/>
        {/* Direita meio */}
        <circle cx="62" cy="42" r="6" fill="url(#ipe-flower-shadow)" opacity="0.8"/>
        <circle cx="62" cy="42" r="2.5" fill="#FFD700" opacity="0.5"/>
        {/* Baixo centro */}
        <circle cx="40" cy="52" r="7" fill="url(#ipe-flower-mid)" opacity="0.8"/>
        <circle cx="40" cy="52" r="3" fill="#FFE860" opacity="0.5"/>
        {/* Clusters extras */}
        <circle cx="30" cy="38" r="5" fill="url(#ipe-flower-core)" opacity="0.75"/>
        <circle cx="50" cy="40" r="5" fill="url(#ipe-flower-core)" opacity="0.75"/>
        <circle cx="28" cy="54" r="4" fill="url(#ipe-flower-shadow)" opacity="0.7"/>
        <circle cx="52" cy="54" r="4" fill="url(#ipe-flower-shadow)" opacity="0.7"/>
        <circle cx="36" cy="64" r="4" fill="url(#ipe-flower-mid)" opacity="0.65"/>
        <circle cx="48" cy="62" r="3.5" fill="url(#ipe-flower-mid)" opacity="0.6"/>
        {/* Flores pequenas de detalhe */}
        <circle cx="22" cy="50" r="2.5" fill="#FFD700" opacity="0.5"/>
        <circle cx="58" cy="50" r="2.5" fill="#FFD700" opacity="0.5"/>
        <circle cx="34" cy="30" r="3" fill="#FFFAAA" opacity="0.6"/>
        <circle cx="46" cy="32" r="3" fill="#FFFAAA" opacity="0.6"/>
      </g>

      {/* Tronco com fissuras */}
      <g id="trunk">
        <path d="M34,56 C32,56 31,60 31,66 L29,90 C29,94 33,95 37,95 C41,95 45,94 45,90 L43,66 C43,60 42,56 40,56 C39,56 34.5,56.5 34,56 Z"
              fill="url(#ipe-trunk)"/>
        {/* Lado escuro do tronco */}
        <path d="M34,56 C32,56 31,60 31,66 L29,90 C29,94 33,95 37,95"
              fill="none" stroke="#3A2010" strokeWidth="2" opacity="0.4"/>
        {/* Fissuras */}
        <path d="M33,62 Q35,68 34,75 Q37,70 36,64" stroke="#2A1005" strokeWidth="0.9" fill="none" opacity="0.5"/>
        <path d="M38,60 Q40,68 39,80 Q42,72 41,60" stroke="#2A1005" strokeWidth="0.7" fill="none" opacity="0.4"/>
        <path d="M43,64 Q44,72 43,82" stroke="#2A1005" strokeWidth="0.6" fill="none" opacity="0.35"/>
        {/* Nodos/galhos no tronco */}
        <path d="M31,72 Q28,70 26,72" stroke="#4A2A15" strokeWidth="1" fill="none" opacity="0.4"/>
        <path d="M43,68 Q46,66 48,68" stroke="#4A2A15" strokeWidth="1" fill="none" opacity="0.4"/>
      </g>

      {animated && (
        <style>{`
          @keyframes ipe-sway {
            0%, 100% { transform: rotate(-1.5deg) translateX(-0.3px); transform-origin: 40px 95px; }
            50% { transform: rotate(1.5deg) translateX(0.3px); transform-origin: 40px 95px; }
          }
          .ipe-anim { animation: ipe-sway 5s ease-in-out infinite; }
        `}</style>
      )}
      <g className={animated ? 'ipe-anim' : ''}>
        {/* Ramificações extras */}
        <path d="M22,50 C14,48 8,52 4,60 C8,58 14,55 22,58" fill="#C07808" opacity="0.5"/>
        <path d="M58,48 C66,46 72,50 76,58 C72,56 66,53 58,56" fill="#D08810" opacity="0.5"/>
      </g>
    </svg>
  )
}

// ============================================================
// SAMAÚMA — Lendário com sapopemas e partículas mágicas
// ============================================================
function Samauma({ size = 80, animated = false }: { size?: number; animated?: boolean }) {
  return (
    <svg width={size} height={size * 1.5} viewBox="0 0 80 120" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sam-trunk" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6A5040"/>
          <stop offset="50%" stopColor="#5A4030"/>
          <stop offset="100%" stopColor="#3A2518"/>
        </linearGradient>
        <linearGradient id="sam-trunk-dark" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4A3020"/>
          <stop offset="100%" stopColor="#2A1808"/>
        </linearGradient>
        <linearGradient id="sam-crown-back" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0A4A18"/>
          <stop offset="100%" stopColor="#062810"/>
        </linearGradient>
        <linearGradient id="sam-crown-mid" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1A6A28"/>
          <stop offset="100%" stopColor="#0A4A18"/>
        </linearGradient>
        <linearGradient id="sam-crown-front" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2A8A38"/>
          <stop offset="100%" stopColor="#1A5A22"/>
        </linearGradient>
        <linearGradient id="sam-crown-top" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3AAA48"/>
          <stop offset="100%" stopColor="#2A8A32"/>
        </linearGradient>
        <linearGradient id="sam-root" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5A4530"/>
          <stop offset="100%" stopColor="#3A2515"/>
        </linearGradient>
        <linearGradient id="sam-root-dark" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4A3520"/>
          <stop offset="100%" stopColor="#2A1808"/>
        </linearGradient>
        {/* Aura mágica */}
        <radialGradient id="sam-magic-aura" cx="50%" cy="55%" r="55%">
          <stop offset="0%" stopColor="#80FF40" stopOpacity="0.5"/>
          <stop offset="40%" stopColor="#FFD700" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#004010" stopOpacity="0"/>
        </radialGradient>
        {/* Filtros VFX */}
        <filter id="sam-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur"/>
          <feColorMatrix in="blur" type="matrix"
            values="0.5 1 0.3 0 0.2  0.3 0.8 0.2 0 0.1  0 0.3 0 0 0  0 0 0 0.7 0" result="greenGlow"/>
          <feMerge><feMergeNode in="greenGlow"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="sam-gold-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur"/>
          <feColorMatrix in="blur" type="matrix"
            values="1 0.8 0 0 0.5  0.8 0.6 0 0 0.3  0 0 0 0 0  0 0 0 0.6 0" result="goldGlow"/>
          <feMerge><feMergeNode in="goldGlow"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="sam-root-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="sam-shadow-blur">
          <feGaussianBlur stdDeviation="3"/>
        </filter>
        <filter id="sam-particle-blur">
          <feGaussianBlur stdDeviation="1.5"/>
        </filter>
      </defs>

      {/* Aura mágica global */}
      <ellipse cx="40" cy="48" rx="42" ry="50" fill="url(#sam-magic-aura)" filter="url(#sam-glow)"/>

      {/* Sombra projetada com blur */}
      <ellipse cx="40" cy="113" rx="38" ry="8" fill="rgba(0,0,0,0.35)" filter="url(#sam-shadow-blur)"/>

      {/* SAPOPEMAS — raízes tabulares gigantes */}
      <g id="roots" filter="url(#sam-root-glow)">
        {/* Sapopema esquerda principal */}
        <path d="M34,72 C28,74 18,78 10,84 C6,88 4,94 6,102 C10,100 16,96 26,90 C20,86 26,78 34,72 Z"
              fill="url(#sam-root)"/>
        <path d="M32,76 C26,80 16,84 10,90 C12,92 14,94 16,93 C22,88 28,83 32,78"
              stroke="#2A1808" strokeWidth="1" fill="none" opacity="0.5"/>
        {/* Sapopema esquerda secundária */}
        <path d="M30,78 C22,80 12,86 6,94 C8,96 10,98 12,97 C18,91 26,84 32,78"
              fill="#4A3520" opacity="0.85"/>
        {/* Sapopema esquerda terciária */}
        <path d="M28,82 C18,85 10,92 4,102 C6,104 8,105 10,103 C16,95 24,88 30,82"
              fill="#5A4530" opacity="0.7"/>

        {/* Sapopema direita principal */}
        <path d="M46,72 C52,74 62,78 70,84 C74,88 76,94 74,102 C70,100 64,96 54,90 C60,86 54,78 46,72 Z"
              fill="url(#sam-root-dark)"/>
        <path d="M48,76 C54,80 64,84 70,90 C68,92 66,94 64,93 C58,88 52,83 48,78"
              stroke="#2A1808" strokeWidth="1" fill="none" opacity="0.5"/>
        {/* Sapopema direita secundária */}
        <path d="M50,78 C58,80 68,86 74,94 C72,96 70,98 68,97 C62,91 54,84 50,78"
              fill="#3A2515" opacity="0.85"/>
        {/* Sapopema direita terciária */}
        <path d="M52,82 C62,85 70,92 76,102 C74,104 72,105 70,103 C64,95 56,88 52,82"
              fill="#4A3520" opacity="0.7"/>

        {/* Sapopema frontal esquerda */}
        <path d="M32,84 C24,86 14,92 8,102 C10,104 12,105 14,103 C20,93 28,87 34,83"
              fill="#5A4530" opacity="0.6"/>
        {/* Sapopema frontal direita */}
        <path d="M48,84 C56,86 66,92 72,102 C70,104 68,105 66,103 C60,93 52,87 46,83"
              fill="#4A3520" opacity="0.6"/>
      </g>

      {/* Copa estratificada — múltiplos andares */}
      <g id="canopy" filter="url(#sam-glow)">
        {/* Andar inferior (mais escuro, oclusão) */}
        <path d="M2,42 C-6,34 2,54 12,56 C2,68 18,78 32,74 C24,86 40,90 48,82 C56,90 72,86 78,74 C90,66 84,48 74,44 C86,32 70,24 60,30 C70,20 56,14 48,22 C56,12 44,8 36,16 C24,8 8,22 2,42 Z"
              fill="url(#sam-crown-back)"/>
        {/* Andar médio */}
        <path d="M5,36 C-3,28 4,48 14,50 C4,62 20,72 34,68 C26,80 42,84 50,76 C58,84 74,80 78,68 C90,60 84,42 74,40 C86,28 70,22 62,28 C70,18 58,14 50,22 C56,12 46,8 38,16 C26,8 10,22 5,36 Z"
              fill="url(#sam-crown-mid)"/>
        {/* Andar superior */}
        <path d="M8,30 C0,22 8,42 18,44 C8,56 25,66 38,62 C30,74 46,78 54,70 C62,78 76,74 78,62 C90,54 84,36 74,36 C84,24 70,18 62,24 C70,14 58,10 50,18 C56,10 46,6 38,14 C26,6 12,20 8,30 Z"
              fill="url(#sam-crown-front)"/>
        {/* Andar do topo */}
        <path d="M12,26 C5,18 14,38 24,40 C14,52 30,60 42,56 C35,68 50,72 58,64 C65,72 78,68 78,56 C88,50 82,32 72,32 C80,22 68,16 60,22 C66,14 56,10 48,18 C54,10 46,8 38,16 C28,8 16,18 12,26 Z"
              fill="url(#sam-crown-top)"/>
        {/* Topo absoluto */}
        <path d="M18,22 C12,14 20,32 30,34 C22,44 36,52 46,48 C40,58 52,62 60,54 C66,60 76,56 76,46 C84,40 80,26 70,26 C78,18 68,12 60,18 C65,12 56,8 48,16 C40,8 30,16 24,22 C20,16 22,20 18,22 Z"
              fill="#4ACA58" opacity="0.8"/>
      </g>

      {/* Tronco central */}
      <g id="trunk">
        <path d="M34,50 C32,50 31,54 31,62 L28,90 C28,94 33,95 38,95 C43,95 48,94 48,90 L46,62 C46,54 45,50 43,50 C42,50 35,50.5 34,50 Z"
              fill="url(#sam-trunk)"/>
        {/* Lado escuro do tronco */}
        <path d="M34,50 C32,50 31,54 31,62 L28,90 C28,94 33,95 38,95"
              fill="none" stroke="#2A1808" strokeWidth="2.5" opacity="0.4"/>
        {/* Textura casca */}
        <path d="M32,55 Q34,62 33,72 Q36,65 35,55" stroke="#2A1808" strokeWidth="1" fill="none" opacity="0.4"/>
        <path d="M38,52 Q40,62 39,80 Q43,68 42,52" stroke="#2A1808" strokeWidth="0.8" fill="none" opacity="0.3"/>
        <path d="M44,54 Q45,68 44,82" stroke="#2A1808" strokeWidth="0.7" fill="none" opacity="0.25"/>
      </g>

      {/* VFX — Partículas mágicas flutuantes */}
      <g id="vfx">
        <circle cx="16" cy="20" r="2.5" fill="#FFD700" opacity="0.8" filter="url(#sam-particle-blur)"/>
        <circle cx="58" cy="14" r="1.8" fill="#AAFF40" opacity="0.7" filter="url(#sam-particle-blur)"/>
        <circle cx="65" cy="32" r="2" fill="#FFD700" opacity="0.65" filter="url(#sam-particle-blur)"/>
        <circle cx="12" cy="38" r="1.5" fill="#AAFF40" opacity="0.6" filter="url(#sam-particle-blur)"/>
        <circle cx="72" cy="26" r="2" fill="#FFD700" opacity="0.7" filter="url(#sam-particle-blur)"/>
        <circle cx="44" cy="8" r="1.5" fill="#FFFFFF" opacity="0.5" filter="url(#sam-particle-blur)"/>
        <circle cx="26" cy="14" r="1.2" fill="#AAFF40" opacity="0.55" filter="url(#sam-particle-blur)"/>
        <circle cx="54" cy="26" r="1.5" fill="#FFD700" opacity="0.5" filter="url(#sam-particle-blur)"/>
        <circle cx="8" cy="50" r="1" fill="#AAFF40" opacity="0.4" filter="url(#sam-particle-blur)"/>
        <circle cx="74" cy="48" r="1.2" fill="#FFD700" opacity="0.45" filter="url(#sam-particle-blur)"/>
        {/* Partículas extras ao redor das raízes */}
        <circle cx="20" cy="88" r="1" fill="#80FF40" opacity="0.5" filter="url(#sam-particle-blur)"/>
        <circle cx="62" cy="86" r="1" fill="#80FF40" opacity="0.5" filter="url(#sam-particle-blur)"/>
        <circle cx="40" cy="100" r="1.2" fill="#FFD700" opacity="0.4" filter="url(#sam-particle-blur)"/>
      </g>

      {animated && (
        <style>{`
          @keyframes sama-sway {
            0%, 100% { transform: rotate(-0.8deg); transform-origin: 40px 110px; }
            50% { transform: rotate(0.8deg); transform-origin: 40px 110px; }
          }
          .sam-anim { animation: sama-sway 7s ease-in-out infinite; }
        `}</style>
      )}
      <g className={animated ? 'sam-anim' : ''}>
        <path d="M2,42 C-6,34 2,54 12,56" stroke="#1A6A25" strokeWidth="2" fill="none" opacity="0.3"/>
        <path d="M78,40 C86,34 82,48 72,50" stroke="#0A4A18" strokeWidth="2" fill="none" opacity="0.3"/>
      </g>
    </svg>
  )
}

// ============================================================
// JUAZEIRO — Copa esférica com 5 nuvens de folhas
// ============================================================
function Juazeiro({ size = 80, animated = false }: { size?: number; animated?: boolean }) {
  return (
    <svg width={size} height={size * 1.25} viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="jua-trunk" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8A6A30"/>
          <stop offset="100%" stopColor="#5A4018"/>
        </linearGradient>
        <linearGradient id="jua-trunk-dark" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6A4A20"/>
          <stop offset="100%" stopColor="#3A2808"/>
        </linearGradient>
        <radialGradient id="jua-leaf1" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#8ABA48"/>
          <stop offset="100%" stopColor="#5A8A28"/>
        </radialGradient>
        <radialGradient id="jua-leaf2" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#7AA838"/>
          <stop offset="100%" stopColor="#4A7820"/>
        </radialGradient>
        <radialGradient id="jua-leaf3" cx="45%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#6A9830"/>
          <stop offset="100%" stopColor="#3A6818"/>
        </radialGradient>
        <filter id="jua-shadow">
          <feGaussianBlur stdDeviation="2"/>
        </filter>
      </defs>

      <ellipse cx="40" cy="94" rx="22" ry="5" fill="rgba(0,0,0,0.22)" filter="url(#jua-shadow)"/>

      <g id="trunk">
        <path d="M35,55 C33,55 32,58 32,65 L30,90 C30,94 34,95 40,95 C46,95 50,94 50,90 L48,65 C48,58 47,55 45,55 C43,55 35.5,55.5 35,55 Z"
              fill="url(#jua-trunk)"/>
        <path d="M35,55 C33,55 32,58 32,65 L30,90 C30,94 34,95 40,95"
              fill="none" stroke="#3A2808" strokeWidth="1.5" opacity="0.4"/>
        <path d="M36,60 Q38,68 37,78" stroke="#4A3010" strokeWidth="0.7" fill="none" opacity="0.4"/>
        <path d="M42,58 Q44,68 43,80" stroke="#4A3010" strokeWidth="0.6" fill="none" opacity="0.3"/>
      </g>

      <g id="canopy">
        {/* Nuvem trás */}
        <path d="M15,40 C5,32 10,50 20,52 C10,64 28,74 40,70 C32,82 48,86 56,78 C64,86 80,80 80,66 C90,58 84,42 74,40 C84,30 70,22 60,28 C68,18 55,14 47,22 C54,12 43,10 35,18 C23,10 8,22 15,40 Z"
              fill="url(#jua-leaf3)" opacity="0.65"/>
        {/* Nuvem média */}
        <path d="M12,36 C3,28 10,46 20,48 C10,60 28,70 40,66 C32,78 48,82 56,74 C64,82 80,76 78,62 C88,54 82,38 72,36 C82,26 68,20 60,26 C68,16 55,12 47,20 C54,10 43,8 35,16 C23,8 10,20 12,36 Z"
              fill="url(#jua-leaf2)"/>
        {/* Nuvem frontal */}
        <path d="M10,32 C2,24 10,42 20,44 C10,56 28,66 40,62 C32,74 48,78 56,70 C64,78 78,72 76,58 C86,50 80,34 70,34 C80,24 66,18 58,24 C66,14 54,10 46,18 C54,8 43,6 35,14 C23,6 10,18 10,32 Z"
              fill="url(#jua-leaf1)"/>
        {/* Nuvem topo */}
        <path d="M15,28 C8,20 15,38 25,40 C16,50 30,58 42,54 C36,66 50,70 58,62 C64,68 76,62 74,50 C84,44 78,28 68,28 C76,20 64,14 56,20 C62,12 52,8 44,16 C50,8 42,6 34,14 C24,6 12,16 15,28 Z"
              fill="#9ACA58" opacity="0.8"/>
      </g>

      {animated && (
        <style>{`
          @keyframes jua-sway {
            0%, 100% { transform: rotate(-1.2deg); transform-origin: 40px 95px; }
            50% { transform: rotate(1.2deg); transform-origin: 40px 95px; }
          }
          .jua-anim { animation: jua-sway 4.5s ease-in-out infinite; }
        `}</style>
      )}
      <g className={animated ? 'jua-anim' : ''}></g>
    </svg>
  )
}

// ============================================================
// AROEIRA — Copa irregular com textura rica
// ============================================================
function Aroeira({ size = 80, animated = false }: { size?: number; animated?: boolean }) {
  return (
    <svg width={size} height={size * 1.25} viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="aro-trunk" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6A4A28"/>
          <stop offset="100%" stopColor="#4A2A15"/>
        </linearGradient>
        <radialGradient id="aro-leaf1" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#7A9A40"/>
          <stop offset="100%" stopColor="#4A7A22"/>
        </radialGradient>
        <radialGradient id="aro-leaf2" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#6A8A32"/>
          <stop offset="100%" stopColor="#3A6A18"/>
        </radialGradient>
        <radialGradient id="aro-leaf3" cx="45%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#5A7A28"/>
          <stop offset="100%" stopColor="#2A5A12"/>
        </radialGradient>
        <filter id="aro-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      <ellipse cx="40" cy="94" rx="24" ry="5" fill="rgba(0,0,0,0.2)" filter="url(#aro-glow)"/>

      <g id="trunk">
        <path d="M33,50 C31,50 30,54 30,60 L28,90 C28,94 33,95 40,95 C47,95 52,94 52,90 L50,60 C50,54 49,50 47,50 C45,50 34,50.5 33,50 Z"
              fill="url(#aro-trunk)"/>
        <path d="M33,50 C31,50 30,54 30,60 L28,90 C28,94 33,95 40,95"
              fill="none" stroke="#2A1808" strokeWidth="1.5" opacity="0.35"/>
        <path d="M35,58 Q37,68 36,80" stroke="#4A2A15" strokeWidth="0.8" fill="none" opacity="0.4"/>
        <path d="M42,56 Q44,68 43,82" stroke="#4A2A15" strokeWidth="0.7" fill="none" opacity="0.3"/>
      </g>

      <g id="canopy">
        <path d="M8,40 C0,32 6,50 16,52 C6,64 24,74 38,70 C30,82 46,86 54,78 C62,86 78,80 78,66 C88,58 82,42 72,40 C82,30 68,22 58,28 C66,18 53,14 45,22 C52,12 41,10 33,18 C21,10 6,22 8,40 Z"
              fill="url(#aro-leaf3)" opacity="0.6"/>
        <path d="M10,36 C2,28 10,46 20,48 C10,60 28,70 40,66 C32,78 48,82 56,74 C64,82 80,76 78,62 C88,54 82,38 72,36 C82,26 68,20 60,26 C68,16 55,12 47,20 C54,10 43,8 35,16 C23,8 10,20 10,36 Z"
              fill="url(#aro-leaf2)"/>
        <path d="M12,32 C5,24 12,42 22,44 C12,56 30,66 42,62 C34,74 50,78 58,70 C66,78 80,72 78,58 C88,50 82,34 72,34 C82,24 68,18 60,24 C68,14 56,10 48,18 C54,8 44,6 36,14 C24,6 12,18 12,32 Z"
              fill="url(#aro-leaf1)"/>
        <path d="M16,28 C10,20 16,38 26,40 C18,50 34,58 44,54 C38,66 52,70 60,62 C66,70 78,64 76,52 C86,46 80,30 70,30 C78,22 66,16 58,22 C64,14 54,10 46,18 C52,10 44,8 36,16 C28,8 16,18 16,28 Z"
              fill="#8AAA48" opacity="0.85"/>
      </g>

      {animated && (
        <style>{`
          @keyframes aro-sway {
            0%, 100% { transform: rotate(-1deg); transform-origin: 40px 95px; }
            50% { transform: rotate(1deg); transform-origin: 40px 95px; }
          }
          .aro-anim { animation: aro-sway 5s ease-in-out infinite; }
        `}</style>
      )}
      <g className={animated ? 'aro-anim' : ''}></g>
    </svg>
  )
}

// ============================================================
// BURITI — Palmeira alta com folhas em leque
// ============================================================
function Buriti({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 80 112" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bu-trunk" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8B7355"/>
          <stop offset="100%" stopColor="#5C4A3A"/>
        </linearGradient>
        <linearGradient id="bu-frond1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4A8A2F"/>
          <stop offset="100%" stopColor="#2A6818"/>
        </linearGradient>
        <linearGradient id="bu-frond2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5A9A38"/>
          <stop offset="100%" stopColor="#3A7A20"/>
        </linearGradient>
        <linearGradient id="bu-frond3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3A7A25"/>
          <stop offset="100%" stopColor="#1A5812"/>
        </linearGradient>
        <radialGradient id="bu-fruit" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#9B6530"/>
          <stop offset="100%" stopColor="#6B4020"/>
        </radialGradient>
      </defs>

      <ellipse cx="40" cy="108" rx="14" ry="4" fill="rgba(0,0,0,0.18)" filter="url(#bu-trunk)"/>

      <g id="trunk">
        <path d="M37,48 C36,48 36,52 36,58 L35,104 C35,108 38,109 42,109 C46,109 49,108 49,104 L48,58 C48,52 48,48 47,48 C46,48 37.5,48.5 37,48 Z"
              fill="url(#bu-trunk)"/>
      </g>

      <g id="canopy">
        {/* Folha central */}
        <path d="M40,14 C38,14 36,20 35,28 C32,24 28,30 26,38 C22,34 18,42 20,50 C16,52 18,60 22,62 C20,68 25,72 30,70 C32,75 38,76 42,72 C44,68 48,62 45,58 C50,60 52,54 50,48 C54,50 54,42 50,38 C54,34 50,28 45,30 C48,23 44,18 40,16 C40,15 40,14.5 40,14 Z"
              fill="url(#bu-frond1)"/>
        {/* Folha esquerda alta */}
        <path d="M38,16 C32,12 22,18 18,28 C14,26 12,34 15,42 C10,45 12,55 18,58 C16,64 22,68 28,65 C30,70 36,72 40,68 C42,64 46,58 44,54 C48,56 50,50 48,44 C52,46 52,38 48,34 C52,30 48,24 44,26 C46,20 42,16 38,16 Z"
              fill="#3A7A28"/>
        {/* Folha direita alta */}
        <path d="M42,16 C48,12 58,18 62,28 C66,26 68,34 65,42 C70,45 68,55 62,58 C64,64 58,68 52,65 C50,70 44,72 40,68 C38,64 34,58 36,54 C32,56 30,50 32,44 C28,46 28,38 32,34 C28,30 32,24 36,26 C34,20 38,16 42,16 Z"
              fill="url(#bu-frond2)"/>
        {/* Folha esquerda baixa */}
        <path d="M36,20 C28,17 20,24 18,34 C14,32 14,40 18,46 C14,50 16,58 22,60 C20,66 26,70 32,66 C34,70 40,71 44,68 C46,64 50,58 48,54 C52,56 54,50 52,44 C56,46 56,38 52,34 C56,30 52,24 48,26 C50,20 46,16 42,18"
              fill="#4A8A2F" opacity="0.85"/>
        {/* Folha direita baixa */}
        <path d="M44,20 C52,17 60,24 62,34 C66,32 66,40 62,46 C66,50 64,58 58,60 C60,66 54,70 48,66 C46,70 40,71 36,68 C34,64 30,58 32,54 C28,56 26,50 28,44 C24,46 24,38 28,34 C24,30 28,24 32,26 C30,20 34,16 38,18"
              fill="url(#bu-frond3)" opacity="0.85"/>
      </g>

      {/* Frutos */}
      <ellipse cx="48" cy="54" rx="4" ry="5" fill="url(#bu-fruit)"/>
      <ellipse cx="52" cy="59" rx="3" ry="4" fill="#7B5030"/>
      <ellipse cx="45" cy="61" rx="3" ry="4" fill="url(#bu-fruit)"/>
      <ellipse cx="50" cy="50" rx="2.5" ry="3" fill="#8B6040"/>
    </svg>
  )
}

// ============================================================
// PEQUIZEIRO — Copa densa verde
// ============================================================
function Pequizeiro({ size = 80, animated = false }: { size?: number; animated?: boolean }) {
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 80 96" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="peq-trunk" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#5A4020"/>
          <stop offset="100%" stopColor="#3A2810"/>
        </linearGradient>
        <radialGradient id="peq-leaf1" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#5A9A3A"/>
          <stop offset="100%" stop-color="#2D6A1E"/>
        </radialGradient>
        <radialGradient id="peq-leaf2" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#4A8A2A"/>
          <stop offset="100%" stopColor="#1D5A12"/>
        </radialGradient>
      </defs>

      <ellipse cx="40" cy="90" rx="24" ry="5" fill="rgba(0,0,0,0.18)" filter="url(#peq-leaf1)"/>

      <g id="trunk">
        <path d="M33,48 C31,48 30,52 30,58 L28,86 C28,90 33,91 41,91 C49,91 54,90 54,86 L52,58 C52,52 51,48 49,48 C47,48 34,48.5 33,48 Z"
              fill="url(#peq-trunk)"/>
        <path d="M36,54 Q38,64 37,76" stroke="#3A2810" strokeWidth="0.8" fill="none" opacity="0.4"/>
        <path d="M42,52 Q44,64 43,78" stroke="#3A2810" strokeWidth="0.6" fill="none" opacity="0.3"/>
      </g>

      <g id="canopy">
        <path d="M8,40 C0,32 8,50 18,52 C8,64 26,74 40,70 C32,82 48,86 56,78 C64,86 80,80 80,66 C90,58 84,42 74,40 C84,30 70,22 60,28 C68,18 55,14 47,22 C54,12 43,10 35,18 C23,10 8,22 8,40 Z"
              fill="url(#peq-leaf2)" opacity="0.65"/>
        <path d="M10,36 C3,28 12,46 22,48 C12,60 30,70 42,66 C34,78 50,82 58,74 C66,82 80,76 78,62 C88,54 82,38 72,36 C82,26 68,20 60,26 C68,16 55,12 47,20 C54,10 43,8 35,16 C23,8 10,20 10,36 Z"
              fill="url(#peq-leaf1)"/>
        <path d="M14,32 C8,24 16,42 26,44 C18,54 32,62 44,58 C38,70 52,74 60,66 C67,74 78,68 78,56 C88,50 82,34 72,34 C80,24 68,18 60,24 C66,16 56,12 48,20 C54,10 46,8 38,16 C28,8 16,18 14,32 Z"
              fill="#6AAA4A" opacity="0.85"/>
      </g>

      {animated && (
        <style>{`
          @keyframes peq-sway {
            0%, 100% { transform: rotate(-1deg); transform-origin: 40px 90px; }
            50% { transform: rotate(1deg); transform-origin: 40px 90px; }
          }
          .peq-anim { animation: peq-sway 5s ease-in-out infinite; }
        `}</style>
      )}
      <g className={animated ? 'peq-anim' : ''}></g>
    </svg>
  )
}

// ============================================================
// CASTANHEIRA — Copa achatada gigante
// ============================================================
function Castanheira({ size = 80, animated = false }: { size?: number; animated?: boolean }) {
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 80 104" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cas-trunk" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#5D4037"/>
          <stop offset="100%" stopColor="#3E2723"/>
        </linearGradient>
        <radialGradient id="cas-crown" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#2A7A35"/>
          <stop offset="100%" stopColor="#0D4A18"/>
        </radialGradient>
        <filter id="cas-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      <ellipse cx="40" cy="35" rx="38" ry="32" fill="#1A5A25" opacity="0.3" filter="url(#cas-glow)"/>
      <ellipse cx="40" cy="96" rx="30" ry="7" fill="rgba(0,0,0,0.22)" filter="url(#cas-glow)"/>

      <g id="canopy">
        <path d="M2,38 C-5,30 5,48 15,50 C5,60 22,70 35,66 C28,78 42,82 50,74 C58,82 72,78 78,66 C90,60 85,45 75,42 C85,32 70,25 60,30 C68,20 55,15 45,22 C52,12 40,10 32,18 C22,10 8,18 2,38 Z"
              fill="#0D4A18"/>
        <path d="M5,34 C-2,26 8,44 18,46 C8,56 25,66 38,62 C32,74 46,78 54,70 C62,78 76,74 80,62 C90,56 86,41 76,38 C86,28 72,22 62,27 C70,18 58,14 48,21 C54,12 44,10 36,17 C26,10 12,18 5,34 Z"
              fill="url(#cas-crown)"/>
        <path d="M8,30 C2,23 12,40 22,42 C14,52 30,60 42,56 C38,68 50,72 58,65 C65,72 78,68 82,57 C92,52 88,38 78,36 C86,28 74,22 65,27 C72,18 62,15 54,22 C60,14 50,12 42,18 C32,12 18,20 8,30 Z"
              fill="#2A8A38"/>
      </g>

      <g id="trunk">
        <path d="M30,48 C28,48 27,52 27,60 L25,90 C25,94 30,95 38,95 C46,95 51,94 51,90 L49,60 C49,52 48,48 46,48 C44,48 31,48.5 30,48 Z"
              fill="url(#cas-trunk)"/>
        <path d="M28,55 Q30,65 29,78 Q32,68 31,55" stroke="#2A1F1A" strokeWidth="1.2" fill="none" opacity="0.4"/>
        <path d="M38,52 Q40,65 39,85 Q42,72 41,52" stroke="#2A1F1A" strokeWidth="1" fill="none" opacity="0.3"/>
        <path d="M48,54 Q49,70 48,82" stroke="#2A1F1A" strokeWidth="0.8" fill="none" opacity="0.25"/>
      </g>

      {animated && (
        <style>{`
          @keyframes cas-sway {
            0%, 100% { transform: rotate(-0.5deg); transform-origin: 40px 95px; }
            50% { transform: rotate(0.5deg); transform-origin: 40px 95px; }
          }
          .cas-anim { animation: cas-sway 7s ease-in-out infinite; }
        `}</style>
      )}
      <g className={animated ? 'cas-anim' : ''}></g>
    </svg>
  )
}

// ============================================================
// JEQUITIBÁ — Tronco largo com copa irregular
// ============================================================
function Jequitiba({ size = 80, animated = false }: { size?: number; animated?: boolean }) {
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 80 96" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="je-trunk" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6B4A3A"/>
          <stop offset="100%" stopColor="#4A3020"/>
        </linearGradient>
        <radialGradient id="je-crown" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#3AAB5A"/>
          <stop offset="100%" stopColor="#1A6B35"/>
        </radialGradient>
      </defs>

      <ellipse cx="40" cy="90" rx="28" ry="6" fill="rgba(0,0,0,0.2)"/>

      <g id="canopy">
        <path d="M8,38 C0,30 6,48 16,50 C6,60 22,70 35,66 C28,78 42,82 50,74 C58,82 74,76 78,64 C88,56 82,40 72,38 C82,28 68,20 58,26 C66,16 54,12 46,20 C54,10 42,8 34,16 C22,8 8,18 8,38 Z"
              fill="#1A6B35"/>
        <path d="M10,34 C3,26 10,44 20,46 C10,56 26,66 38,62 C32,74 46,78 54,70 C62,78 76,72 78,60 C88,52 82,36 72,34 C82,24 68,18 60,24 C68,14 56,10 48,18 C54,8 44,6 36,14 C26,6 12,16 10,34 Z"
              fill="url(#je-crown)"/>
        <path d="M14,30 C8,22 15,40 25,42 C16,52 30,60 42,56 C36,68 50,72 58,64 C65,72 78,66 78,54 C88,48 82,32 72,32 C80,22 68,16 60,22 C66,14 56,10 48,18 C54,10 46,8 38,16 C28,8 16,18 14,30 Z"
              fill="#4AC870"/>
      </g>

      <g id="trunk">
        <path d="M28,45 C25,45 24,50 24,58 L22,88 C22,93 28,94 38,94 C48,94 54,93 54,88 L52,58 C52,50 51,45 48,45 C46,45 29,45.5 28,45 Z"
              fill="url(#je-trunk)"/>
        <path d="M26,52 Q30,62 28,78 Q33,68 32,52" stroke="#3A2515" strokeWidth="1.5" fill="none" opacity="0.4"/>
        <path d="M36,50 Q40,62 38,84 Q43,72 42,50" stroke="#3A2515" strokeWidth="1.2" fill="none" opacity="0.3"/>
      </g>

      {animated && (
        <style>{`
          @keyframes je-sway {
            0%, 100% { transform: rotate(-0.6deg); transform-origin: 40px 92px; }
            50% { transform: rotate(0.6deg); transform-origin: 40px 92px; }
          }
          .je-anim { animation: je-sway 6s ease-in-out infinite; }
        `}</style>
      )}
      <g className={animated ? 'je-anim' : ''}></g>
    </svg>
  )
}

// ============================================================
// PALMITO JUÇARA — Palmeira esbelta
// ============================================================
function Palmito({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 80 112" xmlns="http://www.w3.org/2000/svg">
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

      <ellipse cx="40" cy="108" rx="10" ry="3" fill="rgba(0,0,0,0.15)"/>

      <g id="trunk">
        <path d="M37,45 C36,45 36,48 36,52 L35,104 C35,108 38,109 42,109 C46,109 49,108 49,104 L48,52 C48,48 48,45 47,45 C46,45 37.5,45.5 37,45 Z"
              fill="url(#pal-trunk)"/>
      </g>

      <g id="canopy">
        <path d="M40,10 C38,10 35,16 34,24 C30,20 26,26 24,34 C20,30 16,38 18,46 C14,50 16,58 20,60 C18,66 24,70 30,68 C32,73 38,74 44,70 C46,66 50,60 48,56 C52,58 54,52 52,46 C56,48 56,40 52,36 C56,32 52,26 48,28 C50,22 46,16 42,14 C41,12 40.5,10.5 40,10 Z"
              fill="url(#pal-frond)"/>
        <path d="M38,14 C30,10 20,16 18,26 C14,24 12,32 16,38 C10,42 12,52 18,54 C16,60 22,64 28,62 C28,68 35,70 40,66 C43,62 48,56 46,52 C50,54 52,48 50,42 C54,44 54,36 50,32 C54,28 50,22 46,24 C48,18 44,12 40,14 Z"
              fill="#2A7A45" opacity="0.85"/>
        <path d="M42,14 C50,10 60,16 62,26 C66,24 68,32 64,38 C70,42 68,52 62,54 C64,60 58,64 52,62 C52,68 45,70 40,66 C37,62 32,56 34,52 C30,54 28,48 30,42 C26,44 26,36 30,32 C26,28 30,22 34,24 C32,18 36,12 40,14 Z"
              fill="#3AAB5A" opacity="0.85"/>
      </g>
    </svg>
  )
}

// ============================================================
// PAU-BRASIL — Épico com aura avermelhada
// ============================================================
function PauBrasil({ size = 80, animated = false }: { size?: number; animated?: boolean }) {
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 80 104" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pb-trunk" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#9A5A20"/>
          <stop offset="100%" stopColor="#6A3A10"/>
        </linearGradient>
        <radialGradient id="pb-crown" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#3AAB5A"/>
          <stop offset="100%" stopColor="#1A7A35"/>
        </radialGradient>
        <radialGradient id="pb-aura" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#FFD700" stop-opacity="0.4"/>
          <stop offset="60%" stopColor="#FF6A00" stop-opacity="0.2"/>
          <stop offset="100%" stopColor="#1A7A35" stop-opacity="0"/>
        </radialGradient>
        <filter id="pb-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="4" result="blur"/>
          <feColorMatrix in="blur" type="matrix"
            values="1 0.6 0 0 0.3  0.4 0.3 0 0 0.15  0 0 0 0 0  0 0 0 0.6 0" result="auraBlur"/>
          <feMerge><feMergeNode in="auraBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      <ellipse cx="40" cy="36" rx="38" ry="34" fill="url(#pb-aura)" filter="url(#pb-glow)"/>
      <ellipse cx="40" cy="96" rx="26" ry="6" fill="rgba(0,0,0,0.22)"/>

      <g id="canopy">
        <path d="M10,40 C2,32 8,50 18,52 C8,62 25,72 38,68 C30,80 45,84 54,76 C62,84 78,78 80,65 C90,58 85,42 74,40 C84,30 70,22 60,28 C68,18 55,12 46,20 C54,10 42,8 34,16 C24,8 10,18 10,40 Z"
              fill="#1A7A35"/>
        <path d="M12,36 C5,28 12,46 22,48 C12,58 28,68 40,64 C34,76 48,80 56,72 C64,80 78,74 80,62 C90,56 84,40 74,38 C84,28 72,22 62,28 C70,18 58,14 50,22 C56,12 46,10 38,18 C28,10 15,20 12,36 Z"
              fill="url(#pb-crown)"/>
        <path d="M15,32 C8,24 16,42 26,44 C18,54 32,62 44,58 C38,70 52,74 60,66 C67,74 78,68 78,56 C88,50 82,36 72,36 C80,26 70,20 62,26 C68,18 58,14 50,22 C56,14 48,12 40,20 C32,12 20,22 15,32 Z"
              fill="#4AAA52"/>
      </g>

      <g id="trunk">
        <path d="M32,48 C30,48 29,52 29,60 L27,90 C27,94 32,95 40,95 C48,95 53,94 53,90 L51,60 C51,52 50,48 48,48 C46,48 33,48.5 32,48 Z"
              fill="url(#pb-trunk)"/>
        <path d="M31,55 Q33,62 32,72 Q35,65 34,55" stroke="#8B4010" strokeWidth="1" fill="none" opacity="0.4"/>
        <path d="M36,52 Q38,62 37,78 Q40,68 39,52" stroke="#8B4010" strokeWidth="0.8" fill="none" opacity="0.35"/>
        <path d="M41,54 Q43,65 42,80 Q45,70 44,54" stroke="#8B4010" strokeWidth="1.2" fill="none" opacity="0.3"/>
      </g>

      <circle cx="22" cy="24" r="2.2" fill="#FFD700" opacity="0.6"/>
      <circle cx="55" cy="20" r="1.8" fill="#FFF" opacity="0.5"/>
      <circle cx="48" cy="38" r="1.5" fill="#FFD700" opacity="0.4"/>

      {animated && (
        <style>{`
          @keyframes pb-sway {
            0%, 100% { transform: rotate(-0.7deg); transform-origin: 40px 95px; }
            50% { transform: rotate(0.7deg); transform-origin: 40px 95px; }
          }
          .pb-anim { animation: pb-sway 6s ease-in-out infinite; }
        `}</style>
      )}
      <g className={animated ? 'pb-anim' : ''}></g>
    </svg>
  )
}

// ============================================================
// CARANDÁ — Palmeira do Pantanal
// ============================================================
function Caranda({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 80 104" xmlns="http://www.w3.org/2000/svg">
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

      <ellipse cx="40" cy="100" rx="12" ry="4" fill="rgba(0,0,0,0.15)"/>

      <g id="trunk">
        <path d="M37,45 C36,45 36,50 36,55 L35,96 C35,100 38,101 42,101 C46,101 49,100 49,96 L48,55 C48,50 48,45 47,45 C46,45 37.5,45.5 37,45 Z"
              fill="url(#car-trunk)"/>
      </g>

      <g id="canopy">
        <path d="M40,10 C38,10 35,16 34,24 C30,20 26,26 24,34 C20,30 16,38 18,46 C14,50 16,58 20,60 C18,66 24,70 30,68 C32,73 38,74 44,70 C46,66 50,60 48,56 C52,58 54,52 52,46 C56,48 56,40 52,36 C56,32 52,26 48,28 C50,22 46,16 42,14 C41,12 40.5,10.5 40,10 Z"
              fill="url(#car-frond)"/>
        <path d="M38,13 C30,8 20,14 18,24 C14,22 12,30 16,36 C10,40 12,50 18,52 C16,58 22,62 28,60 C28,66 35,68 40,64 C43,60 48,54 46,50 C50,52 52,46 50,40 C54,42 54,34 50,30 C54,26 50,20 46,22 C48,16 44,10 40,13 Z"
              fill="#2AA08A" opacity="0.85"/>
        <path d="M42,13 C50,8 60,14 62,24 C66,22 68,30 64,36 C70,40 68,50 62,52 C64,58 58,62 52,60 C52,66 45,68 40,64 C37,60 32,54 34,50 C30,52 28,46 30,40 C26,42 26,34 30,30 C26,26 30,20 34,22 C32,16 36,10 40,13 Z"
              fill="#3AC8B0" opacity="0.85"/>
        <ellipse cx="40" cy="10" rx="6" ry="4" fill="#4CD8C0"/>
      </g>
    </svg>
  )
}

// ============================================================
// CAMBARA — Galhos retorcidos
// ============================================================
function Cambara({ size = 80, animated = false }: { size?: number; animated?: boolean }) {
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 80 96" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cm-trunk" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#5A6A4A"/>
          <stop offset="100%" stopColor="#3A4A3A"/>
        </linearGradient>
        <radialGradient id="cm-crown" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#3AB8A0"/>
          <stop offset="100%" stopColor="#1E7A6A"/>
        </radialGradient>
      </defs>

      <ellipse cx="40" cy="90" rx="22" ry="5" fill="rgba(0,0,0,0.18)"/>

      <g id="canopy">
        <path d="M18,38 C8,30 12,50 22,52 C12,64 28,74 40,70 C32,82 48,86 56,78 C64,86 80,80 82,66 C92,58 86,42 76,40 C86,30 72,22 62,28 C70,18 56,14 48,22 C54,12 42,10 32,18 C20,10 6,22 18,38 Z"
              fill="#1E7A6A"/>
        <path d="M20,34 C12,26 16,46 26,48 C16,60 32,70 44,66 C36,78 52,82 60,74 C68,82 82,76 82,62 C92,54 86,38 76,36 C86,26 72,20 64,26 C70,16 58,12 50,20 C56,10 46,8 36,16 C24,8 10,20 20,34 Z"
              fill="url(#cm-crown)"/>
      </g>

      <g id="trunk">
        <path d="M33,48 C31,48 30,52 30,58 L28,86 C28,90 33,91 41,91 C49,91 54,90 54,86 L52,58 C52,52 51,48 49,48 C47,48 34,48.5 33,48 Z"
              fill="url(#cm-trunk)"/>
        <path d="M28,55 C20,52 12,56 6,64" stroke="#3A4A3A" strokeWidth="2" fill="none" opacity="0.5"/>
        <path d="M52,55 C60,52 68,56 74,64" stroke="#3A4A3A" strokeWidth="2" fill="none" opacity="0.5"/>
      </g>

      {animated && (
        <style>{`
          @keyframes cm-sway {
            0%, 100% { transform: rotate(-1deg); transform-origin: 40px 90px; }
            50% { transform: rotate(1deg); transform-origin: 40px 90px; }
          }
          .cm-anim { animation: cm-sway 5s ease-in-out infinite; }
        `}</style>
      )}
      <g className={animated ? 'cm-anim' : ''}></g>
    </svg>
  )
}

// ============================================================
// SERINGUEIRA — Copa densa amazônica
// ============================================================
function Seringueira({ size = 80, animated = false }: { size?: number; animated?: boolean }) {
  return (
    <svg width={size} height={size * 1.25} viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ser-trunk" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#5A4A3A"/>
          <stop offset="100%" stopColor="#3E2E2A"/>
        </linearGradient>
        <radialGradient id="ser-crown" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#1D5C2A"/>
          <stop offset="100%" stopColor="#0D3A18"/>
        </radialGradient>
        <filter id="ser-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      <ellipse cx="40" cy="32" rx="35" ry="28" fill="#1A5A25" opacity="0.25" filter="url(#ser-glow)"/>
      <ellipse cx="40" cy="92" rx="26" ry="6" fill="rgba(0,0,0,0.2)"/>

      <g id="canopy">
        <path d="M5,38 C-2,30 5,48 15,50 C5,62 22,72 35,68 C28,80 42,84 50,76 C58,84 74,78 78,65 C88,58 82,42 72,40 C82,30 68,22 58,28 C66,18 53,14 45,22 C53,12 41,10 33,18 C21,10 6,22 5,38 Z"
              fill="#0D3A18"/>
        <path d="M8,34 C2,26 10,44 20,46 C10,58 28,68 40,64 C34,76 48,80 56,72 C64,80 78,74 80,61 C90,54 84,38 74,36 C84,26 70,20 62,26 C70,16 58,12 50,20 C56,10 46,8 38,16 C26,8 12,20 8,34 Z"
              fill="url(#ser-crown)"/>
        <path d="M12,30 C6,22 15,40 25,42 C16,54 32,62 44,58 C38,70 52,74 60,66 C67,74 78,68 78,56 C88,50 82,34 72,34 C80,24 68,18 60,24 C66,16 56,12 48,20 C54,12 46,10 38,18 C28,12 15,22 12,30 Z"
              fill="#2A7A35"/>
      </g>

      <g id="trunk">
        <path d="M32,48 C30,48 29,52 29,58 L27,88 C27,92 32,93 40,93 C48,93 53,92 53,88 L51,58 C51,52 50,48 48,48 C46,48 33,48.5 32,48 Z"
              fill="url(#ser-trunk)"/>
        <path d="M30,55 Q33,65 32,78 Q36,68 35,55" stroke="#2A1F1A" strokeWidth="1" fill="none" opacity="0.35"/>
        <path d="M40,52 Q42,65 41,82 Q45,70 44,52" stroke="#2A1F1A" strokeWidth="0.8" fill="none" opacity="0.3"/>
      </g>

      {animated && (
        <style>{`
          @keyframes ser-sway {
            0%, 100% { transform: rotate(-0.6deg); transform-origin: 40px 92px; }
            50% { transform: rotate(0.6deg); transform-origin: 40px 92px; }
          }
          .ser-anim { animation: ser-sway 6s ease-in-out infinite; }
        `}</style>
      )}
      <g className={animated ? 'ser-anim' : ''}></g>
    </svg>
  )
}

// ============================================================
// ANDIROBA — Copa elegante amazônica
// ============================================================
function Andiroba({ size = 80, animated = false }: { size?: number; animated?: boolean }) {
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 80 96" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="an-trunk" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#5A4A38"/>
          <stop offset="100%" stopColor="#3A2A20"/>
        </linearGradient>
        <radialGradient id="an-crown" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#2A7A38"/>
          <stop offset="100%" stopColor="#0D4A20"/>
        </radialGradient>
      </defs>

      <ellipse cx="40" cy="90" rx="26" ry="5" fill="rgba(0,0,0,0.2)"/>

      <g id="canopy">
        <path d="M6,40 C-2,32 4,50 14,52 C4,64 22,74 36,70 C28,82 44,86 52,78 C60,86 76,80 78,66 C88,58 82,42 72,40 C82,30 68,22 58,28 C66,18 53,14 45,22 C53,12 41,10 33,18 C21,10 6,22 6,40 Z"
              fill="#0D4A20"/>
        <path d="M8,36 C1,28 8,46 18,48 C8,60 26,70 38,66 C30,78 46,82 54,74 C62,82 78,76 78,62 C88,54 82,38 72,36 C82,26 68,20 60,26 C68,16 55,12 47,20 C54,10 43,8 35,16 C23,8 9,20 8,36 Z"
              fill="url(#an-crown)"/>
        <path d="M12,32 C6,24 13,42 23,44 C13,56 30,64 42,60 C36,72 50,76 58,68 C65,76 78,70 78,56 C88,50 82,34 72,34 C80,24 68,18 60,24 C66,16 56,12 48,20 C54,10 46,8 38,16 C28,8 14,18 12,32 Z"
              fill="#3A8A48"/>
      </g>

      <g id="trunk">
        <path d="M32,48 C30,48 29,52 29,58 L27,86 C27,90 32,91 40,91 C48,91 53,90 53,86 L51,58 C51,52 50,48 48,48 C46,48 33,48.5 32,48 Z"
              fill="url(#an-trunk)"/>
        <path d="M30,55 Q33,65 32,76 Q36,68 35,55" stroke="#2A1F1A" strokeWidth="0.9" fill="none" opacity="0.35"/>
        <path d="M40,52 Q42,65 41,80 Q45,70 44,52" stroke="#2A1F1A" strokeWidth="0.7" fill="none" opacity="0.3"/>
      </g>

      {animated && (
        <style>{`
          @keyframes an-sway {
            0%, 100% { transform: rotate(-0.7deg); transform-origin: 40px 90px; }
            50% { transform: rotate(0.7deg); transform-origin: 40px 90px; }
          }
          .an-anim { animation: an-sway 5.5s ease-in-out infinite; }
        `}</style>
      )}
      <g className={animated ? 'an-anim' : ''}></g>
    </svg>
  )
}

// ============================================================
// AÇAÍ — Palmeira com cachos de frutos
// ============================================================
function Acai({ size = 80, animated = false }: { size?: number; animated?: boolean }) {
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 80 112" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ac-trunk" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6A5A48"/>
          <stop offset="100%" stopColor="#4A3A28"/>
        </linearGradient>
        <linearGradient id="ac-frond" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1A6A28"/>
          <stop offset="100%" stopColor="#0A4A18"/>
        </linearGradient>
        <radialGradient id="ac-fruit" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#3A1A8A"/>
          <stop offset="100%" stopColor="#1A0A4A"/>
        </radialGradient>
      </defs>

      <ellipse cx="40" cy="108" rx="12" ry="4" fill="rgba(0,0,0,0.15)"/>

      <g id="trunk">
        <path d="M37,45 C36,45 36,50 36,55 L35,104 C35,108 38,109 42,109 C46,109 49,108 49,104 L48,55 C48,50 48,45 47,45 C46,45 37.5,45.5 37,45 Z"
              fill="url(#ac-trunk)"/>
      </g>

      <g id="canopy">
        <path d="M40,10 C38,10 35,16 34,24 C30,20 26,26 24,34 C20,30 16,38 18,46 C14,50 16,58 20,60 C18,66 24,70 30,68 C32,73 38,74 44,70 C46,66 50,60 48,56 C52,58 54,52 52,46 C56,48 56,40 52,36 C56,32 52,26 48,28 C50,22 46,16 42,14 C41,12 40.5,10.5 40,10 Z"
              fill="url(#ac-frond)"/>
        <path d="M38,14 C30,10 20,16 18,26 C14,24 12,32 16,38 C10,42 12,52 18,54 C16,60 22,64 28,62 C28,68 35,70 40,66 C43,62 48,56 46,52 C50,54 52,48 50,42 C54,44 54,36 50,32 C54,28 50,22 46,24 C48,18 44,12 40,14 Z"
              fill="#1A5A22" opacity="0.85"/>
        <path d="M42,14 C50,10 60,16 62,26 C66,24 68,32 64,38 C70,42 68,52 62,54 C64,60 58,64 52,62 C52,68 45,70 40,66 C37,62 32,56 34,52 C30,54 28,48 30,42 C26,44 26,36 30,32 C26,28 30,22 34,24 C32,18 36,12 40,14 Z"
              fill="#0D4A18" opacity="0.85"/>
      </g>

      {/* Cachos de açaí */}
      <ellipse cx="28" cy="55" rx="5" ry="6" fill="url(#ac-fruit)"/>
      <ellipse cx="52" cy="52" rx="5" ry="6" fill="url(#ac-fruit)"/>
      <ellipse cx="35" cy="48" rx="4" ry="5" fill="#2A0A6A"/>
      <ellipse cx="45" cy="50" rx="4" ry="5" fill="#2A0A6A"/>
      <ellipse cx="40" cy="58" rx="3.5" ry="4.5" fill="#1A0A4A"/>

      {animated && (
        <style>{`
          @keyframes ac-sway {
            0%, 100% { transform: rotate(-0.5deg); transform-origin: 40px 108px; }
            50% { transform: rotate(0.5deg); transform-origin: 40px 108px; }
          }
          .ac-anim { animation: ac-sway 5s ease-in-out infinite; }
        `}</style>
      )}
      <g className={animated ? 'ac-anim' : ''}></g>
    </svg>
  )
}

// ============================================================
// IPÊ ROSA — Copa rosada
// ============================================================
function IpeRosa({ size = 80, animated = false }: { size?: number; animated?: boolean }) {
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 80 104" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ipr-trunk" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#5A3A22"/>
          <stop offset="100%" stopColor="#3A2010"/>
        </linearGradient>
        <radialGradient id="ipr-flower" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#E860A0"/>
          <stop offset="50%" stopColor="#D04080"/>
          <stop offset="100%" stopColor="#A02060"/>
        </radialGradient>
        <radialGradient id="ipr-shadow" cx="60%" cy="60%" r="60%">
          <stop offset="0%" stopColor="#B03070"/>
          <stop offset="100%" stopColor="#701850"/>
        </radialGradient>
        <filter id="ipr-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feColorMatrix in="blur" type="matrix"
            values="1 0.4 0.5 0 0.3  0.3 0.2 0.4 0 0.2  0.4 0.3 0.5 0 0.2  0 0 0 0.8 0" result="glowBlur"/>
          <feMerge><feMergeNode in="glowBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      <ellipse cx="40" cy="40" rx="36" ry="34" fill="#E860A0" opacity="0.12" filter="url(#ipr-glow)"/>
      <ellipse cx="40" cy="98" rx="26" ry="6" fill="rgba(0,0,0,0.25)"/>

      <g id="canopy" filter="url(#ipr-glow)">
        <path d="M14,38 C4,30 8,50 18,54 C8,66 22,76 35,72 C28,84 42,88 50,80 C58,88 74,82 76,68 C86,60 80,44 70,42 C80,30 64,22 54,28 C62,18 50,14 42,22 C50,12 38,10 30,18 C20,10 8,22 14,38 Z"
              fill="url(#ipr-shadow)" opacity="0.65"/>
        <path d="M12,34 C3,26 10,46 20,50 C10,62 25,72 38,68 C30,80 44,84 52,76 C60,84 74,78 74,64 C84,56 78,40 68,38 C78,28 64,22 56,28 C64,18 52,14 44,22 C52,12 40,10 32,18 C22,10 9,22 12,34 Z"
              fill="url(#ipr-flower)"/>
        <path d="M16,30 C8,22 14,40 24,44 C14,56 28,64 40,60 C34,72 48,76 56,68 C63,76 76,70 76,58 C86,50 80,34 70,34 C78,24 66,18 58,24 C64,16 54,12 46,20 C52,12 44,10 36,18 C26,10 14,20 16,30 Z"
              fill="#F070B0" opacity="0.85"/>

        <circle cx="24" cy="34" r="5" fill="#F880C0" opacity="0.7"/>
        <circle cx="40" cy="30" r="6" fill="#F870B0" opacity="0.75"/>
        <circle cx="56" cy="32" r="5" fill="#F870B0" opacity="0.7"/>
        <circle cx="32" cy="46" r="4" fill="#E860A0" opacity="0.65"/>
        <circle cx="48" cy="44" r="4.5" fill="#E860A0" opacity="0.65"/>
        <circle cx="20" cy="50" r="3.5" fill="#D05080" opacity="0.6"/>
        <circle cx="60" cy="48" r="3.5" fill="#D05080" opacity="0.6"/>
      </g>

      <g id="trunk">
        <path d="M34,58 C32,58 31,62 31,68 L29,92 C29,96 33,97 37,97 C41,97 45,96 45,92 L43,68 C43,62 42,58 40,58 C39,58 34.5,58.5 34,58 Z"
              fill="url(#ipr-trunk)"/>
        <path d="M33,65 Q35,72 34,80" stroke="#2A1008" strokeWidth="0.8" fill="none" opacity="0.4"/>
        <path d="M38,63 Q40,72 39,84" stroke="#2A1008" strokeWidth="0.6" fill="none" opacity="0.3"/>
      </g>

      {animated && (
        <style>{`
          @keyframes ipr-sway {
            0%, 100% { transform: rotate(-1.2deg); transform-origin: 40px 96px; }
            50% { transform: rotate(1.2deg); transform-origin: 40px 96px; }
          }
          .ipr-anim { animation: ipr-sway 4.5s ease-in-out infinite; }
        `}</style>
      )}
      <g className={animated ? 'ipr-anim' : ''}></g>
    </svg>
  )
}

// ============================================================
// GENERIC TREE — Fallback por bioma
// ============================================================
function GenericTree({ biome, rarity, size = 80 }: { biome: string; rarity: string; size?: number }) {
  const BIOME_COLORS = {
    'caatinga': { light: '#C8B560', mid: '#9A8A40', dark: '#7A9A3A', trunk: '#8B6914', trunkDark: '#5C4A0F' },
    'cerrado': { light: '#5A9A3A', mid: '#4A7A2F', dark: '#2D5A1E', trunk: '#6B4423', trunkDark: '#4A2F18' },
    'mata-atlantica': { light: '#3AAB5A', mid: '#2A8A4A', dark: '#1A6B35', trunk: '#5D4037', trunkDark: '#3E2723' },
    'pantanal': { light: '#3AB8A0', mid: '#2AA08A', dark: '#1E7A6A', trunk: '#5D6B3A', trunkDark: '#3D4530' },
    'amazonia': { light: '#2A7A3A', mid: '#1A5A28', dark: '#0D3A18', trunk: '#4A3728', trunkDark: '#2E221A' },
  }
  const c = BIOME_COLORS[biome as keyof typeof BIOME_COLORS] || BIOME_COLORS['cerrado']
  const glowF = rarity === 'lendario' ? 'drop-shadow(0 0 8px rgba(255,215,0,0.6))'
    : rarity === 'epico' ? 'drop-shadow(0 0 4px rgba(255,180,50,0.4))' : 'none'

  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 80 96" xmlns="http://www.w3.org/2000/svg" style={{ filter: glowF }}>
      <defs>
        <radialGradient id={`gt-crown-${biome}`} cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor={c.light}/>
          <stop offset="100%" stopColor={c.dark}/>
        </radialGradient>
        <linearGradient id={`gt-trunk-${biome}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={c.trunk}/>
          <stop offset="100%" stopColor={c.trunkDark}/>
        </linearGradient>
      </defs>

      <ellipse cx="40" cy="90" rx="22" ry="5" fill="rgba(0,0,0,0.18)"/>

      <path d="M33,48 C31,48 30,52 30,58 L28,86 C28,90 33,91 41,91 C49,91 54,90 54,86 L52,58 C52,52 51,48 49,48 C47,48 34,48.5 33,48 Z"
            fill={`url(#gt-trunk-${biome})`}/>
      <path d="M8,40 C0,32 8,50 18,52 C8,64 26,74 40,70 C32,82 48,86 56,78 C64,86 80,80 80,66 C90,58 84,42 74,40 C84,30 70,22 60,28 C68,18 55,14 47,22 C54,12 43,10 35,18 C23,10 8,22 8,40 Z"
            fill={c.dark}/>
      <path d="M10,36 C3,28 12,46 22,48 C12,60 30,70 42,66 C34,78 50,82 58,74 C66,82 80,76 78,62 C88,54 82,38 72,36 C82,26 68,20 60,26 C68,16 55,12 47,20 C54,10 43,8 35,16 C23,8 10,20 10,36 Z"
            fill={`url(#gt-crown-${biome})`}/>
      <path d="M14,32 C8,24 16,42 26,44 C18,54 32,62 44,58 C38,70 52,74 60,66 C67,74 78,68 78,56 C88,50 82,34 72,34 C80,24 68,18 60,24 C66,16 56,12 48,20 C54,10 46,8 38,16 C28,8 16,18 14,32 Z"
            fill={c.light} opacity="0.85"/>
    </svg>
  )
}

export default TreeSprite
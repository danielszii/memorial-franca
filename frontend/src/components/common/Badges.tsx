import React from 'react'
import { Rank } from '../../types/memorial'
import { rankColor } from '../../constants/theme'

export function VersionBadge({ v }: { v: string }) {
  return (
    <span
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.12)',
        color: '#8a8a8a',
        fontSize: '10px',
        fontFamily: 'var(--font-mono)',
        fontWeight: 500,
        padding: '1px 6px',
        borderRadius: '3px',
        letterSpacing: '0.04em',
      }}
    >
      {v}
    </span>
  )
}

export function RankBadge({ rank }: { rank: Rank | string }) {
  const c = (rankColor as Record<string, string>)[rank] || '#4a5568'
  const isGold = rank === 'Fundador' || rank === 'Líder'
  return (
    <span
      style={{
        background: isGold ? 'rgba(201,168,76,0.15)' : `${c}15`,
        border: isGold ? '1px solid rgba(212,175,55,0.5)' : `1px solid ${c}40`,
        color: isGold ? '#c9a84c' : c,
        fontSize: '10px',
        fontFamily: 'var(--font-mono)',
        fontWeight: isGold ? 700 : 500,
        padding: '2px 8px',
        borderRadius: '3px',
        letterSpacing: '0.06em',
        textTransform: 'uppercase' as const,
        boxShadow: isGold ? '0 0 6px rgba(212,175,55,0.2)' : 'none',
      }}
    >
      {rank}
    </span>
  )
}

export function StatusDot({ status }: { status?: string }) {
  const colors: Record<string, string> = { Ativo: '#ED2939', Inativo: '#4b5563', Veterano: '#002395' }
  const bg = (status && colors[status]) || '#4b5563'
  return (
    <span
      style={{
        width: 7,
        height: 7,
        borderRadius: '50%',
        background: bg,
        display: 'inline-block',
        boxShadow: `0 0 6px ${bg}`,
        marginRight: 5,
        flexShrink: 0,
      }}
    />
  )
}

/* ── Ícones de Fogo em Pixel Art ── */
export function PixelFlameOutlineIcon({
  size = 18,
  color = 'currentColor',
}: {
  size?: number
  color?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, imageRendering: 'pixelated' }}
    >
      {/* Contorno do fogo em pixel */}
      <path
        fill={color}
        d="M7,1 h2 v2 h-2 z M6,3 h1 v2 h-1 z M9,3 h1 v2 h-1 z M5,5 h1 v2 h-1 z M10,5 h1 v2 h-1 z M4,7 h1 v3 h-1 z M11,7 h1 v3 h-1 z M3,10 h1 v3 h-1 z M12,10 h1 v3 h-1 z M4,13 h2 v1 h-2 z M10,13 h2 v1 h-2 z M6,14 h4 v1 h-4 z M7,7 h2 v2 h-2 z M8,9 h1 v2 h-1 z"
      />
    </svg>
  )
}

export function PixelFlameFilledIcon({
  size = 18,
  color = '#ff4500',
}: {
  size?: number
  color?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, imageRendering: 'pixelated' }}
    >
      {/* Borda externa escura */}
      <path
        fill="#7a0000"
        d="M7,1 h2 v2 h-2 z M6,3 h1 v2 h-1 z M9,3 h1 v2 h-1 z M5,5 h1 v2 h-1 z M10,5 h1 v2 h-1 z M4,7 h1 v3 h-1 z M11,7 h1 v3 h-1 z M3,10 h1 v3 h-1 z M12,10 h1 v3 h-1 z M4,13 h2 v1 h-2 z M10,13 h2 v1 h-2 z M6,14 h4 v1 h-4 z"
      />
      {/* Corpo de fogo vermelho/laranja */}
      <path
        fill={color || '#d81a00'}
        d="M7,3 h2 v4 h-2 z M6,5 h1 v5 h-1 z M9,5 h1 v5 h-1 z M5,7 h1 v5 h-1 z M10,7 h1 v5 h-1 z M4,10 h1 v3 h-1 z M11,10 h1 v3 h-1 z M5,12 h6 v2 h-6 z"
      />
      {/* Centro amarelo/dourado */}
      <path fill="#ffcc00" d="M7,6 h2 v3 h-2 z M6,8 h4 v3 h-4 z M7,11 h2 v2 h-2 z" />
      {/* Brilho do núcleo */}
      <path fill="#ffffff" d="M7,8 h2 v1 h-2 z" />
    </svg>
  )
}

// Aliases para retrocompatibilidade
export const FlameOutlineIcon = PixelFlameOutlineIcon
export const FlameFilledIcon = PixelFlameFilledIcon

/* ── Chamas Pixel Art que envolvem o Card com Animação 8-Bit ── */
export function PixelArtFlames() {
  return (
    <div
      style={{
        position: 'absolute',
        top: -16,
        left: -14,
        right: -14,
        bottom: -10,
        pointerEvents: 'none',
        overflow: 'visible',
        zIndex: 1,
        imageRendering: 'pixelated',
      }}
    >
      {/* ── 1. Faíscas / Pixels soltos no Top-Left (como na imagem de referência) ── */}
      <div
        className="pixel-spark-anim"
        style={{
          position: 'absolute',
          top: -14,
          left: 6,
          zIndex: 15,
        }}
      >
        <svg width="28" height="28" viewBox="0 0 28 28" shapeRendering="crispEdges">
          {/* Cruz Pixel de Brilho */}
          <rect x="5" y="1" width="2" height="6" fill="#ffcc00" />
          <rect x="3" y="3" width="6" height="2" fill="#ffcc00" />
          <rect x="5" y="3" width="2" height="2" fill="#ffffff" />

          {/* Faíscas menores */}
          <rect x="18" y="2" width="3" height="3" fill="#ff7700" />
          <rect x="19" y="3" width="1" height="1" fill="#ffcc00" />
          <rect x="12" y="12" width="2" height="3" fill="#d81a00" />
          <rect x="22" y="10" width="3" height="4" fill="#ff9900" />
          <rect x="23" y="11" width="1" height="2" fill="#ffee66" />
        </svg>
      </div>

      {/* ── 2. Topo com Chamas Pixel Art ── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 24,
          overflow: 'visible',
        }}
      >
        <svg
          viewBox="0 0 320 24"
          preserveAspectRatio="none"
          shapeRendering="crispEdges"
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          {/* Camada 1: Contorno Escuro / Vermelho Vinho */}
          <path
            className="pixel-flame-layer-1"
            fill="#7a0000"
            d="M 0,24 L 0,16 L 8,16 L 8,8 L 14,8 L 14,2 L 20,2 L 20,8 L 26,8 L 26,14 L 34,14 L 34,6 L 42,6 L 42,0 L 48,0 L 48,6 L 54,6 L 54,12 L 62,12 L 62,4 L 70,4 L 70,10 L 78,10 L 78,16 L 86,16 L 86,6 L 94,6 L 94,0 L 102,0 L 102,8 L 110,8 L 110,14 L 118,14 L 118,4 L 126,4 L 126,10 L 134,10 L 134,16 L 142,16 L 142,2 L 150,2 L 150,8 L 158,8 L 158,14 L 166,14 L 166,4 L 174,4 L 174,0 L 182,0 L 182,6 L 190,6 L 190,12 L 198,12 L 198,6 L 206,6 L 206,14 L 214,14 L 214,2 L 222,2 L 222,8 L 230,8 L 230,14 L 238,14 L 238,4 L 246,4 L 246,0 L 254,0 L 254,6 L 262,6 L 262,12 L 270,12 L 270,4 L 278,4 L 278,10 L 286,10 L 286,16 L 294,16 L 294,4 L 302,4 L 302,10 L 310,10 L 310,18 L 320,18 L 320,24 Z"
          />

          {/* Camada 2: Fogo Vermelho Vivo */}
          <path
            className="pixel-flame-layer-2"
            fill="#d81a00"
            d="M 0,24 L 0,18 L 10,18 L 10,10 L 16,10 L 16,4 L 22,4 L 22,10 L 28,10 L 28,16 L 36,16 L 36,8 L 44,8 L 44,2 L 50,2 L 50,8 L 56,8 L 56,14 L 64,14 L 64,6 L 72,6 L 72,12 L 80,12 L 80,18 L 88,18 L 88,8 L 96,8 L 96,2 L 104,2 L 104,10 L 112,10 L 112,16 L 120,16 L 120,6 L 128,6 L 128,12 L 136,12 L 136,18 L 144,18 L 144,4 L 152,4 L 152,10 L 160,10 L 160,16 L 168,16 L 168,6 L 176,6 L 176,2 L 184,2 L 184,8 L 192,8 L 192,14 L 200,14 L 200,8 L 208,8 L 208,16 L 216,16 L 216,4 L 224,4 L 224,10 L 232,10 L 232,16 L 240,16 L 240,6 L 248,6 L 248,2 L 256,2 L 256,8 L 264,8 L 264,14 L 272,14 L 272,6 L 280,6 L 280,12 L 288,12 L 288,18 L 296,18 L 296,6 L 304,6 L 304,12 L 312,12 L 312,20 L 320,20 L 320,24 Z"
          />

          {/* Camada 3: Laranja Intenso */}
          <path
            className="pixel-flame-layer-3"
            fill="#ff6600"
            d="M 0,24 L 0,20 L 12,20 L 12,13 L 18,13 L 18,7 L 22,7 L 22,13 L 30,13 L 30,18 L 38,18 L 38,11 L 46,11 L 46,5 L 50,5 L 50,11 L 58,11 L 58,16 L 66,16 L 66,9 L 74,9 L 74,15 L 82,15 L 82,20 L 90,20 L 90,11 L 98,11 L 98,5 L 104,5 L 104,13 L 114,13 L 114,18 L 122,18 L 122,9 L 130,9 L 130,15 L 138,15 L 138,20 L 146,20 L 146,7 L 152,7 L 152,13 L 162,13 L 162,18 L 170,18 L 170,9 L 178,9 L 178,5 L 184,5 L 184,11 L 194,11 L 194,16 L 202,16 L 202,11 L 210,11 L 210,18 L 218,18 L 218,7 L 226,7 L 226,13 L 234,13 L 234,18 L 242,18 L 242,9 L 250,9 L 250,5 L 256,5 L 256,11 L 266,11 L 266,16 L 274,16 L 274,9 L 282,9 L 282,15 L 290,15 L 290,20 L 298,20 L 298,9 L 306,9 L 306,15 L 314,15 L 314,22 L 320,22 L 320,24 Z"
          />

          {/* Camada 4: Centro Amarelo / Dourado */}
          <path
            className="pixel-flame-layer-4"
            fill="#ffcc00"
            d="M 0,24 L 0,22 L 14,22 L 14,16 L 18,16 L 18,10 L 22,10 L 22,16 L 32,16 L 32,20 L 40,20 L 40,14 L 46,14 L 46,9 L 50,9 L 50,14 L 60,14 L 60,18 L 68,18 L 68,12 L 74,12 L 74,18 L 84,18 L 84,22 L 92,22 L 92,14 L 98,14 L 98,9 L 104,9 L 104,16 L 116,16 L 116,20 L 124,20 L 124,12 L 130,12 L 130,18 L 140,18 L 140,22 L 148,22 L 148,10 L 152,10 L 152,16 L 164,16 L 164,20 L 172,20 L 172,12 L 178,12 L 178,9 L 184,9 L 184,14 L 196,14 L 196,18 L 204,18 L 204,14 L 212,14 L 212,20 L 220,20 L 220,10 L 226,10 L 226,16 L 236,16 L 236,20 L 244,20 L 244,12 L 250,12 L 250,9 L 256,9 L 256,14 L 268,14 L 268,18 L 276,18 L 276,12 L 282,12 L 282,18 L 292,18 L 292,22 L 300,22 L 300,12 L 306,12 L 306,18 L 316,18 L 316,23 L 320,23 L 320,24 Z"
          />

          {/* Camada 5: Pontos de Luz Brancos */}
          <path
            className="pixel-flame-layer-4"
            fill="#ffffff"
            d="M 18,12 L 20,12 L 20,15 L 18,15 Z M 46,11 L 48,11 L 48,13 L 46,13 Z M 98,11 L 100,11 L 100,14 L 98,14 Z M 178,11 L 180,11 L 180,13 L 178,13 Z M 250,11 L 252,11 L 252,13 L 250,13 Z"
          />
        </svg>
      </div>

      {/* ── 3. Lateral Esquerda Pixel Art ── */}
      <div
        style={{
          position: 'absolute',
          top: 14,
          left: 0,
          width: 14,
          bottom: 4,
          overflow: 'visible',
        }}
      >
        <svg
          viewBox="0 0 14 120"
          preserveAspectRatio="none"
          shapeRendering="crispEdges"
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          <path
            className="pixel-flame-layer-1"
            fill="#7a0000"
            d="M 14,0 L 6,0 L 6,8 L 0,8 L 0,16 L 6,16 L 6,24 L 2,24 L 2,32 L 8,32 L 8,44 L 0,44 L 0,54 L 6,54 L 6,66 L 2,66 L 2,78 L 8,78 L 8,90 L 0,90 L 0,100 L 6,100 L 6,112 L 14,112 Z"
          />
          <path
            className="pixel-flame-layer-2"
            fill="#d81a00"
            d="M 14,0 L 8,0 L 8,10 L 2,10 L 2,14 L 8,14 L 8,26 L 4,26 L 4,30 L 10,30 L 10,46 L 2,46 L 2,52 L 8,52 L 8,68 L 4,68 L 4,76 L 10,76 L 10,92 L 2,92 L 2,98 L 8,98 L 8,112 L 14,112 Z"
          />
          <path
            className="pixel-flame-layer-3"
            fill="#ff6600"
            d="M 14,0 L 10,0 L 10,12 L 4,12 L 4,14 L 10,14 L 10,28 L 6,28 L 6,30 L 12,30 L 12,48 L 4,48 L 4,50 L 10,50 L 10,70 L 6,70 L 6,74 L 12,74 L 12,94 L 4,94 L 4,96 L 10,96 L 10,112 L 14,112 Z"
          />
          <path
            className="pixel-flame-layer-4"
            fill="#ffcc00"
            d="M 14,0 L 12,0 L 12,14 L 6,14 L 6,14 L 12,14 L 12,30 L 8,30 L 8,30 L 13,30 L 13,50 L 6,50 L 6,50 L 12,50 L 12,72 L 8,72 L 8,74 L 13,74 L 13,96 L 6,96 L 6,96 L 12,96 L 12,112 L 14,112 Z"
          />
        </svg>
      </div>

      {/* ── 4. Lateral Direita Pixel Art ── */}
      <div
        style={{
          position: 'absolute',
          top: 14,
          right: 0,
          width: 14,
          bottom: 4,
          overflow: 'visible',
        }}
      >
        <svg
          viewBox="0 0 14 120"
          preserveAspectRatio="none"
          shapeRendering="crispEdges"
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          <path
            className="pixel-flame-layer-1"
            fill="#7a0000"
            d="M 0,0 L 8,0 L 8,8 L 14,8 L 14,16 L 8,16 L 8,24 L 12,24 L 12,32 L 6,32 L 6,44 L 14,44 L 14,54 L 8,54 L 8,66 L 12,66 L 12,78 L 6,78 L 6,90 L 14,90 L 14,100 L 8,100 L 8,112 L 0,112 Z"
          />
          <path
            className="pixel-flame-layer-2"
            fill="#d81a00"
            d="M 0,0 L 6,0 L 6,10 L 12,10 L 12,14 L 6,14 L 6,26 L 10,26 L 10,30 L 4,30 L 4,46 L 12,46 L 12,52 L 6,52 L 6,68 L 10,68 L 10,76 L 4,76 L 4,92 L 12,92 L 12,98 L 6,98 L 6,112 L 0,112 Z"
          />
          <path
            className="pixel-flame-layer-3"
            fill="#ff6600"
            d="M 0,0 L 4,0 L 4,12 L 10,12 L 10,14 L 4,14 L 4,28 L 8,28 L 8,30 L 2,30 L 2,48 L 10,48 L 10,50 L 4,50 L 4,70 L 8,70 L 8,74 L 2,74 L 2,94 L 10,94 L 10,96 L 4,96 L 4,112 L 0,112 Z"
          />
          <path
            className="pixel-flame-layer-4"
            fill="#ffcc00"
            d="M 0,0 L 2,0 L 2,14 L 8,14 L 8,14 L 2,14 L 2,30 L 6,30 L 6,30 L 1,30 L 1,50 L 8,50 L 8,50 L 2,50 L 2,72 L 6,72 L 6,74 L 1,74 L 1,96 L 8,96 L 8,96 L 2,96 L 2,112 L 0,112 Z"
          />
        </svg>
      </div>

      {/* ── 5. Base Inferior Pixel Art ── */}
      <div
        style={{
          position: 'absolute',
          bottom: -4,
          left: 0,
          right: 0,
          height: 10,
          overflow: 'visible',
        }}
      >
        <svg
          viewBox="0 0 320 10"
          preserveAspectRatio="none"
          shapeRendering="crispEdges"
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          <path
            className="pixel-flame-layer-1"
            fill="#7a0000"
            d="M 0,0 L 0,4 L 12,4 L 12,8 L 24,8 L 24,4 L 38,4 L 38,8 L 52,8 L 52,2 L 66,2 L 66,8 L 80,8 L 80,4 L 96,4 L 96,8 L 112,8 L 112,4 L 128,4 L 128,8 L 144,8 L 144,2 L 160,2 L 160,8 L 176,8 L 176,4 L 192,4 L 192,8 L 208,8 L 208,4 L 224,4 L 224,8 L 240,8 L 240,2 L 256,2 L 256,8 L 272,8 L 272,4 L 288,4 L 288,8 L 304,8 L 304,4 L 320,4 L 320,0 Z"
          />
          <path
            className="pixel-flame-layer-2"
            fill="#d81a00"
            d="M 0,0 L 0,2 L 14,2 L 14,6 L 26,6 L 26,2 L 40,2 L 40,6 L 54,6 L 54,1 L 68,1 L 68,6 L 82,6 L 82,2 L 98,2 L 98,6 L 114,6 L 114,2 L 130,2 L 130,6 L 146,6 L 146,1 L 162,1 L 162,6 L 178,6 L 178,2 L 194,2 L 194,6 L 210,6 L 210,2 L 226,2 L 226,6 L 242,6 L 242,1 L 258,1 L 258,6 L 274,6 L 274,2 L 290,2 L 290,6 L 306,6 L 306,2 L 320,2 L 320,0 Z"
          />
          <path
            className="pixel-flame-layer-3"
            fill="#ff6600"
            d="M 0,0 L 0,1 L 16,1 L 16,4 L 28,4 L 28,1 L 42,1 L 42,4 L 56,4 L 56,0 L 70,0 L 70,4 L 84,4 L 84,1 L 100,1 L 100,4 L 116,4 L 116,1 L 132,1 L 132,4 L 148,4 L 148,0 L 164,0 L 164,4 L 180,4 L 180,1 L 196,1 L 196,4 L 212,4 L 212,1 L 228,1 L 228,4 L 244,4 L 244,0 L 260,0 L 260,4 L 276,4 L 276,1 L 292,1 L 292,4 L 308,4 L 308,1 L 320,1 L 320,0 Z"
          />
        </svg>
      </div>
    </div>
  )
}
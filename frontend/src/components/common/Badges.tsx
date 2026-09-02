import React from 'react'
import { Rank } from '../../types/memorial'
import { rankColor, versionColors } from '../../constants/theme'

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

export function FlameOutlineIcon({
  size = 16,
  color = 'currentColor',
}: {
  size?: number
  color?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    >
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z" />
    </svg>
  )
}

export function FlameFilledIcon({
  size = 16,
  color = '#ff4500',
}: {
  size?: number
  color?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      stroke={color}
      strokeWidth="0.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    >
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z" />
    </svg>
  )
}

export function MovingFlamesCrest() {
  return (
    <div
      style={{
        position: 'absolute',
        top: -14,
        left: -2,
        right: -2,
        height: 20,
        overflow: 'visible',
        pointerEvents: 'none',
        zIndex: 10,
      }}
    >
      <svg
        viewBox="0 0 300 28"
        preserveAspectRatio="none"
        style={{ width: '100%', height: '100%', overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="flameGradRed" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#cc1100" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#ff4500" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ff7700" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="flameGradOrange" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#ff3300" stopOpacity="0.9" />
            <stop offset="55%" stopColor="#ff8800" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#ffbb00" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="flameGradGold" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#ff7700" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#ffcc00" stopOpacity="1" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.85" />
          </linearGradient>
        </defs>

        {/* Camada Traseira de Fogo (Chamas Vermelhas) */}
        <g className="flame-tongue-item-1" fill="url(#flameGradRed)">
          <path d="M 0 28 Q 12 4 22 10 Q 36 -4 50 14 Q 65 0 80 12 Q 98 -6 118 14 Q 138 -2 158 16 Q 178 -6 198 10 Q 218 1 238 14 Q 258 -4 278 8 Q 290 16 300 28 Z" />
        </g>

        {/* Camada Intermediária de Fogo (Chamas Laranja Vibrantes) */}
        <g className="flame-tongue-item-2" fill="url(#flameGradOrange)">
          <path d="M 0 28 Q 16 8 30 16 Q 48 0 66 16 Q 88 -2 108 14 Q 128 3 148 16 Q 168 -3 188 13 Q 208 4 228 16 Q 248 -1 268 12 Q 285 6 300 28 Z" />
        </g>

        {/* Camada Frontal de Fogo (Chamas Douradas Incandescentes) */}
        <g className="flame-tongue-item-3" fill="url(#flameGradGold)">
          <path d="M 0 28 Q 20 13 38 20 Q 58 6 78 20 Q 98 4 118 18 Q 138 8 158 20 Q 178 3 198 18 Q 218 10 238 20 Q 258 7 278 16 Q 290 12 300 28 Z" />
        </g>
      </svg>
    </div>
  )
}
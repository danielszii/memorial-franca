import React from 'react'
import { Rank, Member } from '../../types/memorial'
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

export function RankBadge({ rank }: { rank: Rank }) {
  const c = rankColor[rank] || '#4a5568'
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

export function StatusDot({ status }: { status: Member['status'] }) {
  const colors = { Ativo: '#ED2939', Inativo: '#4b5563', Veterano: '#002395' }
  return (
    <span
      style={{
        width: 7,
        height: 7,
        borderRadius: '50%',
        background: colors[status] || '#4b5563',
        display: 'inline-block',
        boxShadow: `0 0 6px ${colors[status] || '#4b5563'}`,
        marginRight: 5,
        flexShrink: 0,
      }}
    />
  )
}
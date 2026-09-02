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

export function CardEraTimeline({ versions = [] }: { versions?: string[] }) {
  const allVersions = ['1.0', '2.0', '3.0', '4.0', '5.0', '6.0']
  return (
    <div className="w-full pt-1">
      <div className="flex items-center gap-0 w-full">
        {allVersions.map((v, i) => {
          const active = versions.includes(v)
          const c = versionColors[v] || '#ffffff'
          return (
            <div key={v} className="flex items-center flex-1">
              <div
                style={{
                  width: '100%',
                  height: 3,
                  background: active
                    ? `linear-gradient(90deg, ${c}90, ${c}50)`
                    : 'rgba(255,255,255,0.06)',
                  borderRadius: i === 0 ? '2px 0 0 2px' : i === 5 ? '0 2px 2px 0' : 0,
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: active ? c : '#1c1c1c',
                    border: `1px solid ${active ? c : '#333'}`,
                    boxShadow: active ? `0 0 6px ${c}` : 'none',
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
      <div className="flex mt-1">
        {allVersions.map(v => (
          <div
            key={v}
            className="flex-1 text-center"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              fontWeight: versions.includes(v) ? 600 : 400,
              color: versions.includes(v) ? versionColors[v] : '#383838',
            }}
          >
            {v}
          </div>
        ))}
      </div>
    </div>
  )
}
import React from 'react'
import { Member, Rank } from '../../types/memorial'
import { rankColor } from '../../constants/theme'
import { RankBadge, StatusDot, VersionBadge } from '../common/Badges'

interface MemberCardProps {
  member: Member
  onClick?: () => void
}

export function MemberCard({ member, onClick }: MemberCardProps) {
  // Normaliza o rank para array
  const rawRanks = Array.isArray(member.rank) ? member.rank : [member.rank]
  const ranks = rawRanks.filter(Boolean)

  // Rank primário para guiar a cor da borda/acento
  const primaryRank = (ranks[0] || 'Membro') as Rank
  const rc = rankColor[primaryRank] || '#4a5568'

  const isLegend = member.id === 1 || member.id === 8
  const displayNick = member.id === 1 ? 'Connor' : member.nick

  const hasStream = !!(member.twitch || member.kick || member.youtube)
  const defaultStreamUrl = member.live_url || 
    (member.twitch ? (member.twitch.startsWith('http') ? member.twitch : `https://twitch.tv/${member.twitch}`) :
     member.kick ? (member.kick.startsWith('http') ? member.kick : `https://kick.com/${member.kick}`) :
     member.youtube ? (member.youtube.startsWith('http') ? member.youtube : `https://youtube.com/@${member.youtube}`) : '#')

  return (
    <div
      onClick={onClick}
      style={{
        background: '#0f0f0f',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '6px',
        padding: '20px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.18s, border-color 0.18s, box-shadow 0.18s',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.borderColor = isLegend ? 'rgba(201,168,76,0.3)' : `${rc}30`
        e.currentTarget.style.boxShadow = isLegend
          ? '0 8px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,168,76,0.15)'
          : `0 8px 24px rgba(0,0,0,0.5), 0 0 0 1px ${rc}15`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {isLegend ? (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: 'linear-gradient(90deg, #c9a84c90, #ffd70060, transparent)',
            boxShadow: '0 0 6px rgba(212,175,55,0.35)',
          }}
        />
      ) : (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: `linear-gradient(90deg, ${rc}60, transparent)`,
          }}
        />
      )}

      <div className="flex items-start gap-3 mb-3">
        <div
          style={{
            width: 44,
            height: 44,
            flexShrink: 0,
            borderRadius: '4px',
            border: isLegend ? '1.5px solid rgba(201,168,76,0.5)' : `1.5px solid ${rc}40`,
            overflow: 'hidden',
            background: '#0a0a0a',
          }}
        >
          <img src={member.avatar} alt={member.nick} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1 min-w-0 w-full">
            {hasStream && (
              member.is_live ? (
                <span
                  className="live-indicator-dot-green"
                  title="AO VIVO"
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                    display: 'inline-block',
                    flexShrink: 0,
                  }}
                />
              ) : (
                <span
                  title="OFFLINE"
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#ef4444',
                    display: 'inline-block',
                    flexShrink: 0,
                  }}
                />
              )
            )}
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 16,
                letterSpacing: '0.06em',
                color: '#f5f5f5',
                textTransform: 'uppercase',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              title={displayNick}
            >
              {displayNick}
            </span>
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: '#4a4a4a',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {member.discord}
          </div>
        </div>
      </div>

      {/* ── Badges de Ranks Múltiplos ── */}
      <div className="flex flex-wrap gap-1 mb-3">
        {ranks.map((r, idx) => (
          <RankBadge key={`${r}-${idx}`} rank={r} />
        ))}
      </div>

      <div
        style={{
          fontSize: 11,
          color: '#5a5a5a',
          marginBottom: 12,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {member.role}
      </div>

      <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', marginBottom: 12 }} />

      <div className="flex flex-wrap gap-1">
        {member.versions?.map(v => (
          <VersionBadge key={v} v={v} />
        ))}
      </div>
    </div>
  )
}
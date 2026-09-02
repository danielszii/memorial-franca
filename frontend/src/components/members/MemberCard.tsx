import React from 'react'
import { Member, Rank } from '../../types/memorial'
import { rankColor } from '../../constants/theme'
import { RankBadge, VersionBadge } from '../common/Badges'

interface MemberCardProps {
  member: Member
  onClick?: () => void
  isTopVoted?: boolean
  hasVotedThisMember?: boolean
  canVoteMore?: boolean
  votesRemaining?: number
  isVoting?: boolean
  onVote?: (memberId: number) => Promise<void>
}

export function MemberCard({
  member,
  onClick,
  isTopVoted = false,
  hasVotedThisMember = false,
  canVoteMore = true,
  votesRemaining = 5,
  isVoting = false,
  onVote,
}: MemberCardProps) {
  // Normaliza o rank para array
  const rawRanks = Array.isArray(member.rank) ? member.rank : [member.rank]
  const ranks = rawRanks.filter(Boolean)

  // Rank primário para guiar a cor da borda/acento
  const primaryRank = (ranks[0] || 'Membro') as Rank
  const rc = rankColor[primaryRank] || '#4a5568'

  const isLegend = member.id === 1 || member.id === 8
  const displayNick = member.id === 1 ? 'Connor' : member.nick

  const hasStream = !!(member.twitch || member.kick || member.youtube)
  const defaultStreamUrl =
    member.live_url ||
    (member.twitch
      ? member.twitch.startsWith('http')
        ? member.twitch
        : `https://twitch.tv/${member.twitch}`
      : member.kick
      ? member.kick.startsWith('http')
        ? member.kick
        : `https://kick.com/${member.kick}`
      : member.youtube
      ? member.youtube.startsWith('http')
        ? member.youtube
        : `https://youtube.com/@${member.youtube}`
      : '#')

  return (
    <div
      onClick={onClick}
      className={isTopVoted ? 'flame-card-effect' : ''}
      style={{
        background: '#0f0f0f',
        border: isTopVoted
          ? '1px solid rgba(255,100,0,0.7)'
          : hasVotedThisMember
          ? '1px solid rgba(255,140,0,0.45)'
          : '1px solid rgba(255,255,255,0.07)',
        borderRadius: '6px',
        padding: '20px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.18s, border-color 0.18s, box-shadow 0.18s',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        if (!isTopVoted) {
          e.currentTarget.style.borderColor = hasVotedThisMember
            ? 'rgba(255,140,0,0.7)'
            : isLegend
            ? 'rgba(201,168,76,0.3)'
            : `${rc}30`
          e.currentTarget.style.boxShadow = hasVotedThisMember
            ? '0 8px 24px rgba(0,0,0,0.6), 0 0 12px rgba(255,140,0,0.2)'
            : isLegend
            ? '0 8px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,168,76,0.15)'
            : `0 8px 24px rgba(0,0,0,0.5), 0 0 0 1px ${rc}15`
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        if (!isTopVoted) {
          e.currentTarget.style.borderColor = hasVotedThisMember
            ? 'rgba(255,140,0,0.45)'
            : 'rgba(255,255,255,0.07)'
          e.currentTarget.style.boxShadow = 'none'
        }
      }}
    >
      {/* ── Top Bar (Flamejante se for o mais votado) ── */}
      {isTopVoted ? (
        <div
          className="flame-banner-effect"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
          }}
        />
      ) : isLegend ? (
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

      {/* ── Badge de Destaque para o Mais Votado ── */}
      {isTopVoted && (
        <div
          title="Integrante com mais votos no Francês da Galera!"
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 3,
            padding: '2px 7px',
            borderRadius: '4px',
            background: 'linear-gradient(135deg, rgba(255,69,0,0.25), rgba(255,140,0,0.15))',
            border: '1px solid rgba(255,100,0,0.6)',
            boxShadow: '0 0 10px rgba(255,69,0,0.35)',
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            fontWeight: 800,
            color: '#ff9900',
            letterSpacing: '0.06em',
            userSelect: 'none',
          }}
        >
          <span>🔥</span>
          <span className="flame-text-gradient">MAIS VOTADO</span>
        </div>
      )}

      <div className="flex items-start gap-3 mb-3">
        <div
          style={{
            width: 44,
            height: 44,
            flexShrink: 0,
            borderRadius: '4px',
            border: isTopVoted
              ? '1.5px solid rgba(255,100,0,0.8)'
              : hasVotedThisMember
              ? '1.5px solid rgba(255,140,0,0.7)'
              : isLegend
              ? '1.5px solid rgba(201,168,76,0.5)'
              : `1.5px solid ${rc}40`,
            overflow: 'hidden',
            background: '#0a0a0a',
            boxShadow: isTopVoted ? '0 0 10px rgba(255,69,0,0.4)' : 'none',
          }}
        >
          <img src={member.avatar} alt={member.nick} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0 pr-12">
          <div className="flex items-center gap-1.5 mb-1 min-w-0 w-full">
            {hasStream &&
              (member.is_live ? (
                <a
                  href={member.live_url || defaultStreamUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="live-indicator-dot-green"
                  title="AO VIVO — Clique para assistir"
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                    display: 'inline-block',
                    flexShrink: 0,
                    cursor: 'pointer',
                    boxShadow: '0 0 6px rgba(16, 185, 129, 0.8)',
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
              ))}
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 16,
                letterSpacing: '0.06em',
                color: isTopVoted ? '#ffaa00' : hasVotedThisMember ? '#ff9900' : '#f5f5f5',
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

      {/* ── Rodapé do Card: Versões + Botão Francês da Galera ── */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1">
          {member.versions?.map(v => (
            <VersionBadge key={v} v={v} />
          ))}
        </div>

        {/* Botão / Badge Francês da Galera */}
        {hasVotedThisMember ? (
          <div
            title="Você votou neste integrante no Francês da Galera hoje!"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '3px 8px',
              borderRadius: '4px',
              background: 'linear-gradient(135deg, rgba(255,69,0,0.2), rgba(255,140,0,0.1))',
              border: '1px solid rgba(255,140,0,0.6)',
              boxShadow: '0 0 10px rgba(255,100,0,0.25)',
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              fontWeight: 700,
              color: '#ff9900',
              letterSpacing: '0.04em',
              userSelect: 'none',
              flexShrink: 0,
            }}
          >
            <span>🔥 SEU VOTO</span>
            <span style={{ color: '#fff', opacity: 0.9 }}>({member.respect_count || 0})</span>
          </div>
        ) : canVoteMore ? (
          <button
            type="button"
            disabled={isVoting}
            onClick={e => {
              e.stopPropagation()
              onVote?.(member.id)
            }}
            title={`Votar no Francês da Galera (${votesRemaining} de 5 votos restantes hoje)`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '3px 8px',
              borderRadius: '4px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.12)',
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              fontWeight: 600,
              color: '#b0b0b0',
              letterSpacing: '0.04em',
              cursor: isVoting ? 'wait' : 'pointer',
              transition: 'all 0.2s',
              flexShrink: 0,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,69,0,0.18)'
              e.currentTarget.style.borderColor = 'rgba(255,140,0,0.6)'
              e.currentTarget.style.color = '#ff9900'
              e.currentTarget.style.transform = 'scale(1.03)'
              e.currentTarget.style.boxShadow = '0 0 10px rgba(255,69,0,0.3)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
              e.currentTarget.style.color = '#b0b0b0'
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <span>🔥 VOTAR</span>
            <span style={{ color: '#777' }}>({member.respect_count || 0})</span>
          </button>
        ) : (
          <div
            title="Total de votos no Francês da Galera"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '3px 8px',
              borderRadius: '4px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: '#666',
              letterSpacing: '0.04em',
              userSelect: 'none',
              flexShrink: 0,
            }}
          >
            <span>🔥</span>
            <span>({member.respect_count || 0})</span>
          </div>
        )}
      </div>
    </div>
  )
}
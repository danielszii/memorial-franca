import React from 'react'
import { Member, Rank } from '../../types/memorial'
import { rankColor } from '../../constants/theme'
import { RankBadge, FlameOutlineIcon, FlameFilledIcon } from '../common/Badges'

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
      style={{
        background: '#0f0f0f',
        border: isTopVoted
          ? '1px solid rgba(255,85,0,0.45)'
          : hasVotedThisMember
          ? '1px solid rgba(255,100,0,0.3)'
          : '1px solid rgba(255,255,255,0.07)',
        borderRadius: '6px',
        padding: '18px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.18s, border-color 0.18s, box-shadow 0.18s',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        if (!isTopVoted) {
          e.currentTarget.style.borderColor = hasVotedThisMember
            ? 'rgba(255,100,0,0.6)'
            : isLegend
            ? 'rgba(201,168,76,0.3)'
            : `${rc}30`
          e.currentTarget.style.boxShadow = hasVotedThisMember
            ? '0 6px 18px rgba(0,0,0,0.5)'
            : isLegend
            ? '0 6px 18px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,168,76,0.15)'
            : `0 6px 18px rgba(0,0,0,0.5), 0 0 0 1px ${rc}15`
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        if (!isTopVoted) {
          e.currentTarget.style.borderColor = hasVotedThisMember
            ? 'rgba(255,100,0,0.3)'
            : 'rgba(255,255,255,0.07)'
          e.currentTarget.style.boxShadow = 'none'
        }
      }}
    >
      {/* ── Barra Superior (Gradiente de Chamas no Mais Votado) ── */}
      {isTopVoted ? (
        <div
          className="flame-banner-effect"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 2.5,
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
            gap: 4,
            padding: '2px 7px',
            borderRadius: '4px',
            background: 'rgba(255,69,0,0.12)',
            border: '1px solid rgba(255,85,0,0.4)',
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            fontWeight: 700,
            color: '#ff6600',
            letterSpacing: '0.06em',
            userSelect: 'none',
          }}
        >
          <FlameFilledIcon size={11} color="#ff5500" />
          <span>MAIS VOTADO</span>
        </div>
      )}

      {/* ── Header: Avatar + Nick + Discord ── */}
      <div className="flex items-start gap-3 mb-3">
        <div
          style={{
            width: 44,
            height: 44,
            flexShrink: 0,
            borderRadius: '4px',
            border: isTopVoted
              ? '1.5px solid rgba(255,85,0,0.6)'
              : hasVotedThisMember
              ? '1.5px solid rgba(255,100,0,0.5)'
              : isLegend
              ? '1.5px solid rgba(201,168,76,0.5)'
              : `1.5px solid ${rc}40`,
            overflow: 'hidden',
            background: '#0a0a0a',
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
            {/* O NOME PERMANECE SEMPRE BRANCO (#f5f5f5) */}
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
      <div className="flex flex-wrap gap-1 mb-2.5">
        {ranks.map((r, idx) => (
          <RankBadge key={`${r}-${idx}`} rank={r} />
        ))}
      </div>

      {/* ── Cargo & Botão de Voto Estilo Like Instagram ── */}
      <div className="flex items-center justify-between gap-2">
        <div
          style={{
            fontSize: 11,
            color: '#666',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1,
          }}
        >
          {member.role}
        </div>

        {/* Botão de Voto Estilo Instagram */}
        <button
          type="button"
          disabled={isVoting || hasVotedThisMember || !canVoteMore}
          onClick={e => {
            e.stopPropagation()
            if (!hasVotedThisMember && canVoteMore) {
              onVote?.(member.id)
            }
          }}
          title={
            hasVotedThisMember
              ? 'Você já votou neste membro hoje!'
              : canVoteMore
              ? `Votar no Francês da Galera (${votesRemaining} de 5 votos restantes)`
              : 'Você já utilizou seus 5 votos hoje.'
          }
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: '4px 8px',
            borderRadius: '4px',
            background: hasVotedThisMember
              ? 'rgba(255,69,0,0.12)'
              : 'rgba(255,255,255,0.03)',
            border: hasVotedThisMember
              ? '1px solid rgba(255,85,0,0.4)'
              : '1px solid rgba(255,255,255,0.08)',
            cursor: hasVotedThisMember || !canVoteMore ? 'default' : 'pointer',
            transition: 'all 0.15s ease-in-out',
            flexShrink: 0,
          }}
          onMouseEnter={e => {
            if (!hasVotedThisMember && canVoteMore) {
              e.currentTarget.style.background = 'rgba(255,69,0,0.1)'
              e.currentTarget.style.borderColor = 'rgba(255,85,0,0.35)'
              e.currentTarget.style.transform = 'scale(1.05)'
            }
          }}
          onMouseLeave={e => {
            if (!hasVotedThisMember && canVoteMore) {
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
              e.currentTarget.style.transform = 'scale(1)'
            }
          }}
        >
          {hasVotedThisMember ? (
            <FlameFilledIcon size={15} color="#ff4500" />
          ) : (
            <FlameOutlineIcon
              size={15}
              color={canVoteMore ? '#999999' : '#444444'}
            />
          )}
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              fontWeight: 600,
              color: hasVotedThisMember
                ? '#ff5500'
                : canVoteMore
                ? '#b0b0b0'
                : '#555555',
            }}
          >
            {member.respect_count || 0}
          </span>
        </button>
      </div>
    </div>
  )
}
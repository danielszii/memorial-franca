import React, { useState } from 'react'
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
  hasVotedThisMember = false,
  canVoteMore = true,
  votesRemaining = 5,
  isVoting = false,
  onVote,
}: MemberCardProps) {
  const [isBtnHovered, setIsBtnHovered] = useState(false)

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
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '6px',
        padding: '18px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.18s, border-color 0.18s, box-shadow 0.18s',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.borderColor = isLegend
          ? 'rgba(201,168,76,0.3)'
          : `${rc}30`
        e.currentTarget.style.boxShadow = isLegend
          ? '0 6px 18px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,168,76,0.15)'
          : `0 6px 18px rgba(0,0,0,0.5), 0 0 0 1px ${rc}15`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* ── Barra Superior Padrão de Acento ── */}
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
            borderRadius: '6px 6px 0 0',
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
            borderRadius: '6px 6px 0 0',
          }}
        />
      )}

      {/* ── Header: Avatar + Nick + Discord (Esquerda) e Botão de Voto Alinhado à Direita ── */}
      <div className="flex items-start justify-between gap-3 mb-3">
        {/* Esquerda: Avatar + Identificação */}
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div
            style={{
              width: 44,
              height: 44,
              flexShrink: 0,
              borderRadius: '4px',
              border: isLegend
                ? '1.5px solid rgba(201,168,76,0.5)'
                : `1.5px solid ${rc}40`,
              overflow: 'hidden',
              background: '#0a0a0a',
            }}
          >
            <img src={member.avatar} alt={member.nick} className="w-full h-full object-cover" />
          </div>

          <div className="flex-1 min-w-0">
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
              {/* NOME SEMPRE BRANCO (#f5f5f5) */}
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

        {/* Direita: Botão de Voto Alinhado com o Topo (Apenas o Fogo, sem contorno laranja) */}
        <div className="relative flex items-center flex-shrink-0 pt-0.5">
          <button
            type="button"
            disabled={isVoting || hasVotedThisMember || !canVoteMore}
            onClick={e => {
              e.stopPropagation()
              if (!hasVotedThisMember && canVoteMore) {
                onVote?.(member.id)
              }
            }}
            onMouseEnter={() => setIsBtnHovered(true)}
            onMouseLeave={() => setIsBtnHovered(false)}
            title={
              hasVotedThisMember
                ? 'Você já votou neste integrante hoje!'
                : canVoteMore
                ? `Votar no Francês da Galera (${votesRemaining} de 5 votos restantes)`
                : 'Você já utilizou seus 5 votos hoje.'
            }
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 'none',
              padding: '2px 4px',
              cursor: hasVotedThisMember || !canVoteMore ? 'default' : 'pointer',
              outline: 'none',
              transition: 'transform 0.15s ease',
              transform: isBtnHovered && canVoteMore && !hasVotedThisMember ? 'scale(1.2)' : 'scale(1)',
            }}
          >
            {hasVotedThisMember ? (
              <FlameFilledIcon size={18} color="#ff4500" />
            ) : (
              <FlameOutlineIcon
                size={18}
                color={
                  isBtnHovered && canVoteMore
                    ? '#ff5500'
                    : canVoteMore
                    ? '#888888'
                    : '#3a3a3a'
                }
              />
            )}
          </button>

          {/* Tooltip ao passar o mouse: "VOTAR" */}
          {isBtnHovered && canVoteMore && !hasVotedThisMember && (
            <div
              style={{
                position: 'absolute',
                top: 26,
                right: 0,
                background: '#141414',
                border: '1px solid rgba(255,255,255,0.15)',
                boxShadow: '0 4px 14px rgba(0,0,0,0.9)',
                borderRadius: '4px',
                padding: '2px 7px',
                fontSize: 10,
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                color: '#ff5500',
                letterSpacing: '0.05em',
                pointerEvents: 'none',
                whiteSpace: 'nowrap',
                zIndex: 20,
              }}
            >
              VOTAR
            </div>
          )}
        </div>
      </div>

      {/* ── Badges de Ranks Múltiplos ── */}
      <div className="flex flex-wrap gap-1 mb-2.5">
        {ranks.map((r, idx) => (
          <RankBadge key={`${r}-${idx}`} rank={r} />
        ))}
      </div>

      {/* ── Cargo ── */}
      <div
        style={{
          fontSize: 11,
          color: '#666',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {member.role}
      </div>
    </div>
  )
}
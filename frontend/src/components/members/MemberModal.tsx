import React from 'react'
import { Member, Rank } from '../../types/memorial'
import { rankColor, versionColors } from '../../constants/theme'
import { RankBadge } from '../common/Badges'

// Ícones de redes sociais carregados da biblioteca logos.lndev.me
const Icons = {
  Instagram: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  ),
  Twitch: () => (
    <img
      src="https://logos.lndev.me/logos/twitch.svg"
      alt="Twitch"
      style={{ width: 12, height: 12, objectFit: 'contain' }}
    />
  ),
  YouTube: () => (
    <img
      src="https://logos.lndev.me/logos/youtube.svg"
      alt="YouTube"
      style={{ width: 12, height: 12, objectFit: 'contain' }}
    />
  ),
  TikTok: () => (
    <img
      src="https://logos.lndev.me/logos/tiktok.svg"
      alt="TikTok"
      style={{ width: 12, height: 12, objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
    />
  ),
  Kick: () => (
    <img
      src="https://logos.lndev.me/logos/kick.svg"
      alt="Kick"
      style={{ width: 12, height: 12, objectFit: 'contain' }}
    />
  ),
}

export function MemberModal({
  member,
  onClose,
  isTopVoted = false,
  hasVotedThisMember = false,
  canVoteMore = true,
  votesRemaining = 5,
  isVoting = false,
  onVote,
}: {
  member: Member
  onClose: () => void
  isTopVoted?: boolean
  hasVotedThisMember?: boolean
  canVoteMore?: boolean
  votesRemaining?: number
  isVoting?: boolean
  onVote?: (memberId: number) => Promise<void>
}) {
  const rawRanks = Array.isArray(member.rank) ? member.rank : [member.rank]
  const ranks = rawRanks.filter(Boolean)

  const primaryRank = (ranks[0] || 'Membro') as Rank
  const rc = (rankColor as Record<string, string>)[primaryRank] || '#4a5568'
  const isLegend = member.id === 1 || member.id === 8

  // Busca campos em todos os padrões possíveis
  const m = member as any
  const socials = {
    instagram: m.socials?.instagram || m.instagram,
    twitch: m.socials?.twitch || m.twitch,
    youtube: m.socials?.youtube || m.youtube,
    tiktok: m.socials?.tiktok || m.tiktok,
    kick: m.socials?.kick || m.kick,
  }

  const hasAnySocial = Object.values(socials).some(Boolean)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg"
        style={{
          background: '#111',
          border: isTopVoted
            ? '1px solid rgba(255,100,0,0.7)'
            : isLegend
            ? '1px solid rgba(201,168,76,0.25)'
            : `1px solid ${rc}30`,
          borderRadius: '8px',
          boxShadow: isTopVoted
            ? '0 0 45px rgba(255,69,0,0.3), 0 24px 48px rgba(0,0,0,0.85)'
            : isLegend
            ? '0 0 40px rgba(201,168,76,0.12), 0 24px 48px rgba(0,0,0,0.8)'
            : `0 0 60px ${rc}15, 0 24px 48px rgba(0,0,0,0.8)`,
          overflow: 'hidden',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* ── Top Bar ── */}
        {isTopVoted ? (
          <div
            className="flame-banner-effect"
            style={{
              height: 3,
            }}
          />
        ) : isLegend ? (
          <div
            style={{
              height: 2,
              background: 'linear-gradient(90deg, #c9a84c90, #ffd70060, transparent)',
              boxShadow: '0 0 6px rgba(212,175,55,0.35)',
            }}
          />
        ) : (
          <div style={{ height: 2, background: `linear-gradient(90deg, ${rc}, transparent)` }} />
        )}

        <div className="p-6">
          <div className="flex items-start gap-4 mb-5">
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: '6px',
                border: isTopVoted
                  ? '2px solid rgba(255,100,0,0.8)'
                  : isLegend
                  ? '2px solid rgba(201,168,76,0.6)'
                  : `2px solid ${rc}50`,
                boxShadow: isTopVoted ? '0 0 12px rgba(255,69,0,0.5)' : 'none',
                overflow: 'hidden',
                background: '#0a0a0a',
                flexShrink: 0,
              }}
            >
              <img src={member.avatar} alt={member.nick} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '24px',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    color: isTopVoted ? '#ffaa00' : '#f5f5f5',
                    lineHeight: 1,
                  }}
                >
                  {member.nick.toUpperCase()}
                </h2>
                {member.is_live && (
                  <a
                    href={
                      member.live_url ||
                      (member.kick
                        ? member.kick.startsWith('http')
                          ? member.kick
                          : `https://kick.com/${member.kick}`
                        : member.twitch
                        ? member.twitch.startsWith('http')
                          ? member.twitch
                          : `https://twitch.tv/${member.twitch}`
                        : '#')
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/40 hover:bg-emerald-500/25 transition-all"
                    style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em' }}
                    title="Clique para assistir à live"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    AO VIVO
                  </a>
                )}
                {isTopVoted && (
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      background: 'rgba(255,69,0,0.2)',
                      border: '1px solid rgba(255,100,0,0.6)',
                      color: '#ff9900',
                    }}
                  >
                    🔥 MAIS VOTADO
                  </span>
                )}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: '#5a5a5a',
                  marginBottom: 8,
                }}
              >
                {member.discord}
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                {ranks.map((r, idx) => (
                  <RankBadge key={`${r}-${idx}`} rank={r} />
                ))}
              </div>
            </div>
            <button
              onClick={onClose}
              className="ml-auto text-[#4a4a4a] hover:text-[#f5f5f5] transition-colors text-xl leading-none"
            >
              ×
            </button>
          </div>

          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 20 }} />

          {/* ── Grid Principal (Redes Sociais + Francês da Galera) ── */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {/* 1. REDES SOCIAIS COM ÍCONES */}
            <div
              className="col-span-2"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '4px',
                padding: '10px 12px',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  color: '#4a4a4a',
                  letterSpacing: '0.08em',
                  marginBottom: 6,
                }}
              >
                REDES SOCIAIS
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {hasAnySocial ? (
                  <>
                    {socials.instagram && (
                      <a
                        href={
                          socials.instagram.startsWith('http')
                            ? socials.instagram
                            : `https://instagram.com/${socials.instagram.replace('@', '')}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        title="Instagram"
                        className="inline-flex items-center justify-center p-1.5 rounded bg-[#ED2939]/15 text-[#ED2939] border border-[#ED2939]/30 hover:bg-[#ED2939]/30 transition"
                      >
                        <Icons.Instagram />
                      </a>
                    )}
                    {socials.twitch && (
                      <a
                        href={
                          socials.twitch.startsWith('http')
                            ? socials.twitch
                            : `https://twitch.tv/${socials.twitch}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        title="Twitch"
                        className="inline-flex items-center justify-center p-1.5 rounded bg-purple-500/15 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30 transition"
                      >
                        <Icons.Twitch />
                      </a>
                    )}
                    {socials.kick && (
                      <a
                        href={
                          socials.kick.startsWith('http')
                            ? socials.kick
                            : `https://kick.com/${socials.kick}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        title="Kick"
                        className="inline-flex items-center justify-center p-1.5 rounded bg-green-500/15 text-green-400 border border-green-500/30 hover:bg-green-500/30 transition"
                      >
                        <Icons.Kick />
                      </a>
                    )}
                    {socials.youtube && (
                      <a
                        href={
                          socials.youtube.startsWith('http')
                            ? socials.youtube
                            : `https://youtube.com/@${socials.youtube}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        title="YouTube"
                        className="inline-flex items-center justify-center p-1.5 rounded bg-red-600/15 text-red-500 border border-red-600/30 hover:bg-red-600/30 transition"
                      >
                        <Icons.YouTube />
                      </a>
                    )}
                    {socials.tiktok && (
                      <a
                        href={
                          socials.tiktok.startsWith('http')
                            ? socials.tiktok
                            : `https://tiktok.com/@${socials.tiktok.replace('@', '')}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        title="TikTok"
                        className="inline-flex items-center justify-center p-1.5 rounded bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 transition"
                      >
                        <Icons.TikTok />
                      </a>
                    )}
                  </>
                ) : (
                  <span style={{ fontSize: 11, color: '#4a4a4a', fontFamily: 'var(--font-mono)' }}>
                    NÃO INFORMADO
                  </span>
                )}
              </div>
            </div>

            {/* 2. FRANCÊS DA GALERA */}
            <div
              className="col-span-2"
              style={{
                background: isTopVoted
                  ? 'linear-gradient(135deg, rgba(255,69,0,0.18), rgba(255,140,0,0.08))'
                  : hasVotedThisMember
                  ? 'linear-gradient(135deg, rgba(255,140,0,0.15), rgba(201,168,76,0.05))'
                  : 'rgba(255,255,255,0.03)',
                border: isTopVoted
                  ? '1px solid rgba(255,100,0,0.5)'
                  : hasVotedThisMember
                  ? '1px solid rgba(255,140,0,0.45)'
                  : '1px solid rgba(255,255,255,0.06)',
                borderRadius: '4px',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    color: isTopVoted || hasVotedThisMember ? '#ff9900' : '#4a4a4a',
                    letterSpacing: '0.08em',
                    marginBottom: 3,
                  }}
                >
                  FRANCÊS DA GALERA
                </div>
                <div style={{ fontSize: 13, color: '#f5f5f5', fontWeight: 600 }}>
                  <span style={{ color: '#ff7700', marginRight: 4 }}>🔥</span>
                  {member.respect_count || 0}{' '}
                  {member.respect_count === 1 ? 'voto recebido' : 'votos recebidos'}
                </div>
              </div>

              {hasVotedThisMember ? (
                <div
                  style={{
                    padding: '5px 12px',
                    borderRadius: '4px',
                    background: 'rgba(255,140,0,0.15)',
                    border: '1px solid rgba(255,140,0,0.5)',
                    boxShadow: '0 0 10px rgba(255,140,0,0.2)',
                    color: '#ffaa00',
                    fontSize: 11,
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: '0.05em',
                  }}
                >
                  🔥 SEU VOTO COMPUTADO
                </div>
              ) : canVoteMore ? (
                <button
                  type="button"
                  disabled={isVoting}
                  onClick={() => onVote?.(member.id)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '4px',
                    background: 'rgba(255,69,0,0.18)',
                    border: '1px solid rgba(255,140,0,0.6)',
                    color: '#ffaa00',
                    fontSize: 11,
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: '0.05em',
                    cursor: isVoting ? 'wait' : 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(255,69,0,0.3)'
                    e.currentTarget.style.transform = 'scale(1.03)'
                    e.currentTarget.style.boxShadow = '0 0 12px rgba(255,69,0,0.4)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,69,0,0.18)'
                    e.currentTarget.style.transform = 'scale(1)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  {isVoting ? 'VOTANDO...' : `🔥 VOTAR NO FRANCÊS (${votesRemaining} de 5)`}
                </button>
              ) : (
                <span
                  style={{
                    fontSize: 11,
                    color: '#555',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  Limite de 5 votos diários atingido
                </span>
              )}
            </div>
          </div>

          {/* HISTÓRICO */}
          {member.bio && (
            <div
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '4px',
                padding: '12px',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  color: '#4a4a4a',
                  letterSpacing: '0.08em',
                  marginBottom: 8,
                }}
              >
                HISTÓRICO
              </div>
              <p style={{ fontSize: 13, color: '#9a9a9a', lineHeight: 1.7, margin: 0 }}>
                {member.bio}
              </p>
            </div>
          )}

          {/* FRANÇAS PARTICIPADAS */}
          <div className="mt-4">
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: '#4a4a4a',
                letterSpacing: '0.08em',
                marginBottom: 10,
              }}
            >
              FRANÇAS PARTICIPADAS
            </div>
            <div className="flex items-center gap-0">
              {['1.0', '2.0', '3.0', '4.0', '5.0', '6.0'].map((v, i) => {
                const active = member.versions?.includes(v)
                const c = versionColors[v]
                return (
                  <div key={v} className="flex items-center flex-1">
                    <div
                      style={{
                        width: '100%',
                        height: 4,
                        background: active
                          ? `linear-gradient(90deg, ${c}80, ${c}40)`
                          : 'rgba(255,255,255,0.05)',
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
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          background: active ? c : '#222',
                          border: `1.5px solid ${active ? c : '#333'}`,
                          boxShadow: active ? `0 0 8px ${c}` : 'none',
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="flex mt-1">
              {['1.0', '2.0', '3.0', '4.0', '5.0', '6.0'].map(v => (
                <div
                  key={v}
                  className="flex-1 text-center"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 9,
                    color: member.versions?.includes(v) ? versionColors[v] : '#333',
                  }}
                >
                  {v}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
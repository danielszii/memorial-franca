import React from 'react'
import { Member, Rank } from '../../types/memorial'
import { rankColor, versionColors } from '../../constants/theme'
import { RankBadge, StatusDot, VersionBadge } from '../common/Badges'

// Ícones SVG inline para garantir renderização perfeita e leve
const Icons = {
  Instagram: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  ),
  Twitch: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M2.149 0l-1.612 4.119v16.8h5.031v3.081h3.095l3.077-3.081h4.074l6.186-6.185v-14.734h-19.851zm17.684 13.626l-3.386 3.385h-4.828l-2.712 2.707v-2.707h-4.828v-14.846h15.754v11.461zm-8.835-7.615h2.174v6.522h-2.174v-6.522zm5.435 0h2.174v6.522h-2.174v-6.522z" />
    </svg>
  ),
  YouTube: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  TikTok: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.71 1.25-.07 2.37-.88 2.82-2.04.24-.57.34-1.18.33-1.8V.02h.55z" />
    </svg>
  ),
}

export function MemberModal({ member, onClose }: { member: Member; onClose: () => void }) {
  const rawRanks = Array.isArray(member.rank) ? member.rank : [member.rank]
  const ranks = rawRanks.filter(Boolean)
  console.log("DADOS DO MEMBRO CLICADO:", member);

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
          border: isLegend ? '1px solid rgba(201,168,76,0.25)' : `1px solid ${rc}30`,
          borderRadius: '8px',
          boxShadow: isLegend
            ? '0 0 40px rgba(201,168,76,0.12), 0 24px 48px rgba(0,0,0,0.8)'
            : `0 0 60px ${rc}15, 0 24px 48px rgba(0,0,0,0.8)`,
          overflow: 'hidden',
        }}
        onClick={e => e.stopPropagation()}
      >
        {isLegend ? (
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
                border: isLegend ? '2px solid rgba(201,168,76,0.6)' : `2px solid ${rc}50`,
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
                    color: '#f5f5f5',
                    lineHeight: 1,
                  }}
                >
                  {member.nick.toUpperCase()}
                </h2>
                <div className="flex flex-wrap gap-1">
                  {ranks.map((r, idx) => (
                    <RankBadge key={`${r}-${idx}`} rank={r} />
                  ))}
                </div>
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
                {member.versions?.map(v => (
                  <VersionBadge key={v} v={v} />
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

          {/* ── Grid 2x2 ── */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {/* 1. STATUS */}
            <div
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
                  marginBottom: 4,
                }}
              >
                STATUS
              </div>
              <div className="flex items-center">
                <StatusDot status={member.status} />
                <span style={{ color: '#f5f5f5', fontSize: 13, fontWeight: 500 }}>
                  {member.status || 'Ativo'}
                </span>
              </div>
            </div>

            {/* 2. REDES SOCIAIS COM ÍCONES */}
            <div
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
                        href={socials.instagram.startsWith('http') ? socials.instagram : `https://instagram.com/${socials.instagram.replace('@', '')}`}
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
                        href={socials.twitch.startsWith('http') ? socials.twitch : `https://twitch.tv/${socials.twitch}`}
                        target="_blank"
                        rel="noreferrer"
                        title="Twitch"
                        className="inline-flex items-center justify-center p-1.5 rounded bg-purple-500/15 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30 transition"
                      >
                        <Icons.Twitch />
                      </a>
                    )}
                    {socials.youtube && (
                      <a
                        href={socials.youtube.startsWith('http') ? socials.youtube : `https://youtube.com/@${socials.youtube}`}
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
                        href={socials.tiktok.startsWith('http') ? socials.tiktok : `https://tiktok.com/@${socials.tiktok.replace('@', '')}`}
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

            {/* 3. CARGO */}
            <div
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
                  marginBottom: 4,
                }}
              >
                CARGO
              </div>
              <div style={{ fontSize: 13, color: '#d4d4d4', fontWeight: 500 }}>
                {member.role || 'Membro'}
              </div>
            </div>

            {/* 4. ERAS */}
            <div
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
                  marginBottom: 4,
                }}
              >
                ERAS
              </div>
              <div style={{ fontSize: 13, color: '#d4d4d4', fontWeight: 500 }}>
                {member.versions?.length || 0} versões
              </div>
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

          {/* ERAS PARTICIPADAS */}
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
              ERAS PARTICIPADAS
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
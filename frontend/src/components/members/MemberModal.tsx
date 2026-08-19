import React from 'react'
import { Member, Rank } from '../../types/memorial'
import { rankColor, versionColors } from '../../constants/theme'
import { RankBadge, StatusDot, VersionBadge } from '../common/Badges'

export function MemberModal({ member, onClose }: { member: Member; onClose: () => void }) {
  const rawRanks = Array.isArray(member.rank) ? member.rank : [member.rank]
  const ranks = rawRanks.filter(Boolean)

  const primaryRank = (ranks[0] || 'Membro') as Rank
  const rc = (rankColor as Record<string, string>)[primaryRank] || '#4a5568'
  const isLegend = member.id === 1 || member.id === 8

  // Captura as redes sociais de qualquer formato que venha da API
  const m = member as any
  const socials = {
    instagram: m.socials?.instagram || m.instagram,
    twitch: m.socials?.twitch || m.twitch,
    youtube: m.socials?.youtube || m.youtube,
    tiktok: m.socials?.tiktok || m.tiktok,
    twitter: m.socials?.twitter || m.twitter,
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

          {/* ── Grid 2x2: Status, Redes Sociais, Cargo e Eras ── */}
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

            {/* 2. REDES SOCIAIS (Substituindo o "DESDE") */}
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
                        className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#ED2939]/15 text-[#ED2939] border border-[#ED2939]/30 hover:bg-[#ED2939]/30 transition"
                      >
                        IG
                      </a>
                    )}
                    {socials.twitch && (
                      <a
                        href={socials.twitch.startsWith('http') ? socials.twitch : `https://twitch.tv/${socials.twitch}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-purple-500/15 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30 transition"
                      >
                        TWITCH
                      </a>
                    )}
                    {socials.youtube && (
                      <a
                        href={socials.youtube.startsWith('http') ? socials.youtube : `https://youtube.com/@${socials.youtube}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-red-600/15 text-red-500 border border-red-600/30 hover:bg-red-600/30 transition"
                      >
                        YT
                      </a>
                    )}
                    {socials.tiktok && (
                      <a
                        href={socials.tiktok.startsWith('http') ? socials.tiktok : `https://tiktok.com/@${socials.tiktok.replace('@', '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 transition"
                      >
                        TK
                      </a>
                    )}
                  </>
                ) : (
                  <span style={{ fontSize: 11, color: '#5a5a5a', fontFamily: 'var(--font-mono)' }}>
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
import React from 'react'
import { Era } from '../../types/memorial'

interface EraTimelineProps {
  eras: Era[]
  activeEra: string
  setActiveEra: (version: string) => void
}

export function EraTimeline({ eras, activeEra, setActiveEra }: EraTimelineProps) {
  const era = eras.find(e => e.version === activeEra) || eras[0]
  if (!era) return null

  return (
    <section
      id="linha-do-tempo"
      style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '72px 0',
        background: '#080808',
      }}
    >
      <div className="max-w-screen-xl mx-auto px-10">
        <div className="mb-10">
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'clamp(32px, 3vw, 52px)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#f5f5f5',
            }}
          >
            HISTOIRE DE FRANCE
          </h2>
        </div>

        <div
          className="flex flex-wrap gap-2 mb-8"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 20 }}
        >
          {eras.map(e => {
            const active = activeEra === e.version
            return (
              <button
                key={e.version}
                onClick={() => setActiveEra(e.version)}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  padding: '8px 18px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  border: active ? `1px solid ${e.color}` : '1px solid rgba(255,255,255,0.08)',
                  background: active ? `${e.color}18` : 'transparent',
                  color: active ? e.color : '#5a5a5a',
                }}
              >
                FRA {e.version}
              </button>
            )
          })}
        </div>

        <div
          style={{
            background: '#0f0f0f',
            border: `1px solid rgba(255,255,255,0.07)`,
            borderLeft: `3px solid ${era.color}`,
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <div className="p-8">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    color: '#4a4a4a',
                    letterSpacing: '0.1em',
                    marginBottom: 6,
                  }}
                >
                  SERVIDOR
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: 'clamp(22px, 4vw, 32px)',
                    letterSpacing: '0.06em',
                    color: '#f5f5f5',
                    textTransform: 'uppercase',
                    lineHeight: 1,
                  }}
                >
                  {era.server}
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    padding: '4px 12px',
                    borderRadius: '3px',
                    background: `${era.color}15`,
                    border: `1px solid ${era.color}40`,
                    color: era.color,
                    letterSpacing: '0.08em',
                  }}
                >
                  {era.tag}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 12,
                    color: '#5a5a5a',
                  }}
                >
                  {era.period}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  background: `${era.color}12`,
                  border: `1px solid ${era.color}35`,
                  color: era.color,
                  padding: '4px 12px',
                  borderRadius: '3px',
                  letterSpacing: '0.06em',
                }}
              >
                <span style={{ opacity: 0.6, fontSize: 9, letterSpacing: '0.1em' }}>LÍDER</span>
                {era.leader}
              </span>
              {era.subs.map(s => (
                <span
                  key={s}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#6a6a6a',
                    padding: '4px 12px',
                    borderRadius: '3px',
                    letterSpacing: '0.04em',
                  }}
                >
                  <span style={{ opacity: 0.5, fontSize: 9, letterSpacing: '0.1em', marginRight: 5 }}>
                    GER
                  </span>
                  {s}
                </span>
              ))}
            </div>

            <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', marginBottom: 20 }} />

            <p style={{ fontSize: 16, color: '#8a8a8a', lineHeight: 1.8, maxWidth: 860 }}>
              {era.summary}
            </p>

            <div className="flex gap-1 mt-6">
              {eras.map(e => (
                <div
                  key={e.version}
                  onClick={() => setActiveEra(e.version)}
                  style={{
                    flex: 1,
                    height: 3,
                    borderRadius: 2,
                    background: e.version === activeEra ? e.color : 'rgba(255,255,255,0.06)',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
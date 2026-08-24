import React from 'react'
import logoFra from '../../imports/Logo FRA x K.png'

export function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '64px 0 40px',
        background: '#050505',
      }}
    >
      <div className="max-w-screen-xl mx-auto px-10">
        <div className="flex flex-wrap items-start justify-between gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src={logoFra}
                alt="França"
                style={{ height: 36, width: 'auto', filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.15))' }}
              />
            </div>
            <p style={{ fontSize: 13, color: '#4a4a4a', maxWidth: 280, lineHeight: 1.6, margin: 0 }}>
              Comunidade FiveM desde 2020. Seis eras de história, guerras e conquistas preservadas para sempre.
            </p>
          </div>

          <div className="flex gap-12 flex-wrap">
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  color: '#3a3a3a',
                  letterSpacing: '0.14em',
                  marginBottom: 12,
                }}
              >
                NAVEGAÇÃO
              </div>
              {['Linha do Tempo', 'Hall da Fama', 'Estatísticas', 'Galeria'].map(l => (
                <div key={l} style={{ marginBottom: 8 }}>
                  <a
                    href="#"
                    style={{
                      fontSize: 12,
                      color: '#5a5a5a',
                      textDecoration: 'none',
                      letterSpacing: '0.03em',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#f5f5f5')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#5a5a5a')}
                  >
                    {l}
                  </a>
                </div>
              ))}
            </div>

            <div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  color: '#3a3a3a',
                  letterSpacing: '0.14em',
                  marginBottom: 12,
                }}
              >
                SOCIAL
              </div>
              {['Discord', 'YouTube', 'Twitch', 'TikTok'].map(l => (
                <div key={l} style={{ marginBottom: 8 }}>
                  <a
                    href="#"
                    style={{
                      fontSize: 12,
                      color: '#5a5a5a',
                      textDecoration: 'none',
                      letterSpacing: '0.03em',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#f5f5f5')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#5a5a5a')}
                  >
                    {l}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.05)',
            paddingTop: 20,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: '#2a2a2a',
              letterSpacing: '0.08em',
            }}
          >
            © 2024 FACÇÃO FRANÇA — TODOS OS DIREITOS RESERVADOS
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: '#2a2a2a',
              letterSpacing: '0.08em',
            }}
          >
            FIVEM COMMUNITY ARCHIVE
          </span>
        </div>
      </div>
    </footer>
  )
}
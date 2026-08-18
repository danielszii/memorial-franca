import React from 'react'

const honorsData = [
  {
    icon: '⚔️',
    title: 'Facção Mais Temida',
    desc: 'Reconhecida pela comunidade como a facção mais respeitada e temida durante 3 eras consecutivas no Cidade Alta RP.',
    era: '1.0 – 4.0',
    color: '#ED2939',
  },
  {
    icon: '🕊️',
    title: 'Sobrevivência de 6 Eras',
    desc: 'Raríssimo feito no FiveM BR: uma facção que manteve identidade, nome e estrutura ao longo de 6 versões distintas.',
    era: 'Todas',
    color: '#ffffff',
  },
]

export function HonorsSection() {
  return (
    <section
      id="conquistas"
      style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '72px 0', background: '#050508' }}
    >
      <div className="max-w-screen-xl mx-auto px-10">
        <div className="mb-12">
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'clamp(32px, 3vw, 52px)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#f5f5f5',
              margin: 0,
            }}
          >
            TITRES & HONNEURS
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {honorsData.map(({ icon, title, desc, era: titleEra, color }) => (
            <div
              key={title}
              style={{
                background: '#0d0d0d',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '8px',
                padding: '28px',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.18s, border-color 0.18s, box-shadow 0.18s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-3px)'
                e.currentTarget.style.borderColor = `${color}30`
                e.currentTarget.style.boxShadow = `0 12px 32px rgba(0,0,0,0.5)`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 2,
                  background: `linear-gradient(90deg, ${color}80, transparent)`,
                }}
              />
              <div style={{ fontSize: 36, marginBottom: 18, lineHeight: 1 }}>{icon}</div>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 19,
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  color: '#f0f0f0',
                  textTransform: 'uppercase',
                  marginBottom: 10,
                }}
              >
                {title}
              </div>
              <p style={{ fontSize: 13, color: '#6a6a6a', lineHeight: 1.7, marginBottom: 20 }}>
                {desc}
              </p>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  color: color,
                  background: `${color}12`,
                  border: `1px solid ${color}30`,
                  padding: '3px 10px',
                  borderRadius: '3px',
                  letterSpacing: '0.08em',
                }}
              >
                ERA {titleEra}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
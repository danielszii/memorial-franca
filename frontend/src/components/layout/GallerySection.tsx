import React from 'react'
import { Era } from '../../types/memorial'

const galleryItems = [
  {
    era: '1.0',
    label: 'Fundação da Facção',
    url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop&auto=format',
  },
  {
    era: '2.0',
    label: 'Assalto ao Federal Reserve',
    url: 'https://images.unsplash.com/photo-1511882150382-421056c89033?w=600&h=400&fit=crop&auto=format',
  },
  {
    era: '3.0',
    label: 'Conflito das 72 Horas',
    url: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=600&h=400&fit=crop&auto=format',
  },
  {
    era: '4.0',
    label: 'Pico de 35 Membros',
    url: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=600&h=400&fit=crop&auto=format',
  },
  {
    era: '4.0',
    label: 'Domínio Total',
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=400&fit=crop&auto=format',
  },
  {
    era: '5.0',
    label: 'Renascimento',
    url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&h=400&fit=crop&auto=format',
  },
  {
    era: '6.0',
    label: 'Era Atual',
    url: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=600&h=400&fit=crop&auto=format',
  },
  {
    era: '6.0',
    label: 'Complexo RP',
    url: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&h=400&fit=crop&auto=format',
  },
]

export function GallerySection({ eras }: { eras: Era[] }) {
  return (
    <section
      id="galeria"
      style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '72px 0', background: '#080808' }}
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
            }}
          >
            ARCHIVES MÉDIAS
          </h2>
          <p style={{ fontSize: 15, color: '#5a5a5a', marginTop: 8 }}>
            Momentos históricos registrados ao longo das seis eras.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {galleryItems.map(({ era: gEra, label, url }) => {
            const eraColor = eras.find(e => e.version === gEra)?.color || '#ffffff'
            return (
              <div
                key={label}
                style={{
                  position: 'relative',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  aspectRatio: '3/2',
                  background: '#111',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'scale(1.02)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                <img
                  src={url}
                  alt={label}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'brightness(0.65) saturate(0.5)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 50%)',
                  }}
                />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 14px' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 9,
                      color: eraColor,
                      letterSpacing: '0.1em',
                      background: `${eraColor}18`,
                      border: `1px solid ${eraColor}40`,
                      padding: '2px 7px',
                      borderRadius: '2px',
                      marginBottom: 5,
                      display: 'inline-block',
                    }}
                  >
                    FRA {gEra}
                  </span>
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 13,
                      fontWeight: 600,
                      color: '#f0f0f0',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {label}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
import React from 'react'

export function GallerySection() {
  return (
    <section
      id="em-breve"
      style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '90px 0',
        background: '#080808',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Luzes de fundo com blur atmosférico */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '700px',
          height: '280px',
          background:
            'radial-gradient(circle, rgba(237,41,57,0.14) 0%, rgba(0,35,149,0.12) 45%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
        }}
      />

      <div className="max-w-screen-xl mx-auto px-10 relative z-10">
        <div
          style={{
            background: 'rgba(14, 14, 14, 0.65)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '10px',
            padding: '72px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
          }}
        >
          {/* Badge sutil */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              padding: '5px 14px',
              borderRadius: '20px',
              marginBottom: 16,
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: '0.12em',
              color: '#8a8a8a',
              textTransform: 'uppercase',
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#ED2939',
                boxShadow: '0 0 8px #ED2939',
              }}
            />
            MEMORIAL FRANÇA
          </div>

          {/* Texto Centralizado */}
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'clamp(26px, 3.5vw, 46px)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#ffffff',
              margin: 0,
              maxWidth: 800,
              lineHeight: 1.25,
            }}
          >
            PRÓXIMAS SEÇÕES EM DESENVOLVIMENTO
          </h2>
        </div>
      </div>
    </section>
  )
}
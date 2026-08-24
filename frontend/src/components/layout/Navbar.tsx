import React, { useState } from 'react'
import logoFra from '../../imports/Logo FRA x K.png'
import { navLinks } from '../../constants/theme'
import { scrollTo } from '../../utils/scroll'

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        background: 'rgba(8,8,8,0.92)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="max-w-screen-xl mx-auto px-10 flex items-center justify-between" style={{ height: 72 }}>
        <div className="flex items-center gap-2">
          <img
            src={logoFra}
            alt="França"
            style={{ height: 34, width: 'auto', filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.2))' }}
          />
        </div>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(({ label, id }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 13,
                letterSpacing: '0.1em',
                color: '#6a6a6a',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#f5f5f5')}
              onMouseLeave={e => (e.currentTarget.style.color = '#6a6a6a')}
            >
              {label.toUpperCase()}
            </button>
          ))}
          <a
            href="https://www.instagram.com/francarpoficial"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              letterSpacing: '0.08em',
              color: '#fff',
              background: '#ED2939',
              border: 'none',
              padding: '8px 20px',
              borderRadius: '3px',
              textDecoration: 'none',
              fontWeight: 700,
              transition: 'opacity 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: 7,
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            INSTAGRAM
          </a>
        </div>

        <button
          className="md:hidden"
          style={{
            color: '#8a8a8a',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 20,
          }}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '×' : '≡'}
        </button>
      </div>

      {menuOpen && (
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            background: '#0a0a0a',
            padding: '16px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          {navLinks.map(({ label, id }) => (
            <button
              key={id}
              onClick={() => {
                scrollTo(id)
                setMenuOpen(false)
              }}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                letterSpacing: '0.1em',
                color: '#8a8a8a',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                textAlign: 'left',
              }}
            >
              {label.toUpperCase()}
            </button>
          ))}
          <a
            href="https://www.instagram.com/francarpoficial"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              letterSpacing: '0.08em',
              color: '#fff',
              background: '#ED2939',
              padding: '8px 16px',
              borderRadius: '3px',
              textDecoration: 'none',
              fontWeight: 700,
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
            onClick={() => setMenuOpen(false)}
          >
            INSTAGRAM
          </a>
        </div>
      )}
    </nav>
  )
}
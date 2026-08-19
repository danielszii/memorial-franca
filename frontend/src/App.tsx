import React, { useState, useEffect } from 'react'
import axios from 'axios'
import logoFra from "./imports/Logo FRA x K.png";
import heroBg from "./imports/Banner KROOZZNS.png";
import { Era, Member, Rank } from './types/memorial'
import { navLinks } from './constants/theme'
import { scrollTo } from './utils/scroll'
import { MemberCard } from './components/members/MemberCard'
import { MemberModal } from './components/members/MemberModal'
import { EraTimeline } from './components/eras/EraTimeline'
import { HonorsSection } from './components/layout/HonorsSection'
import { GallerySection } from './components/layout/GallerySection'

export default function App() {
  const [eras, setEras] = useState<Era[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [activeEra, setActiveEra] = useState('1.0')
  const [search, setSearch] = useState('')
  const [filterVersion, setFilterVersion] = useState('Todas')
  const [filterRank, setFilterRank] = useState('Todos')
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const PAGE_SIZE = 20

  useEffect(() => {
    async function fetchData() {
      const API_URL = 'https://memorial-franca.onrender.com'
      try {
        const [resEras, resMembers] = await Promise.all([
          axios.get(`${API_URL}/franca/eras`),
          axios.get(`${API_URL}/franca/members`),
        ])
        setEras(resEras.data)
        setMembers(resMembers.data)
        if (resEras.data.length > 0) {
          setActiveEra(resEras.data[0].version)
        }
      } catch (error) {
        console.error('Erro ao conectar à API:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
  if (window.location.hash) {
    window.history.replaceState(null, '', window.location.pathname);
  }
}, []);

  const era = eras.find(e => e.version === activeEra) || eras[0]

  const filtered = members.filter(m => {
    const matchSearch =
      m.nick.toLowerCase().includes(search.toLowerCase()) ||
      m.discord.toLowerCase().includes(search.toLowerCase())
    const matchVersion = filterVersion === 'Todas' || m.versions.includes(filterVersion)
    const matchRank = filterRank === 'Todos' || m.rank === filterRank
    return matchSearch && matchVersion && matchRank
  })

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const legends = filtered.filter(m => m.id === 1 || m.id === 8).sort((a, b) => a.id - b.id)
  const rest = filtered.filter(m => m.id !== 1 && m.id !== 8)
  const sortedFiltered = [...legends, ...rest]
  const paginated = sortedFiltered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function handleFilterChange(fn: () => void) {
    fn()
    setCurrentPage(1)
  }

  if (loading || !era) {
    return (
      <div
        style={{
          background: '#080808',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#5a5a5a',
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          letterSpacing: '0.1em',
        }}
      >
        CARREGANDO ARQUIVOS DA FRANÇA...
      </div>
    )
  }

  return (
    <div style={{ fontFamily: 'var(--font-body)', background: '#080808', minHeight: '100vh' }}>
      {/* ── Navbar ── */}
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

      {/* ── Hero ── */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${heroBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(5,5,8,0.35)' }} />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to right, rgba(5,5,8,0.92) 0%, rgba(5,5,8,0.75) 35%, rgba(5,5,8,0.2) 60%, transparent 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, #080808 0%, transparent 20%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 72,
            bottom: 0,
            left: 0,
            width: 4,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ flex: 1, background: '#002395' }} />
          <div style={{ flex: 1, background: '#ffffff' }} />
          <div style={{ flex: 1, background: '#ED2939' }} />
        </div>

        {/* QUADRICULADO DO BANNER */}
        {/* <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        /> */}

        <div className="relative max-w-screen-xl mx-auto px-10 w-full" style={{ paddingTop: 120, paddingBottom: 100 }}>
          <div style={{ maxWidth: 720 }}>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 'clamp(64px, 7vw, 112px)',
                letterSpacing: '0.06em',
                lineHeight: 0.95,
                textTransform: 'uppercase',
                marginBottom: 8,
                color: '#ffffff',
              }}
            >
              TROPA DA
            </h1>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 'clamp(64px, 7vw, 112px)',
                letterSpacing: '0.06em',
                lineHeight: 0.95,
                textTransform: 'uppercase',
                marginBottom: 32,
                color: '#ffffff',
              }}
            >
              FRANÇA
            </h1>

            <p
              style={{
                fontSize: 18,
                color: 'rgba(255,255,255,0.5)',
                maxWidth: 560,
                marginBottom: 48,
                lineHeight: 1.75,
                fontWeight: 300,
              }}
            >
              LA FRANCE C'EST LA FAMILLE, ET LA FAMILLE RESTE TOUJOURS ENSEMBLE. LA FRANCE AU SOMMET.
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {/* Botão LES FRANÇAIS */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('membros')?.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  letterSpacing: '0.12em',
                  fontWeight: 600,
                  color: '#000',
                  background: '#ffffff',
                  padding: '12px 28px',
                  borderRadius: '3px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s, transform 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.opacity = '0.88';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                LES FRANÇAIS →
              </button>

              {/* Botão VER HISTÓRIA */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('linha-do-tempo')?.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  letterSpacing: '0.12em',
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.7)',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.18)',
                  padding: '12px 28px',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s, color 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                }}
              >
                VER HISTÓRIA
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <EraTimeline eras={eras} activeEra={activeEra} setActiveEra={setActiveEra} />

      {/* ── Hall da Fama / Membros ── */}
      <section
        id="membros"
        style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          padding: '72px 0',
        }}
      >
        <div className="max-w-screen-xl mx-auto px-10">
          <div className="mb-8">
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
              LES FRANÇAIS
            </h2>
          </div>

          <div className="flex flex-wrap gap-3 mb-8">
            <div className="relative flex-1" style={{ minWidth: 200 }}>
              <span
                style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#4a4a4a',
                  fontSize: 13,
                }}
              >
                ⌕
              </span>
              <input
                type="text"
                placeholder="Buscar por nickname..."
                value={search}
                onChange={e => handleFilterChange(() => setSearch(e.target.value))}
                style={{
                  width: '100%',
                  background: '#0f0f0f',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '4px',
                  padding: '9px 12px 9px 32px',
                  color: '#f5f5f5',
                  fontFamily: 'var(--font-body)',
                  fontSize: 13,
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(237,41,57,0.5)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
              />
            </div>

            <select
              value={filterVersion}
              onChange={e => handleFilterChange(() => setFilterVersion(e.target.value))}
              style={{
                background: '#0f0f0f',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '4px',
                padding: '9px 12px',
                color: '#8a8a8a',
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                letterSpacing: '0.06em',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="Todas">TODAS AS ERAS</option>
              {['1.0', '2.0', '3.0', '4.0', '5.0', '6.0'].map(v => (
                <option key={v} value={v}>
                  ERA {v}
                </option>
              ))}
            </select>

            <select
              value={filterRank}
              onChange={e => handleFilterChange(() => setFilterRank(e.target.value))}
              style={{
                background: '#0f0f0f',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '4px',
                padding: '9px 12px',
                color: '#8a8a8a',
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                letterSpacing: '0.06em',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="Todos">TODOS OS CARGOS</option>
              {(['Fundador', 'Líder', 'Gerente', 'Membro'] as Rank[]).map(r => (
                <option key={r} value={r}>
                  {r.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {filtered.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '64px 0',
                color: '#3a3a3a',
                fontFamily: 'var(--font-mono)',
                fontSize: 13,
                letterSpacing: '0.1em',
              }}
            >
              NENHUM MEMBRO ENCONTRADO
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {paginated.map(member => (
                <MemberCard
                  key={member.id}
                  member={member}
                  onClick={() => setSelectedMember(member)}
                />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                marginTop: 40,
              }}
            >
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.18)',
                  borderRadius: '4px',
                  color: '#ffffff',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  letterSpacing: '0.08em',
                  padding: '7px 14px',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  opacity: currentPage === 1 ? 0.25 : 1,
                  transition: 'opacity 0.15s, border-color 0.15s',
                }}
                onMouseEnter={e => {
                  if (currentPage !== 1) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.45)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'
                }}
              >
                ← PREV
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                const isActive = page === currentPage
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    style={{
                      background: isActive ? '#ffffff' : 'transparent',
                      border: `1px solid ${isActive ? '#ffffff' : 'rgba(255,255,255,0.12)'}`,
                      borderRadius: '4px',
                      color: isActive ? '#000000' : '#8a8a8a',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      fontWeight: isActive ? 700 : 400,
                      letterSpacing: '0.06em',
                      padding: '7px 12px',
                      cursor: 'pointer',
                      minWidth: 36,
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => {
                      if (!isActive) {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'
                        e.currentTarget.style.color = '#f5f5f5'
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isActive) {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
                        e.currentTarget.style.color = '#8a8a8a'
                      }
                    }}
                  >
                    {page}
                  </button>
                )
              })}

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.18)',
                  borderRadius: '4px',
                  color: '#ffffff',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  letterSpacing: '0.08em',
                  padding: '7px 14px',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  opacity: currentPage === totalPages ? 0.25 : 1,
                  transition: 'opacity 0.15s, border-color 0.15s',
                }}
                onMouseEnter={e => {
                  if (currentPage !== totalPages)
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.45)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'
                }}
              >
                NEXT →
              </button>

              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  color: '#3a3a3a',
                  letterSpacing: '0.08em',
                  marginLeft: 8,
                  width: 90,
                  textAlign: 'left',
                }}
              >
                {(currentPage - 1) * PAGE_SIZE + 1}–
                {Math.min(currentPage * PAGE_SIZE, filtered.length)} / {filtered.length}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Títulos & Honras ── */}
      <HonorsSection />

      {/* ── Galeria ── */}
      <GallerySection eras={eras} />

      {/* ── Footer ── */}
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

      {/* ── Member Modal ── */}
      {selectedMember && (
        <MemberModal member={selectedMember} onClose={() => setSelectedMember(null)} />
      )}
    </div>
  )
}
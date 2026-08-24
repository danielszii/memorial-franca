import React, { useState, useMemo } from 'react'
import { Member, Rank } from '../../types/memorial'
import { MemberCard } from '../members/MemberCard'

interface MembersSectionProps {
  members: Member[]
  onSelectMember: (member: Member) => void
}

const PAGE_SIZE = 20

export function MembersSection({ members, onSelectMember }: MembersSectionProps) {
  const [search, setSearch] = useState('')
  const [filterVersion, setFilterVersion] = useState('Todas')
  const [filterRank, setFilterRank] = useState('Todos')
  const [currentPage, setCurrentPage] = useState(1)

  const handleFilterChange = (fn: () => void) => {
    fn()
    setCurrentPage(1)
  }

  const filtered = useMemo(() => {
    return members.filter(m => {
      const matchSearch =
        m.nick.toLowerCase().includes(search.toLowerCase()) ||
        m.discord.toLowerCase().includes(search.toLowerCase())

      const matchVersion = filterVersion === 'Todas' || m.versions?.includes(filterVersion)

      // Suporte para tag individual ou array
      const rawRanks = Array.isArray(m.rank) ? m.rank : [m.rank]
      const memberRanks = rawRanks.filter(Boolean)
      const matchRank =
        filterRank === 'Todos' ||
        memberRanks.some(r => String(r).toUpperCase() === filterRank.toUpperCase())

      return matchSearch && matchVersion && matchRank
    })
  }, [members, search, filterVersion, filterRank])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const legends = filtered.filter(m => m.id === 1 || m.id === 8).sort((a, b) => a.id - b.id)
  const rest = filtered.filter(m => m.id !== 1 && m.id !== 8)
  const sortedFiltered = [...legends, ...rest]
  const paginated = sortedFiltered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
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

        {/* Barra de Busca e Filtros */}
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

        {/* Grid de Membros */}
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
                onClick={() => onSelectMember(member)}
              />
            ))}
          </div>
        )}

        {/* Paginação */}
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
  )
}
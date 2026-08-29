import React, { useState, useMemo } from 'react'
import { Member } from '../../types/memorial'
import { MemberCard } from '../members/MemberCard'

interface MemberSectionProps {
  members: Member[]
  onSelectMember?: (member: Member) => void
}

export const MemberSection: React.FC<MemberSectionProps> = ({ members, onSelectMember }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRank, setSelectedRank] = useState<string>('TODOS')

  const filteredMembers = useMemo(() => {
    const filtered = members.filter((member) => {
      // 1. Busca por Nickname
      const matchesSearch = member.nick.toLowerCase().includes(searchTerm.toLowerCase())

      // 2. Normaliza os ranks para array
      const rawRanks = Array.isArray(member.rank) ? member.rank : [member.rank]
      const memberRanks = rawRanks.filter(Boolean)

      // 3. Filtro por Rank compatível com arrays
      const matchesRank =
        selectedRank === 'TODOS' ||
        memberRanks.some((r) => String(r).toUpperCase() === selectedRank.toUpperCase())

      return matchesSearch && matchesRank
    })

    const legends = filtered.filter(m => m.id === 1 || m.id === 8).sort((a, b) => a.id - b.id)
    const rest = filtered.filter(m => m.id !== 1 && m.id !== 8)
    const onlineStreamers = rest.filter(m => m.is_live)
    const offlineOthers = rest.filter(m => !m.is_live)
    return [...legends, ...onlineStreamers, ...offlineOthers]
  }, [members, searchTerm, selectedRank])

  return (
    <section id="membros" className="max-w-7xl mx-auto px-6 py-24 scroll-mt-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 border-b border-neutral-800 pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-red-600">Roster Histórico</span>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white mt-1">
            Membros Registrados <span className="text-red-600">({filteredMembers.length})</span>
          </h2>
        </div>

        {/* Barra de Busca e Filtros */}
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Buscar por nick..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-neutral-900 border border-neutral-800 text-xs px-4 py-2.5 rounded text-white focus:outline-none focus:border-red-600 transition"
          />

          <div className="flex flex-wrap gap-1">
            {['TODOS', 'FUNDADOR', 'LÍDER', 'GERENTE', 'MEMBRO'].map((rank) => (
              <button
                key={rank}
                onClick={() => setSelectedRank(rank)}
                className={`text-[10px] font-mono uppercase px-3 py-2 rounded transition cursor-pointer ${selectedRank === rank
                    ? 'bg-red-600 text-white font-bold'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                  }`}
              >
                {rank}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid de Membros */}
      {filteredMembers.length === 0 ? (
        <div className="text-center py-20 text-neutral-500 font-mono text-xs">
          NENHUM MEMBRO ENCONTRADO COM ESSE FILTRO.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredMembers.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              onClick={() => onSelectMember?.(member)}
            />
          ))}
        </div>
      )}
    </section>
  )
}
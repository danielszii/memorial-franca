import React, { useState } from 'react'

interface Championship {
  id: string
  edition: string
  title: string
  subtitle: string
  date: string
  description: string
  bannerImage: string
  stats: {
    label: string
    value: string
  }[]
  lineup: string[]
}

const titlesData: Championship[] = [
  {
    id: 'bgc-3',
    edition: 'BGC 3.0',
    title: 'CAMPEÃO BGC 3',
    subtitle: 'Batalha de Gangues da Cidade — Era 3.0',
    date: '2022',
    bannerImage: '/Banner TROFÉU BGC.png',
    description:
      'Conquista histórica que consolidou a hegemonia absoluta da facção. Domínio tático de ponta a ponta e consagração do elenco no cenário mais competitivo.',
    stats: [
      { label: 'CLASSIFICAÇÃO', value: '1º LUGAR' },
      { label: 'ERA', value: '3.0' },
      { label: 'STATUS', value: 'INVÍCTO' },
    ],
    lineup: ['Galeguin', 'Gordin9j', 'Spk', 'Brasil', 'Kroozz', 'Purpou', 'Gui P1', 'Mari'],
  },
  {
    id: 'bgc-2',
    edition: 'BGC 2.0',
    title: 'CAMPEÃO BGC 2',
    subtitle: 'Batalha de Gangues da Cidade — Era 2.0',
    date: '2021',
    bannerImage: '/Banner TROFÉU BGC 2.png',
    description:
      'O primeiro grande título da história da França. A consagração da primeira geração que colocou a bandeira francesa no topo.',
    stats: [
      { label: 'CLASSIFICAÇÃO', value: '1º LUGAR' },
      { label: 'ERA', value: '2.0' },
      { label: 'STATUS', value: 'CAMPEÃO' },
    ],
    lineup: ['Galeguin', 'Gaúcho', 'Brasil', 'Laura', 'Albara', 'Samurai', 'Kroozz', 'Caio'],
  },
]

export function HonorsSection() {
  const [selectedId, setSelectedId] = useState<string>('bgc-3')
  const currentTitle = titlesData.find(t => t.id === selectedId) || titlesData[0]

  return (
    <section
      id="conquistas"
      style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '72px 0',
        background: '#080808',
      }}
    >
      <div className="max-w-screen-xl mx-auto px-10">
        {/* ── Título da Seção ── */}
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
            TITRES & HONNEURS
          </h2>
        </div>

        {/* ── Banner Principal com o Troféu ── */}
        <div
          className="relative w-full rounded-xl overflow-hidden border border-[#c9a84c]/20 transition-all duration-300"
          style={{
            minHeight: '460px',
            backgroundImage: `url("${encodeURI(currentTitle.bannerImage)}")`,
            backgroundPosition: 'center right',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundColor: '#050505',
            boxShadow: '0 20px 50px rgba(0,0,0,0.9), 0 0 40px rgba(201,168,76,0.08)',
          }}
        >
          {/* Degradê para garantir contraste com o texto no mobile e desktop */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#070707] via-[#070707]/90 to-transparent md:w-3/4 w-full pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-transparent to-transparent md:hidden pointer-events-none" />

          {/* Linha de brilho superior dourada */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{
              background: 'linear-gradient(90deg, transparent, #c9a84c, #ffd700, transparent)',
            }}
          />

          {/* ── Conteúdo do Banner (Lado Esquerdo) ── */}
          <div className="relative z-10 p-6 md:p-12 flex flex-col justify-between h-full max-w-2xl">
            {/* Seletor de Títulos (Abas) */}
            <div className="flex items-center gap-2 mb-6">
              {titlesData.map(item => {
                const active = item.id === selectedId
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    className="transition-all duration-200 font-mono text-xs uppercase px-3 py-1.5 rounded"
                    style={{
                      background: active ? '#c9a84c' : 'rgba(255,255,255,0.05)',
                      color: active ? '#000' : '#888',
                      border: active ? '1px solid #ffd700' : '1px solid rgba(255,255,255,0.1)',
                      fontWeight: active ? 700 : 500,
                    }}
                  >
                    {item.edition}
                  </button>
                )
              })}
            </div>

            {/* Textos Principais */}
            <div>
              <div className="flex items-center gap-2 mb-2 font-mono text-xs text-[#c9a84c] tracking-widest uppercase">
                <span>★ TROFÉU OFICIAL</span>
                <span>•</span>
                <span>{currentTitle.date}</span>
              </div>

              <h1
                className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase mb-2 font-display"
                style={{
                  textShadow: '0 2px 10px rgba(0,0,0,0.8)',
                }}
              >
                {currentTitle.title}
              </h1>

              <p className="text-xs md:text-sm text-[#a0a0a0] mb-6 font-mono">
                {currentTitle.subtitle}
              </p>

              <p className="text-sm text-[#8a8a8a] leading-relaxed mb-8 max-w-xl">
                {currentTitle.description}
              </p>

              {/* Métricas / Stats */}
              <div className="grid grid-cols-3 gap-3 mb-6 max-w-lg">
                {currentTitle.stats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded bg-black/50 border border-white/5 backdrop-blur-sm"
                  >
                    <div className="text-[10px] font-mono text-[#555] tracking-wider mb-1">
                      {stat.label}
                    </div>
                    <div className="text-sm md:text-base font-bold text-[#c9a84c] font-display">
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Lineup / Elenco Campeão */}
              <div>
                <span className="text-[10px] font-mono text-[#555] tracking-wider uppercase block mb-2">
                  LINEUP CAMPEÃ:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentTitle.lineup.map(nick => (
                    <span
                      key={nick}
                      className="text-[11px] font-mono px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[#d4d4d4]"
                    >
                      {nick}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
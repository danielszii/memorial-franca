import React from 'react'
import { scrollToSection } from '../../utils/scroll'

interface HeroProps {
  totalMembers?: number
  totalEras?: number
}

export function HeroSection({ totalMembers = 120, totalEras = 6 }: HeroProps) {
  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 pt-20">
      {/* Background Decorativo */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(220,38,38,0.15),rgba(255,255,255,0))] pointer-events-none" />

      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-800 bg-neutral-900/60 text-[11px] font-mono uppercase tracking-widest text-neutral-400 mb-8">
        <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
        Memorial Oficial França
      </div>

      <h1 className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tighter text-white max-w-5xl leading-none mb-6">
        A HISTÓRIA QUE NUNCA <span className="text-red-600">SE APAGA</span>
      </h1>

      <p className="max-w-2xl text-sm sm:text-base text-neutral-400 font-light leading-relaxed mb-10">
        Registro cronológico e arquivo histórico de todas as eras, conquistas, lideranças e dos membros que construíram o legado da França.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
        <button
          onClick={() => scrollToSection('linha-do-tempo')}
          className="px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-widest transition duration-200 cursor-pointer shadow-lg shadow-red-600/20"
        >
          Ver Linha do Tempo
        </button>
        <button
          onClick={() => scrollToSection('membros')}
          className="px-8 py-3.5 border border-neutral-800 hover:border-neutral-700 bg-neutral-950 text-neutral-300 font-bold text-xs uppercase tracking-widest transition duration-200 cursor-pointer"
        >
          Explorar Membros
        </button>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl w-full border-t border-neutral-800/80 pt-10">
        <div>
          <div className="text-3xl font-black text-white">{totalEras}</div>
          <div className="text-[11px] uppercase tracking-widest font-mono text-neutral-500">Eras Registradas</div>
        </div>
        <div>
          <div className="text-3xl font-black text-white">{totalMembers}</div>
          <div className="text-[11px] uppercase tracking-widest font-mono text-neutral-500">Membros Registrados</div>
        </div>
        <div>
          <div className="text-3xl font-black text-white">100%</div>
          <div className="text-[11px] uppercase tracking-widest font-mono text-neutral-500">Dedicação</div>
        </div>
        <div>
          <div className="text-3xl font-black text-red-600">FRA × K</div>
          <div className="text-[11px] uppercase tracking-widest font-mono text-neutral-500">Legado Eterno</div>
        </div>
      </div>
    </section>
  )
}

export const Hero = HeroSection
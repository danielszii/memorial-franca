import React from 'react'
import { scrollToSection } from '../../utils/scroll'

export const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="text-xl font-bold tracking-widest text-white cursor-pointer" onClick={() => scrollToSection('hero')}>
          FRA <span className="text-red-600">×</span> K
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-widest text-neutral-400">
          <button onClick={() => scrollToSection('historia')} className="hover:text-white transition-colors cursor-pointer">
            História
          </button>
          <button onClick={() => scrollToSection('membros')} className="hover:text-white transition-colors cursor-pointer">
            Membros
          </button>
          <button onClick={() => scrollToSection('titulos')} className="hover:text-white transition-colors cursor-pointer">
            Títulos
          </button>
          <button onClick={() => scrollToSection('galeria')} className="hover:text-white transition-colors cursor-pointer">
            Galeria
          </button>
        </nav>

        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded transition"
        >
          Instagram
        </a>
      </div>
    </header>
  )
}
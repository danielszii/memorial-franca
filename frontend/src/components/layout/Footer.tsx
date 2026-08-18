import React from 'react'

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-neutral-900 bg-black py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <div className="text-lg font-black tracking-widest text-white">
            FRA <span className="text-red-600">×</span> K
          </div>
          <p className="text-xs text-neutral-500 mt-1">Memorial da França — Todos os direitos reservados.</p>
        </div>

        <div className="text-xs font-mono text-neutral-600 uppercase tracking-widest">
          HONRA • LEALDADE • TRADIÇÃO
        </div>
      </div>
    </footer>
  )
}
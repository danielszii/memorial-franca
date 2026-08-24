import React, { useState } from 'react'

interface DevDonationModalProps {
  isOpen: boolean
  onClose: () => void
  livepixUrl?: string
  devName?: string
}

export function DevDonationModal({
  isOpen,
  onClose,
  livepixUrl = 'https://vaquinha.livepix.gg/memorial-franca',
  devName = 'Daniel Souza',
}: DevDonationModalProps) {
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const handleCopyLink = () => {
    navigator.clipboard.writeText(livepixUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md"
        style={{
          background: '#0e0e0e',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.9), 0 0 30px rgba(237,41,57,0.1)',
          overflow: 'hidden',
          fontFamily: 'var(--font-mono)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Linha de acento tricolor no topo */}
        <div style={{ height: 2, display: 'flex' }}>
          <div style={{ flex: 1, background: '#002395' }} />
          <div style={{ flex: 1, background: '#ffffff' }} />
          <div style={{ flex: 1, background: '#ED2939' }} />
        </div>

        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3
                className="text-base font-bold text-white uppercase tracking-wider"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Apoie o Memorial
              </h3>
              <span className="text-[10px] text-neutral-500 tracking-tight">
                Vaquinha oficial & apoio ao desenvolvimento
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-neutral-500 hover:text-white transition cursor-pointer text-lg leading-none p-1"
            >
              ✕
            </button>
          </div>

          {/* Mensagem respeitosa ao propósito do memorial */}
          <div
            className="p-3.5 rounded mb-5"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <p className="text-xs text-neutral-400 leading-relaxed m-0 font-sans font-light">
              Este memorial foi construído de forma independente para preservar e eternizar a história da{' '}
              <strong className="text-white font-semibold">Tropa da França</strong> no FiveM.
            </p>
            <p className="text-xs text-neutral-400 leading-relaxed mt-2 mb-0 font-sans font-light">
              Sua contribuição ajuda a manter os servidores e domínio no ar, além de apoiar novas atualizações e recursos para a comunidade!
            </p>
          </div>

          {/* Botão Principal LivePix */}
          <div className="space-y-3 mb-4">
            <a
              href={livepixUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded bg-[#ED2939] hover:bg-[#ff3b4b] text-white text-xs font-bold tracking-wider transition uppercase flex items-center justify-center gap-2 no-underline text-center shadow-lg"
              style={{
                boxShadow: '0 4px 15px rgba(237,41,57,0.35)',
              }}
            >
              ACESSAR VAQUINHA NO LIVEPIX ↗
            </a>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={livepixUrl}
                className="flex-1 px-3 py-2 rounded bg-black/60 border border-white/10 text-[11px] text-neutral-400 outline-none select-all"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3 py-2 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[11px] font-bold tracking-wider cursor-pointer transition uppercase flex-shrink-0"
              >
                {copied ? '✓ COPIADO' : 'COPIAR'}
              </button>
            </div>
          </div>

          {/* Footer do Modal */}
          <div className="flex items-center justify-between pt-3 border-t border-white/5 text-[10px] text-neutral-500">
            <span>Desenvolvido por {devName}</span>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-white transition cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

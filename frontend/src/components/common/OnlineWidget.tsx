import React, { useState, useEffect } from 'react'
import axios from 'axios'

function getOrCreateVisitorId(): string {
  try {
    let id = sessionStorage.getItem('fra_visitor_id')
    if (!id) {
      id = 'v_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36)
      sessionStorage.setItem('fra_visitor_id', id)
    }
    return id
  } catch (_) {
    return 'v_' + Math.random().toString(36).substring(2, 9)
  }
}

export function OnlineWidget() {
  const [onlineCount, setOnlineCount] = useState<number>(1)

  useEffect(() => {
    const visitorId = getOrCreateVisitorId()
    const API_URL = import.meta.env.VITE_API_URL || 'https://memorial-franca.onrender.com'

    async function pingPresence() {
      try {
        const res = await axios.get(`${API_URL}/franca/online`, {
          params: { visitorId },
          timeout: 4000,
        })
        if (res.data && typeof res.data.online === 'number') {
          setOnlineCount(Math.max(1, res.data.online))
        }
      } catch (_) {
        // Em caso de falha de conexão, mantém no mínimo 1 (o próprio usuário)
      }
    }

    pingPresence()
    const interval = setInterval(pingPresence, 25000) // Ping a cada 25 segundos

    return () => clearInterval(interval)
  }, [])

  return (
    <div
      title="Visitantes navegando no Memorial agora"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        padding: '4px 10px',
        borderRadius: '20px',
        fontFamily: 'var(--font-mono)',
        userSelect: 'none',
      }}
    >
      {/* Ponto verde pulsante */}
      <span style={{ position: 'relative', display: 'flex', height: 7, width: 7 }}>
        <span
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            backgroundColor: '#22c55e',
            opacity: 0.75,
            animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
          }}
        />
        <span
          style={{
            position: 'relative',
            display: 'inline-flex',
            borderRadius: '50%',
            height: 7,
            width: 7,
            backgroundColor: '#22c55e',
          }}
        />
      </span>

      <span
        style={{
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: '0.08em',
          color: '#a3a3a3',
          textTransform: 'uppercase',
        }}
      >
        <strong style={{ color: '#f5f5f5', marginRight: 3 }}>{onlineCount}</strong>
        {onlineCount === 1 ? 'ONLINE' : 'ONLINE'}
      </span>

      <style>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

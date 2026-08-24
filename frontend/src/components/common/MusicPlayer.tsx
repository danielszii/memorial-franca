import React, { useState, useEffect, useRef } from 'react'

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

const FIXED_YOUTUBE_VIDEO_ID = 'xCBXfrrYc2c'

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const playerRef = useRef<any>(null)
  const containerId = 'youtube-hidden-player'

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag)

      window.onYouTubeIframeAPIReady = () => {
        initPlayer(FIXED_YOUTUBE_VIDEO_ID)
      }
    } else {
      initPlayer(FIXED_YOUTUBE_VIDEO_ID)
    }

    return () => {
      if (playerRef.current && playerRef.current.destroy) {
        try {
          playerRef.current.destroy()
        } catch (_) {}
      }
    }
  }, [])

  function initPlayer(videoId: string) {
    if (!window.YT || !window.YT.Player) return

    try {
      playerRef.current = new window.YT.Player(containerId, {
        height: '1',
        width: '1',
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          loop: 1,
          playlist: videoId,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: (event: any) => {
            event.target.setVolume(80)
          },
          onStateChange: (event: any) => {
            if (event.data === 1) {
              setIsPlaying(true)
            } else if (event.data === 2 || event.data === 0) {
              setIsPlaying(false)
            }
          },
          onError: () => {
            setIsPlaying(false)
          },
        },
      })
    } catch (e) {
      console.error('Erro ao inicializar player do YouTube:', e)
    }
  }

  const togglePlay = () => {
    if (!playerRef.current) return

    try {
      if (isPlaying) {
        playerRef.current.pauseVideo()
        setIsPlaying(false)
      } else {
        playerRef.current.playVideo()
        setIsPlaying(true)
      }
    } catch (e) {
      console.error('Erro ao alternar reprodução:', e)
    }
  }

  return (
    <div className="inline-flex items-center">
      {/* Elemento oculto do YouTube */}
      <div
        id={containerId}
        style={{
          position: 'fixed',
          bottom: 0,
          right: 0,
          width: 1,
          height: 1,
          opacity: 0.01,
          pointerEvents: 'none',
          zIndex: -1,
        }}
      />

      {/* Player Minimalista Fixo */}
      <button
        type="button"
        onClick={togglePlay}
        title={isPlaying ? 'Pausar Hino' : 'Tocar Hino da França'}
        style={{
          background: isPlaying ? 'rgba(237,41,57,0.1)' : '#0d0d0d',
          border: isPlaying ? '1px solid rgba(237,41,57,0.45)' : '1px solid rgba(255,255,255,0.09)',
          borderRadius: '4px',
          padding: '6px 12px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          fontFamily: 'var(--font-mono)',
          cursor: 'pointer',
          transition: 'all 0.2s',
          outline: 'none',
        }}
        onMouseEnter={e => {
          if (!isPlaying) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)'
        }}
        onMouseLeave={e => {
          if (!isPlaying) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'
        }}
      >
        {/* Ícone Play/Pause Circular */}
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: '50%',
            background: isPlaying ? '#ED2939' : 'rgba(255,255,255,0.08)',
            border: isPlaying ? '1px solid #ED2939' : '1px solid rgba(255,255,255,0.15)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'background 0.2s',
          }}
        >
          {isPlaying ? (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: 2 }}>
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </div>

        {/* Equalizador Animado Tricolor */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 14, width: 12 }}>
          <span
            style={{
              width: 2,
              background: '#ED2939',
              borderRadius: 1,
              height: isPlaying ? 12 : 3,
              transition: 'height 0.15s',
              animation: isPlaying ? 'equalizerBar1 0.6s infinite ease-in-out alternate' : 'none',
            }}
          />
          <span
            style={{
              width: 2,
              background: '#ffffff',
              borderRadius: 1,
              height: isPlaying ? 14 : 5,
              transition: 'height 0.15s',
              animation: isPlaying ? 'equalizerBar2 0.4s infinite ease-in-out alternate 0.2s' : 'none',
            }}
          />
          <span
            style={{
              width: 2,
              background: '#002395',
              borderRadius: 1,
              height: isPlaying ? 10 : 3,
              transition: 'height 0.15s',
              animation: isPlaying ? 'equalizerBar3 0.5s infinite ease-in-out alternate 0.1s' : 'none',
            }}
          />
        </div>

        {/* Texto do Hino */}
        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: isPlaying ? '#ffffff' : '#a0a0a0',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              lineHeight: 1.2,
            }}
          >
            HINO DA FRANÇA
          </span>
          <span
            style={{
              fontSize: 9,
              color: isPlaying ? '#ED2939' : '#555555',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              lineHeight: 1.2,
            }}
          >
            {isPlaying ? '● TOCANDO' : 'CLIQUE P/ OUVIR'}
          </span>
        </div>
      </button>

      {/* Keyframes de animação */}
      <style>{`
        @keyframes equalizerBar1 {
          0% { height: 3px; }
          100% { height: 12px; }
        }
        @keyframes equalizerBar2 {
          0% { height: 5px; }
          100% { height: 14px; }
        }
        @keyframes equalizerBar3 {
          0% { height: 3px; }
          100% { height: 10px; }
        }
      `}</style>
    </div>
  )
}

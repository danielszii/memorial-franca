import pool from '../config/database'

export class LiveSyncService {
  private static intervalId: NodeJS.Timeout | null = null
  private static isRunning = false
  private static cachedToken: string | null = null
  private static tokenExpiresAt = 0

  private static extractUsername(twitchValue: string | null | undefined): string | null {
    if (!twitchValue) return null
    const cleaned = twitchValue.trim()
    if (cleaned.includes('twitch.tv/')) {
      const parts = cleaned.split('twitch.tv/')
      const userPart = parts[parts.length - 1]
      return userPart.split('/')[0].split('?')[0].trim().toLowerCase()
    }
    return cleaned.toLowerCase()
  }

  private static extractKickUsername(kickValue: string | null | undefined): string | null {
    if (!kickValue) return null
    const cleaned = kickValue.trim()
    if (cleaned.includes('kick.com/')) {
      const parts = cleaned.split('kick.com/')
      const userPart = parts[parts.length - 1]
      return userPart.split('/')[0].split('?')[0].trim().toLowerCase()
    }
    return cleaned.toLowerCase()
  }

  private static extractYoutubeHandle(ytValue: string | null | undefined): string | null {
    if (!ytValue) return null
    const cleaned = ytValue.trim()
    if (cleaned.includes('youtube.com/')) {
      const parts = cleaned.split('youtube.com/')
      const userPart = parts[parts.length - 1]
      const channel = userPart.split('/')[0].split('?')[0].trim()
      if (channel.startsWith('c/') || channel.startsWith('channel/')) {
        return channel
      }
      return channel.startsWith('@') ? channel : `@${channel}`
    }
    return cleaned.startsWith('@') ? cleaned : `@${cleaned}`
  }

  private static async getAppAccessToken(clientId: string, clientSecret: string): Promise<string> {
    const now = Date.now()
    if (this.cachedToken && now < this.tokenExpiresAt) {
      return this.cachedToken
    }

    console.log('[Live Sync] Obtendo novo App Access Token da Twitch...')
    const response = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials',
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Falha na autenticação da Twitch: ${response.statusText} - ${errorText}`)
    }

    const data = (await response.json()) as { access_token: string; expires_in: number }
    this.cachedToken = data.access_token
    this.tokenExpiresAt = now + (data.expires_in - 60) * 1000

    return this.cachedToken
  }

  private static async checkKickLive(username: string): Promise<boolean> {
    try {
      const url = `https://kick.com/api/v1/channels/${username}`
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json'
        }
      })
      if (res.status === 403) {
        return false // Bloqueado por Cloudflare
      }
      if (!res.ok) return false
      const data = (await res.json()) as { livestream?: { id: number; is_live: boolean } | null }
      return !!data.livestream
    } catch (err) {
      return false
    }
  }

  private static async checkYoutubeLive(handleOrChannel: string): Promise<boolean> {
    try {
      const path = handleOrChannel.startsWith('@') || handleOrChannel.includes('/') ? handleOrChannel : `@${handleOrChannel}`
      const url = `https://www.youtube.com/${path}/live`
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      })
      if (!res.ok) return false
      const html = await res.text()
      return html.includes('"isLive":true') || html.includes('"isLivePlayable":true')
    } catch (err) {
      return false
    }
  }

  public static async sync(): Promise<void> {
    if (this.isRunning) {
      console.log('[Live Sync] A sincronização anterior ainda está rodando. Pulando esta rodada.')
      return
    }

    this.isRunning = true

    try {
      // 1. Busca todos os membros com pelo menos um canal configurado
      const { rows: members } = await pool.query<{
        id: number
        twitch: string | null
        youtube: string | null
        kick: string | null
      }>(
        `SELECT id, twitch, youtube, kick 
         FROM members 
         WHERE (twitch IS NOT NULL AND twitch != '') 
            OR (youtube IS NOT NULL AND youtube != '') 
            OR (kick IS NOT NULL AND kick != '');`
      )

      if (members.length === 0) {
        await pool.query('UPDATE members SET is_live = FALSE, live_url = NULL WHERE is_live = TRUE;')
        this.isRunning = false
        return
      }

      // Mapeamento de memberId -> link ativo se estiver ao vivo
      const liveMemberUrls = new Map<number, string>()

      // ─────────────────────────────────────────────────────────────────
      // A. CHECAGEM DA TWITCH (Em lote se as credenciais existirem)
      // ─────────────────────────────────────────────────────────────────
      const twitchClientId = process.env.TWITCH_CLIENT_ID
      const twitchClientSecret = process.env.TWITCH_CLIENT_SECRET

      if (twitchClientId && twitchClientSecret) {
        try {
          const twitchMembers = members.filter(m => m.twitch && m.twitch.trim() !== '')
          if (twitchMembers.length > 0) {
            const twitchUsernameToIdsMap = new Map<string, number[]>()
            for (const m of twitchMembers) {
              const username = this.extractUsername(m.twitch)
              if (username) {
                const list = twitchUsernameToIdsMap.get(username) || []
                list.push(m.id)
                twitchUsernameToIdsMap.set(username, list)
              }
            }

            const allTwitchUsernames = Array.from(twitchUsernameToIdsMap.keys())
            const twitchToken = await this.getAppAccessToken(twitchClientId, twitchClientSecret)
            const batchSize = 100

            for (let i = 0; i < allTwitchUsernames.length; i += batchSize) {
              const batch = allTwitchUsernames.slice(i, i + batchSize)
              const params = new URLSearchParams()
              for (const username of batch) {
                params.append('user_login', username)
              }

              const url = `https://api.twitch.tv/helix/streams?${params.toString()}`
              const response = await fetch(url, {
                method: 'GET',
                headers: {
                  'Client-ID': twitchClientId,
                  'Authorization': `Bearer ${twitchToken}`,
                },
              })

              if (response.ok) {
                const body = (await response.json()) as { data: Array<{ user_login: string; type: string }> }
                for (const stream of body.data) {
                  if (stream.type === 'live') {
                    const usernameLower = stream.user_login.toLowerCase()
                    const ids = twitchUsernameToIdsMap.get(usernameLower)
                    if (ids) {
                      for (const id of ids) {
                        liveMemberUrls.set(id, `https://twitch.tv/${usernameLower}`)
                      }
                    }
                  }
                }
              }
            }
          }
        } catch (err) {
          console.error('[Live Sync] Erro ao sincronizar Twitch:', err)
        }
      }

      // ─────────────────────────────────────────────────────────────────
      // B. CHECAGEM DO KICK (Um a um em paralelo)
      // ─────────────────────────────────────────────────────────────────
      const kickMembers = members.filter(m => m.kick && m.kick.trim() !== '')
      if (kickMembers.length > 0) {
        await Promise.all(
          kickMembers.map(async m => {
            const username = this.extractKickUsername(m.kick)
            if (username) {
              const isLive = await this.checkKickLive(username)
              if (isLive) {
                liveMemberUrls.set(m.id, `https://kick.com/${username}`)
              }
            }
          })
        )
      }

      // ─────────────────────────────────────────────────────────────────
      // C. CHECAGEM DO YOUTUBE (Um a um em paralelo)
      // ─────────────────────────────────────────────────────────────────
      const youtubeMembers = members.filter(m => m.youtube && m.youtube.trim() !== '')
      if (youtubeMembers.length > 0) {
        await Promise.all(
          youtubeMembers.map(async m => {
            const handle = this.extractYoutubeHandle(m.youtube)
            if (handle) {
              const isLive = await this.checkYoutubeLive(handle)
              if (isLive) {
                const path = handle.startsWith('@') || handle.includes('/') ? handle : `@${handle}`
                liveMemberUrls.set(m.id, `https://youtube.com/${path}/live`)
              }
            }
          })
        )
      }

      // ─────────────────────────────────────────────────────────────────
      // D. ATUALIZAÇÃO NO BANCO DE DADOS
      // ─────────────────────────────────────────────────────────────────
      const client = await pool.connect()
      try {
        await client.query('BEGIN')

        // Reseta todos para offline
        await client.query('UPDATE members SET is_live = FALSE, live_url = NULL WHERE is_live = TRUE;')

        // Define os novos que estão online
        if (liveMemberUrls.size > 0) {
          for (const [id, url] of liveMemberUrls.entries()) {
            await client.query(
              'UPDATE members SET is_live = TRUE, live_url = $1 WHERE id = $2;',
              [url, id]
            )
          }
        }

        await client.query('COMMIT')
        console.log(`[Live Sync] Sincronização concluída. Membros em live detectados: ${liveMemberUrls.size}`)
      } catch (err) {
        await client.query('ROLLBACK')
        throw err
      } finally {
        client.release()
      }

    } catch (error) {
      console.error('[Live Sync] Erro geral na rotina de sincronização:', error)
    } finally {
      this.isRunning = false
    }
  }

  public static startScheduler(intervalMs = 120000): void {
    if (this.intervalId) {
      return
    }

    console.log(`[Live Sync] Iniciando sincronização periódica de lives (a cada ${intervalMs / 1000}s)...`)
    
    // Executa primeira vez após 5s
    setTimeout(() => {
      this.sync()
    }, 5000)

    this.intervalId = setInterval(() => {
      this.sync()
    }, intervalMs)
  }

  public static stopScheduler(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
      console.log('[Live Sync] Sincronização periódica interrompida.')
    }
  }
}

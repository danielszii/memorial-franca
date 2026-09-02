import pool from '../config/database'

export interface LiveSyncResult {
  success: boolean
  detectedCount: number
  liveMembers: Array<{ id: number; url: string; platform: string }>
  durationMs: number
}

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
    return cleaned.replace(/^@/, '').toLowerCase()
  }

  private static extractKickUsername(kickValue: string | null | undefined): string | null {
    if (!kickValue) return null
    const cleaned = kickValue.trim()
    if (cleaned.includes('kick.com/')) {
      const parts = cleaned.split('kick.com/')
      const userPart = parts[parts.length - 1]
      return userPart.split('/')[0].split('?')[0].trim().toLowerCase()
    }
    return cleaned.replace(/^@/, '').toLowerCase()
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
      signal: AbortSignal.timeout(6000),
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
      const url = `https://kick.com/api/v2/channels/${encodeURIComponent(username)}`
      const res = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        signal: AbortSignal.timeout(5000),
      })
      if (!res.ok) return false
      const data = (await res.json()) as {
        is_banned?: boolean
        livestream?: { id: number; session_title?: string } | null
      }
      return !data.is_banned && !!data.livestream
    } catch {
      return false
    }
  }

  private static async checkYoutubeLive(handleOrChannel: string): Promise<boolean> {
    try {
      const path = handleOrChannel.startsWith('@') || handleOrChannel.includes('/') ? handleOrChannel : `@${handleOrChannel}`
      const url = `https://www.youtube.com/${path}/live`
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        signal: AbortSignal.timeout(5000),
      })
      if (!res.ok) return false
      const html = await res.text()
      return html.includes('"isLive":true') || html.includes('"isLivePlayable":true') || html.includes('"status":"LIVE"')
    } catch {
      return false
    }
  }

  public static async sync(): Promise<LiveSyncResult> {
    if (this.isRunning) {
      console.log('[Live Sync] A sincronização anterior ainda está rodando. Pulando esta rodada.')
      return { success: false, detectedCount: 0, liveMembers: [], durationMs: 0 }
    }

    const startTime = Date.now()
    this.isRunning = true

    try {
      // 1. Busca todos os membros com pelo menos um canal configurado
      const { rows: members } = await pool.query<{
        id: number
        nick: string
        twitch: string | null
        youtube: string | null
        kick: string | null
      }>(
        `SELECT id, nick, twitch, youtube, kick 
         FROM members 
         WHERE (twitch IS NOT NULL AND twitch != '') 
            OR (youtube IS NOT NULL AND youtube != '') 
            OR (kick IS NOT NULL AND kick != '');`
      )

      if (members.length === 0) {
        await pool.query('UPDATE members SET is_live = FALSE, live_url = NULL WHERE is_live = TRUE;')
        this.isRunning = false
        return { success: true, detectedCount: 0, liveMembers: [], durationMs: Date.now() - startTime }
      }

      // Mapeamento de memberId -> { url, platform } se estiver ao vivo
      const liveMemberMap = new Map<number, { url: string; platform: string; nick: string }>()

      // ─────────────────────────────────────────────────────────────────
      // A. CHECAGEM DA TWITCH (Oficial Helix ou Fallback GraphQL)
      // ─────────────────────────────────────────────────────────────────
      const twitchClientId = process.env.TWITCH_CLIENT_ID
      const twitchClientSecret = process.env.TWITCH_CLIENT_SECRET

      if (twitchClientId && twitchClientSecret) {
        try {
          const twitchMembers = members.filter(m => m.twitch && m.twitch.trim() !== '')
          if (twitchMembers.length > 0) {
            const twitchUsernameToMembersMap = new Map<string, typeof twitchMembers>()
            for (const m of twitchMembers) {
              const username = this.extractUsername(m.twitch)
              if (username) {
                const list = twitchUsernameToMembersMap.get(username) || []
                list.push(m)
                twitchUsernameToMembersMap.set(username, list)
              }
            }

            const allTwitchUsernames = Array.from(twitchUsernameToMembersMap.keys())
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
                signal: AbortSignal.timeout(6000),
              })

              if (response.ok) {
                const body = (await response.json()) as { data: Array<{ user_login: string; type: string }> }
                for (const stream of body.data) {
                  if (stream.type === 'live') {
                    const usernameLower = stream.user_login.toLowerCase()
                    const matchedMembers = twitchUsernameToMembersMap.get(usernameLower)
                    if (matchedMembers) {
                      for (const m of matchedMembers) {
                        liveMemberMap.set(m.id, {
                          url: `https://twitch.tv/${usernameLower}`,
                          platform: 'Twitch',
                          nick: m.nick,
                        })
                      }
                    }
                  }
                }
              }
            }
          }
        } catch (err) {
          console.error('[Live Sync] Erro ao sincronizar Twitch (Helix):', err)
        }
      } else {
        // Fallback: usar GraphQL da Twitch (não requer credenciais do desenvolvedor)
        try {
          const twitchMembers = members.filter(m => m.twitch && m.twitch.trim() !== '')
          if (twitchMembers.length > 0) {
            const twitchUsernameToMembersMap = new Map<string, typeof twitchMembers>()
            for (const m of twitchMembers) {
              const username = this.extractUsername(m.twitch)
              if (username) {
                const list = twitchUsernameToMembersMap.get(username) || []
                list.push(m)
                twitchUsernameToMembersMap.set(username, list)
              }
            }

            const allTwitchUsernames = Array.from(twitchUsernameToMembersMap.keys())
            const batchSize = 25

            for (let i = 0; i < allTwitchUsernames.length; i += batchSize) {
              const batch = allTwitchUsernames.slice(i, i + batchSize)
              const body = batch.map(username => ({
                operationName: 'StreamRefetch',
                variables: {
                  channel: username,
                },
                query: 'query StreamRefetch($channel: String!) { user(login: $channel) { stream { id type } } }',
              }))

              const response = await fetch('https://gql.twitch.tv/gql', {
                method: 'POST',
                headers: {
                  'Client-ID': 'kimne78kx3ncx6brgo4mv6wki5h1ko',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
                signal: AbortSignal.timeout(6000),
              })

              if (response.ok) {
                const data = (await response.json()) as Array<{
                  data?: { user?: { stream?: { id: string; type: string } | null } | null }
                }>
                data.forEach((item, index) => {
                  const stream = item?.data?.user?.stream
                  if (stream && stream.type === 'live') {
                    const usernameLower = batch[index].toLowerCase()
                    const matchedMembers = twitchUsernameToMembersMap.get(usernameLower)
                    if (matchedMembers) {
                      for (const m of matchedMembers) {
                        liveMemberMap.set(m.id, {
                          url: `https://twitch.tv/${usernameLower}`,
                          platform: 'Twitch',
                          nick: m.nick,
                        })
                      }
                    }
                  }
                })
              }
            }
          }
        } catch (err) {
          console.error('[Live Sync] Erro ao sincronizar Twitch (GQL Fallback):', err)
        }
      }

      // ─────────────────────────────────────────────────────────────────
      // B. CHECAGEM DO KICK (Lotes controlados com pausa para evitar 429)
      // ─────────────────────────────────────────────────────────────────
      const kickMembers = members.filter(m => m.kick && m.kick.trim() !== '')
      if (kickMembers.length > 0) {
        const batchSize = 5
        for (let i = 0; i < kickMembers.length; i += batchSize) {
          const batch = kickMembers.slice(i, i + batchSize)
          await Promise.all(
            batch.map(async m => {
              const username = this.extractKickUsername(m.kick)
              if (username) {
                const isLive = await this.checkKickLive(username)
                if (isLive) {
                  liveMemberMap.set(m.id, {
                    url: `https://kick.com/${username}`,
                    platform: 'Kick',
                    nick: m.nick,
                  })
                }
              }
            })
          )
          // Pequena pausa entre lotes para não estressar a conexão
          if (i + batchSize < kickMembers.length) {
            await new Promise(res => setTimeout(res, 100))
          }
        }
      }

      // ─────────────────────────────────────────────────────────────────
      // C. CHECAGEM DO YOUTUBE
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
                liveMemberMap.set(m.id, {
                  url: `https://youtube.com/${path}/live`,
                  platform: 'YouTube',
                  nick: m.nick,
                })
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
        if (liveMemberMap.size > 0) {
          for (const [id, liveInfo] of liveMemberMap.entries()) {
            await client.query(
              'UPDATE members SET is_live = TRUE, live_url = $1 WHERE id = $2;',
              [liveInfo.url, id]
            )
          }
        }

        await client.query('COMMIT')
        const duration = Date.now() - startTime
        console.log(
          `[Live Sync] Sincronização concluída em ${duration}ms. Membros em live detectados: ${liveMemberMap.size}`
        )
        if (liveMemberMap.size > 0) {
          const names = Array.from(liveMemberMap.values())
            .map(item => `${item.nick} (${item.platform})`)
            .join(', ')
          console.log(`[Live Sync] Ao vivo: ${names}`)
        }

        return {
          success: true,
          detectedCount: liveMemberMap.size,
          liveMembers: Array.from(liveMemberMap.entries()).map(([id, info]) => ({
            id,
            url: info.url,
            platform: info.platform,
          })),
          durationMs: duration,
        }
      } catch (err) {
        await client.query('ROLLBACK')
        throw err
      } finally {
        client.release()
      }
    } catch (error) {
      console.error('[Live Sync] Erro geral na rotina de sincronização:', error)
      return { success: false, detectedCount: 0, liveMembers: [], durationMs: Date.now() - startTime }
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
      this.sync().catch(err => console.error('[Live Sync] Erro na execução inicial:', err))
    }, 5000)

    this.intervalId = setInterval(() => {
      this.sync().catch(err => console.error('[Live Sync] Erro na execução periódica:', err))
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

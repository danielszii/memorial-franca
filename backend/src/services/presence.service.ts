export class PresenceService {
  private static activeVisitors: Map<string, number> = new Map()
  private static readonly TTL_MS = 45000 // 45 segundos de inatividade

  public static ping(visitorId: string): number {
    const now = Date.now()
    if (visitorId) {
      this.activeVisitors.set(visitorId, now)
    }

    // Remove visitantes expirados
    for (const [id, lastSeen] of this.activeVisitors.entries()) {
      if (now - lastSeen > this.TTL_MS) {
        this.activeVisitors.delete(id)
      }
    }

    return Math.max(1, this.activeVisitors.size)
  }
}

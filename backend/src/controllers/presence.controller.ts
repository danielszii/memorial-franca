import { Request, Response } from 'express'
import { PresenceService } from '../services/presence.service'

export class PresenceController {
  getOnline = (req: Request, res: Response): void => {
    try {
      const visitorId = (req.query.visitorId as string) || req.ip || 'anonymous'
      const count = PresenceService.ping(visitorId)
      res.status(200).json({ online: count })
    } catch (_) {
      res.status(200).json({ online: 1 })
    }
  }
}

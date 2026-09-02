import { Request, Response, NextFunction } from 'express'
import { MemberService } from '../services/member.service'
import { LiveSyncService } from '../services/live-sync.service'
import { AppError } from '../errors/app.error'

export class MemberController {
  private memberService: MemberService

  constructor() {
    this.memberService = new MemberService()
  }

  getAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const members = await this.memberService.getAllMembers()
      res.status(200).json(members)
    } catch (error) {
      next(error)
    }
  }

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
      const id = Number(rawId)

      if (isNaN(id) || !rawId) {
        throw new AppError('O parâmetro ID deve ser um número válido.', 400)
      }

      const member = await this.memberService.getMemberById(id)
      res.status(200).json(member)
    } catch (error) {
      next(error)
    }
  }

  syncLives = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await LiveSyncService.sync()
      res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }

  voteRespect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
      const id = Number(rawId)

      if (isNaN(id) || !rawId) {
        throw new AppError('O parâmetro ID deve ser um número válido.', 400)
      }

      // Extrai o IP real considerando proxies (Cloudflare, Render, proxies reversos)
      const cfIp = req.headers['cf-connecting-ip']
      const xForwardedFor = req.headers['x-forwarded-for']
      const xRealIp = req.headers['x-real-ip']

      let clientIp = ''
      if (typeof cfIp === 'string' && cfIp.trim()) {
        clientIp = cfIp.trim()
      } else if (typeof xForwardedFor === 'string' && xForwardedFor.trim()) {
        clientIp = xForwardedFor.split(',')[0].trim()
      } else if (typeof xRealIp === 'string' && xRealIp.trim()) {
        clientIp = xRealIp.trim()
      } else {
        clientIp = req.socket.remoteAddress || '127.0.0.1'
      }

      const result = await this.memberService.voteRespect(id, clientIp)
      res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }
}
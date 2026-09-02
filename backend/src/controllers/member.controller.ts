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
}
import { Request, Response, NextFunction } from 'express'
import { EraService } from '../services/era.service'

export class EraController {
  private eraService: EraService

  constructor() {
    this.eraService = new EraService()
  }

  getAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const eras = await this.eraService.getAllEras()
      res.status(200).json(eras)
    } catch (error) {
      next(error)
    }
  }

  getByVersion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const version = Array.isArray(req.params.version) 
        ? req.params.version[0] 
        : String(req.params.version)

      const era = await this.eraService.getEraByVersion(version)
      res.status(200).json(era)
    } catch (error) {
      next(error)
    }
  }
}
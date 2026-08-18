import { EraRepository } from '../repositories/era.repository'
import { EraResponseDTO } from '../dtos/era.dto'
import { AppError } from '../errors/app.error'

export class EraService {
  private eraRepository: EraRepository

  constructor() {
    this.eraRepository = new EraRepository()
  }

  async getAllEras(): Promise<EraResponseDTO[]> {
    return await this.eraRepository.findAll()
  }

  async getEraByVersion(version: string): Promise<EraResponseDTO> {
    const era = await this.eraRepository.findByVersion(version)
    if (!era) {
      throw new AppError(`Era '${version}' não encontrada.`, 404)
    }
    return era
  }
}
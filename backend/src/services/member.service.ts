import crypto from 'crypto'
import { MemberRepository } from '../repositories/member.repository'
import { MemberResponseDTO } from '../dtos/member.dto'
import { AppError } from '../errors/app.error'

export class MemberService {
  private memberRepository: MemberRepository

  constructor() {
    this.memberRepository = new MemberRepository()
  }

  async getAllMembers(): Promise<MemberResponseDTO[]> {
    return await this.memberRepository.findAll()
  }

  async getMemberById(id: number): Promise<MemberResponseDTO> {
    const member = await this.memberRepository.findById(id)
    if (!member) {
      throw new AppError(`Membro com ID ${id} não encontrado.`, 404)
    }
    return member
  }

  async voteRespect(
    memberId: number,
    ip: string
  ): Promise<{ success: boolean; newRespectCount: number; remainingVotes: number }> {
    // 1. Gera a data atual no formato YYYY-MM-DD
    const today = new Date().toISOString().slice(0, 10)
    const cleanIp = (ip || '127.0.0.1').trim()

    // 2. Hash do torcedor no dia (para controle do limite de 5 votos/dia)
    const userHash = crypto.createHash('sha256').update(`${cleanIp}::${today}`).digest('hex')

    // 3. Hash específico do voto no membro (para impedir 2 votos no mesmo membro/dia)
    const voteHash = crypto
      .createHash('sha256')
      .update(`${cleanIp}::${memberId}::${today}`)
      .digest('hex')

    // 4. Executa o voto no repositório com transação atômica
    const result = await this.memberRepository.voteRespect(memberId, userHash, voteHash)

    return {
      success: true,
      newRespectCount: result.newRespectCount,
      remainingVotes: result.remainingVotes,
    }
  }
}
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

  async voteRespect(memberId: number, ip: string): Promise<{ success: boolean; newRespectCount: number }> {
    // 1. Gera a data atual no formato YYYY-MM-DD
    const today = new Date().toISOString().slice(0, 10)

    // 2. Cria o hash anônimo SHA-256 (IP + "::" + Data)
    // Isso garante anonimato (não salva IP no banco) e controle estrito de 1 voto/dia
    const cleanIp = (ip || '127.0.0.1').trim()
    const voteHash = crypto.createHash('sha256').update(`${cleanIp}::${today}`).digest('hex')

    // 3. Executa o voto no repositório com transação atômica
    const newRespectCount = await this.memberRepository.voteRespect(memberId, voteHash)

    return {
      success: true,
      newRespectCount,
    }
  }
}
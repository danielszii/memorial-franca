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
}
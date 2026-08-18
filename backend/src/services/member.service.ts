import { MemberRepository } from '../repositories/member.repository'
import { MemberResponseDTO, CreateMemberDTO } from '../dtos/member.dto'
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

  async createMember(data: CreateMemberDTO): Promise<MemberResponseDTO> {
    // Validação de unicidade do nick
    const existing = await this.memberRepository.findByNick(data.nick)
    if (existing) {
      throw new AppError(`Já existe um membro cadastrado com o nick '${data.nick}'.`, 409)
    }

    const memberId = await this.memberRepository.create(data)
    const newMember = await this.memberRepository.findById(memberId)
    
    if (!newMember) {
      throw new AppError('Erro ao buscar membro criado.', 500)
    }

    return newMember
  }

  async deleteMember(id: number): Promise<void> {
    const deleted = await this.memberRepository.delete(id)
    if (!deleted) {
      throw new AppError(`Membro com ID ${id} não encontrado para exclusão.`, 404)
    }
  }
}
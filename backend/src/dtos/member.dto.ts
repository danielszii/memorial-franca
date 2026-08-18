export type MemberRank = 'Fundador' | 'Líder' | 'Gerente' | 'Membro'
export type MemberStatus = 'Ativo' | 'Inativo' | 'Veterano'

export interface MemberResponseDTO {
  id: number
  nick: string
  discord: string
  rank: MemberRank
  versions: string[]
  role: string
  avatar: string
  bio: string
  joined: string
  status: MemberStatus
}

export interface CreateMemberDTO {
  nick: string
  discord: string
  rank: MemberRank
  role: string
  avatar: string
  bio: string
  joined: string
  status: MemberStatus
  versions: string[]
}
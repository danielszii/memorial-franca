export type MemberRank = 'Fundador' | 'Líder' | 'Gerente' | 'Membro'
export type MemberStatus = 'Ativo' | 'Inativo' | 'Veterano'

export interface Member {
  id: number
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
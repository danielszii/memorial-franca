export type MemberRank = 'Fundador' | 'Líder' | 'Gerente' | 'Membro'
export type MemberStatus = 'Ativo' | 'Inativo' | 'Veterano'

export interface MemberSocials {
  instagram?: string
  twitch?: string
  youtube?: string
  tiktok?: string
  twitter?: string
}

export interface Member {
  id: number
  nick: string
  discord: string
  rank: string[] | string
  role: string
  avatar: string
  status?: string
  bio?: string
  versions?: string[]
  socials?: MemberSocials 
}
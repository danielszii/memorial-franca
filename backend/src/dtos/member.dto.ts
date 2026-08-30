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
  twitch?: string
  youtube?: string
  instagram?: string
  tiktok?: string
  kick?: string
  is_live?: boolean
  live_url?: string
}
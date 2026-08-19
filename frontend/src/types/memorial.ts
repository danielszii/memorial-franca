export type Rank = 'Fundador' | 'Líder' | 'Gerente' | 'Membro'

export interface Member {
  id: number
  nick: string
  discord: string
  rank: Rank[] | Rank
  versions: string[]
  role: string
  avatar: string
  bio: string
  joined: string
  status: 'Ativo' | 'Inativo' | 'Veterano'
}

export interface Era {
  version: string
  server: string
  period: string
  leader: string
  subs: string[]
  summary: string
  tag: string
  color: string
}
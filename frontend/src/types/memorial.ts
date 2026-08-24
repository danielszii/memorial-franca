import { MemberRank } from "./member"

export type Rank = 'Fundador' | 'Líder' | 'Gerente' | 'Membro'

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
  rank: string[] | string | Rank | Rank[]
  role: string
  avatar: string
  status?: string
  bio?: string
  versions?: string[]
  joined?: string
  socials?: MemberSocials
  instagram?: string
  twitch?: string
  youtube?: string
  tiktok?: string
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
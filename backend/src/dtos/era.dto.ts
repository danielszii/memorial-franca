export interface EraResponseDTO {
  version: string
  server: string
  period: string
  leader: string
  subs: string[]
  summary: string
  tag: string
  color: string
}

export interface CreateEraDTO {
  version: string
  server: string
  period: string
  leader: string
  subs: string[]
  summary: string
  tag: string
  color: string
}
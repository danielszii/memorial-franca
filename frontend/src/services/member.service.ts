import { api } from './api'
import { Member } from '../types/member'

export const memberService = {
  async getAll(): Promise<Member[]> {
    const { data } = await api.get<Member[]>('/members')
    return data
  },

  async getById(id: number): Promise<Member> {
    const { data } = await api.get<Member>(`/members/${id}`)
    return data
  },
}
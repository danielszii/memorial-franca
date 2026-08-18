import { api } from './api'
import { Era } from '../types/era'

export const eraService = {
  async getAll(): Promise<Era[]> {
    const { data } = await api.get<Era[]>('/eras')
    return data
  },

  async getByVersion(version: string): Promise<Era> {
    const { data } = await api.get<Era>(`/eras/${version}`)
    return data
  },
}
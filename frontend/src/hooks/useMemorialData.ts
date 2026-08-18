import { useState, useEffect } from 'react'
import { memberService } from '../services/member.service'
import { eraService } from '../services/era.service'
import { Member } from '../types/member'
import { Era } from '../types/era'

export function useMemorialData() {
  const [members, setMembers] = useState<Member[]>([])
  const [eras, setEras] = useState<Era[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const [membersData, erasData] = await Promise.all([
          memberService.getAll(),
          eraService.getAll(),
        ])
        setMembers(membersData)
        setEras(erasData)
      } catch (err: any) {
        console.error('Erro ao carregar dados do memorial:', err)
        setError(err.response?.data?.message || 'Falha ao sincronizar com o banco de dados.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return { members, eras, loading, error }
}
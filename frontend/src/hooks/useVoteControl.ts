import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

const STORAGE_DATE_KEY = 'franca_vote_date'
const STORAGE_VOTED_IDS_KEY = 'franca_voted_member_ids'
export const MAX_DAILY_VOTES = 5

export interface VoteResult {
  success: boolean
  newRespectCount?: number
  remainingVotes?: number
  message?: string
}

function getTodayString(): string {
  return new Date().toISOString().slice(0, 10) // YYYY-MM-DD
}

function loadLocalVotedIds(): number[] {
  try {
    const storedDate = localStorage.getItem(STORAGE_DATE_KEY)
    const today = getTodayString()

    // Se for um novo dia, limpa os votos anteriores
    if (storedDate !== today) {
      localStorage.setItem(STORAGE_DATE_KEY, today)
      localStorage.setItem(STORAGE_VOTED_IDS_KEY, JSON.stringify([]))
      return []
    }

    const raw = localStorage.getItem(STORAGE_VOTED_IDS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.map(Number).filter(n => !isNaN(n)) : []
  } catch (_) {
    return []
  }
}

export function useVoteControl() {
  const [votedMemberIds, setVotedMemberIds] = useState<number[]>(loadLocalVotedIds)
  const [isVoting, setIsVoting] = useState<boolean>(false)

  const syncState = useCallback(() => {
    const ids = loadLocalVotedIds()
    setVotedMemberIds(ids)
  }, [])

  useEffect(() => {
    syncState()
    window.addEventListener('storage', syncState)
    return () => window.removeEventListener('storage', syncState)
  }, [syncState])

  const registerLocalVote = useCallback((memberId: number) => {
    try {
      const today = getTodayString()
      const current = loadLocalVotedIds()
      if (!current.includes(memberId)) {
        const updated = [...current, memberId]
        localStorage.setItem(STORAGE_DATE_KEY, today)
        localStorage.setItem(STORAGE_VOTED_IDS_KEY, JSON.stringify(updated))
        setVotedMemberIds(updated)
      }
    } catch (_) {}
  }, [])

  const votesRemaining = Math.max(0, MAX_DAILY_VOTES - votedMemberIds.length)
  const canVoteMore = votesRemaining > 0

  const hasVotedInMember = useCallback(
    (memberId: number): boolean => {
      return votedMemberIds.includes(memberId)
    },
    [votedMemberIds]
  )

  const castVote = useCallback(
    async (memberId: number): Promise<VoteResult> => {
      if (isVoting) {
        return { success: false, message: 'Processando voto anterior...' }
      }

      // Validação: Não pode votar duas vezes no mesmo membro no mesmo dia
      if (hasVotedInMember(memberId)) {
        return {
          success: false,
          message: 'Você já votou neste integrante hoje! Escolha outro membro da França.',
        }
      }

      // Validação: Limite máximo de 5 votos por dia
      if (!canVoteMore) {
        return {
          success: false,
          message: 'Você já utilizou seus 5 votos no Francês da Galera hoje! Volte amanhã.',
        }
      }

      setIsVoting(true)
      const API_URL = import.meta.env.VITE_API_URL || 'https://memorial-franca.onrender.com'

      try {
        const response = await axios.post<{
          success: boolean
          newRespectCount: number
          remainingVotes: number
        }>(`${API_URL}/franca/members/${memberId}/respect`)

        if (response.data && response.data.success) {
          registerLocalVote(memberId)
          return {
            success: true,
            newRespectCount: response.data.newRespectCount,
            remainingVotes: response.data.remainingVotes,
          }
        }

        return {
          success: false,
          message: 'Não foi possível contabilizar o voto.',
        }
      } catch (err: any) {
        if (err.response?.status === 429) {
          registerLocalVote(memberId)
          return {
            success: false,
            message:
              err.response.data?.message ||
              'Você já atingiu o limite de votos ou já votou neste membro hoje.',
          }
        }

        return {
          success: false,
          message:
            err.response?.data?.message ||
            'Erro ao conectar com o servidor. Tente novamente mais tarde.',
        }
      } finally {
        setIsVoting(false)
      }
    },
    [canVoteMore, hasVotedInMember, isVoting, registerLocalVote]
  )

  return {
    votedMemberIds,
    votesRemaining,
    canVoteMore,
    isVoting,
    hasVotedInMember,
    castVote,
  }
}

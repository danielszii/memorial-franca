import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

const STORAGE_LAST_VOTE_TIME = 'franca_last_vote_timestamp'
const STORAGE_VOTED_MEMBER_ID = 'franca_voted_member_id'

export interface VoteResult {
  success: boolean
  newRespectCount?: number
  message?: string
}

function checkIfCanVoteToday(lastVoteTimestamp: string | null): boolean {
  if (!lastVoteTimestamp) return true
  const lastTime = Number(lastVoteTimestamp)
  if (isNaN(lastTime)) return true

  const lastDate = new Date(lastTime)
  const today = new Date()

  // Se a data for de um dia diferente, o torcedor pode votar novamente
  return lastDate.toDateString() !== today.toDateString()
}

export function useVoteControl() {
  const [canVoteToday, setCanVoteToday] = useState<boolean>(true)
  const [hasVotedMemberId, setHasVotedMemberId] = useState<number | null>(null)
  const [isVoting, setIsVoting] = useState<boolean>(false)

  // Sincroniza o estado a partir do localStorage
  const syncState = useCallback(() => {
    try {
      const storedTime = localStorage.getItem(STORAGE_LAST_VOTE_TIME)
      const storedMemberId = localStorage.getItem(STORAGE_VOTED_MEMBER_ID)

      const allowed = checkIfCanVoteToday(storedTime)
      setCanVoteToday(allowed)

      if (!allowed && storedMemberId) {
        setHasVotedMemberId(Number(storedMemberId))
      } else if (allowed) {
        setHasVotedMemberId(null)
      }
    } catch (_) {
      setCanVoteToday(true)
      setHasVotedMemberId(null)
    }
  }, [])

  useEffect(() => {
    syncState()

    // Ouve alterações no storage de outras abas
    window.addEventListener('storage', syncState)
    return () => window.removeEventListener('storage', syncState)
  }, [syncState])

  const registerLocalVote = useCallback((memberId: number) => {
    try {
      const now = Date.now().toString()
      localStorage.setItem(STORAGE_LAST_VOTE_TIME, now)
      localStorage.setItem(STORAGE_VOTED_MEMBER_ID, memberId.toString())
      setCanVoteToday(false)
      setHasVotedMemberId(memberId)
    } catch (_) {}
  }, [])

  const castVote = useCallback(
    async (memberId: number): Promise<VoteResult> => {
      if (isVoting) {
        return { success: false, message: 'Processando voto anterior...' }
      }

      // Validação local rápida
      if (!canVoteToday) {
        return {
          success: false,
          message: 'Você já votou no seu Craque da Galera hoje! Volte amanhã.',
        }
      }

      setIsVoting(true)
      const API_URL = import.meta.env.VITE_API_URL || 'https://memorial-franca.onrender.com'

      try {
        const response = await axios.post<{ success: boolean; newRespectCount: number }>(
          `${API_URL}/franca/members/${memberId}/respect`
        )

        if (response.data && response.data.success) {
          registerLocalVote(memberId)
          return {
            success: true,
            newRespectCount: response.data.newRespectCount,
          }
        }

        return {
          success: false,
          message: 'Não foi possível contabilizar o voto.',
        }
      } catch (err: any) {
        // Status 429: Já votou hoje (sincroniza localStorage por segurança)
        if (err.response?.status === 429) {
          registerLocalVote(memberId)
          return {
            success: false,
            message:
              err.response.data?.message ||
              'Você já votou no seu Craque da Galera hoje! Volte amanhã.',
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
    [canVoteToday, isVoting, registerLocalVote]
  )

  return {
    canVoteToday,
    hasVotedMemberId,
    isVoting,
    castVote,
    registerLocalVote,
  }
}

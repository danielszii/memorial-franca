import { Rank } from '../types/memorial'

export const rankColor: Record<Rank, string> = {
  Fundador: '#ffffff',
  Líder: '#ED2939',
  Gerente: '#002395',
  Membro: '#4a5568',
}

export const versionColors: Record<string, string> = {
  '1.0': '#002395',
  '2.0': '#ED2939',
  '3.0': '#ffffff',
  '4.0': '#002395',
  '5.0': '#ED2939',
  '6.0': '#ffffff',
}

export const navLinks: { label: string; id: string }[] = [
  { label: 'História', id: 'linha-do-tempo' },
  { label: 'Membros', id: 'membros' },
  { label: 'Títulos', id: 'conquistas' },
  { label: 'Em Breve', id: 'em-breve' },
]


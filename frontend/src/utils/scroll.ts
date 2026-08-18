export function scrollTo(id: string): void {
  const el = document.getElementById(id)
  if (!el) return
  const offset = 70
  const top = el.getBoundingClientRect().top + window.scrollY - offset
  window.scrollTo({ top, behavior: 'smooth' })
}

// Exporta também com o nome scrollToSection para compatibilidade
export const scrollToSection = scrollTo
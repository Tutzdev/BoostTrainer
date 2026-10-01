import { useCallback, useEffect, useState } from 'react'

const CHAVE = 'boost-sidebar-expandida'
const BREAKPOINT_TABLET = 768
const BREAKPOINT_DESKTOP = 960

function lerPreferencia(): boolean | null {
  try {
    const valor = localStorage.getItem(CHAVE)
    if (valor === 'true') return true
    if (valor === 'false') return false
  } catch {
    // localStorage indisponível (navegação privada, storage cheio, etc.)
  }
  return null
}

function salvarPreferencia(expandida: boolean): void {
  try {
    localStorage.setItem(CHAVE, String(expandida))
  } catch {
    // falha silenciosa
  }
}

function padraoPelaLargura(): boolean {
  if (typeof window === 'undefined') return true
  if (window.innerWidth < BREAKPOINT_TABLET) return true
  if (window.innerWidth < BREAKPOINT_DESKTOP) return false
  return true
}

export function useSidebarState() {
  const [expandida, setExpandida] = useState(() => lerPreferencia() ?? padraoPelaLargura())

  const alternar = useCallback(() => {
    setExpandida((anterior) => {
      const nova = !anterior
      salvarPreferencia(nova)
      return nova
    })
  }, [])

  useEffect(() => {
    function aoTeclar(evento: KeyboardEvent) {
      if ((evento.ctrlKey || evento.metaKey) && evento.key === 'b') {
        evento.preventDefault()
        alternar()
      }
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [alternar])

  return { expandida, alternar } as const
}

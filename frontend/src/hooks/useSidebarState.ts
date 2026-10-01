import { useCallback, useEffect, useState } from 'react'

const CHAVE = 'boost-sidebar-expandida'
/** Mesmo ponto em que a barra lateral aparece em Casca.module.css (60rem). */
const MIDIA_DESKTOP = '(min-width: 60rem)'

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

function estaDigitando(alvo: EventTarget | null): boolean {
  return (
    alvo instanceof HTMLElement &&
    (alvo.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(alvo.tagName))
  )
}

export function useSidebarState() {
  const [expandida, setExpandida] = useState(() => lerPreferencia() ?? true)

  const alternar = useCallback(() => {
    setExpandida((anterior) => {
      const nova = !anterior
      salvarPreferencia(nova)
      return nova
    })
  }, [])

  useEffect(() => {
    function aoTeclar(evento: KeyboardEvent) {
      if (!(evento.ctrlKey || evento.metaKey) || evento.key.toLowerCase() !== 'b') return
      // No celular a barra não existe, e num campo Ctrl+B pode ter outro uso.
      if (!window.matchMedia(MIDIA_DESKTOP).matches || estaDigitando(evento.target)) return
      evento.preventDefault()
      alternar()
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [alternar])

  return { expandida, alternar } as const
}

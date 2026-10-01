import { useCallback, useState, type KeyboardEvent, type SyntheticEvent } from 'react'

/** Na metade de baixo da tela a dica cresce para cima, para não passar da borda. */
type Dica =
  | { texto: string; esquerda: number; centro: number }
  | { texto: string; esquerda: number; base: number }

const DISTANCIA_DO_ALVO = 12

/**
 * Uma única dica para todos os elementos com `data-dica` dentro do container.
 * Fica em `position: fixed` porque a barra lateral e a lista de treinos
 * cortam o que passa da borda (`overflow`), e a dica precisa sair para a direita.
 */
export function useDicaFlutuante(ativa: boolean) {
  const [dica, setDica] = useState<Dica | null>(null)

  const mostrar = useCallback(
    (evento: SyntheticEvent) => {
      if (!ativa || !(evento.target instanceof Element)) return
      const origem = evento.target.closest<HTMLElement>('[data-dica]')
      const texto = origem?.dataset.dica
      if (origem == null || texto === undefined) {
        setDica(null)
        return
      }
      const caixa = origem.getBoundingClientRect()
      const esquerda = caixa.right + DISTANCIA_DO_ALVO
      setDica(
        caixa.top > window.innerHeight / 2
          ? { texto, esquerda, base: window.innerHeight - caixa.bottom }
          : { texto, esquerda, centro: caixa.top + caixa.height / 2 },
      )
    },
    [ativa],
  )

  const esconder = useCallback(() => setDica(null), [])

  const gatilhos = {
    onPointerOver: mostrar,
    onFocus: mostrar,
    onPointerLeave: esconder,
    onBlur: esconder,
    onScrollCapture: esconder,
    onKeyDown: (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') esconder()
    },
  }

  return { dica: ativa ? dica : null, gatilhos } as const
}

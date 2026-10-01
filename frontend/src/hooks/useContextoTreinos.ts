import { createContext, useContext } from 'react'
import type { DiaTreinoResponse } from '../api/tipos.ts'
import type { Recurso } from './useRecurso.ts'

/**
 * A lista da semana é compartilhada entre a barra lateral e a visão geral.
 * Guardá-la em um só lugar evita duas requisições iguais e mantém a
 * navegação coerente com o que a tela mostra.
 */
export const ContextoDeTreinos = createContext<Recurso<DiaTreinoResponse[]> | null>(null)

export function useListaDeTreinos(): Recurso<DiaTreinoResponse[]> {
  const recurso = useContext(ContextoDeTreinos)
  if (recurso === null) {
    throw new Error('useListaDeTreinos precisa estar dentro de <ProvedorDeTreinos>.')
  }
  return recurso
}

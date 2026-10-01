import { useCallback } from 'react'
import { buscarDiaTreino, listarDiasTreino } from '../api/treinos.ts'
import type { DiaTreinoResponse } from '../api/tipos.ts'
import { useRecurso, type Recurso } from './useRecurso.ts'

/** A semana inteira, para a visão geral. */
export function useTreinos(): Recurso<DiaTreinoResponse[]> {
  const buscar = useCallback((sinal: AbortSignal) => listarDiasTreino(sinal), [])
  return useRecurso(buscar, 'dias-treino')
}

/**
 * Um treino com exercícios e séries.
 * Como a API não tem GET de exercício nem de série, este é o único jeito de
 * voltar ao estado real depois de mutar qualquer nível da hierarquia.
 */
export function useTreino(id: number): Recurso<DiaTreinoResponse> {
  const buscar = useCallback((sinal: AbortSignal) => buscarDiaTreino(id, sinal), [id])
  return useRecurso(buscar, `dia-treino/${id}`)
}

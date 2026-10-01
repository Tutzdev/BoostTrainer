import { createContext, useContext } from 'react'
import type { DiaSemana } from '../api/tipos.ts'

/**
 * Criar treino é alcançável de qualquer tela (barra lateral, estado vazio,
 * grade da semana), então o formulário vive na casca e as telas só pedem
 * para abri-lo.
 */
export interface CriacaoDeTreino {
  /** Um dia já escolhido chega preenchido no formulário. */
  abrir: (dia?: DiaSemana) => void
}

export const ContextoDeCriacao = createContext<CriacaoDeTreino | null>(null)

export function useCriacaoDeTreino(): CriacaoDeTreino {
  const controle = useContext(ContextoDeCriacao)
  if (controle === null) {
    throw new Error('useCriacaoDeTreino precisa estar dentro de <Casca>.')
  }
  return controle
}

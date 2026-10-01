import { createContext, useContext } from 'react'

export type TomDoAviso = 'sucesso' | 'erro'

export interface Aviso {
  id: number
  mensagem: string
  tom: TomDoAviso
}

export interface ControleDeAvisos {
  avisar: (mensagem: string, tom?: TomDoAviso) => void
}

export const ContextoDeAvisos = createContext<ControleDeAvisos | null>(null)

/** Confirmação curta de uma ação que já terminou. */
export function useAvisos(): ControleDeAvisos {
  const controle = useContext(ContextoDeAvisos)
  if (controle === null) {
    throw new Error('useAvisos precisa estar dentro de <ProvedorDeAvisos>.')
  }
  return controle
}

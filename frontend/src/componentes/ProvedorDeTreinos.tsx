import type { ReactNode } from 'react'
import { ContextoDeTreinos } from '../hooks/useContextoTreinos.ts'
import { useTreinos } from '../hooks/useTreinos.ts'

export function ProvedorDeTreinos({ children }: { children: ReactNode }) {
  const recurso = useTreinos()
  return <ContextoDeTreinos.Provider value={recurso}>{children}</ContextoDeTreinos.Provider>
}

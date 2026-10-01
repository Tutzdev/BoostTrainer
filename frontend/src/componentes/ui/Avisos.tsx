import { CircleCheck, CircleX, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  ContextoDeAvisos,
  type Aviso,
  type ControleDeAvisos,
  type TomDoAviso,
} from '../../hooks/useAvisos.ts'
import { Botao } from './Botao.tsx'
import estilos from './Avisos.module.css'

const DURACAO = 5000

/**
 * Confirmações curtas depois de criar, salvar ou excluir.
 * Uma única região aria-live polite: o leitor de tela anuncia o texto novo
 * sem repetir o que já estava na tela.
 */
export function ProvedorDeAvisos({ children }: { children: ReactNode }) {
  const [avisos, setAvisos] = useState<Aviso[]>([])
  const proximoId = useRef(1)
  const temporizadores = useRef(new Map<number, ReturnType<typeof setTimeout>>())

  const descartar = useCallback((id: number) => {
    const temporizador = temporizadores.current.get(id)
    if (temporizador !== undefined) {
      clearTimeout(temporizador)
      temporizadores.current.delete(id)
    }
    setAvisos((atuais) => atuais.filter((aviso) => aviso.id !== id))
  }, [])

  const avisar = useCallback(
    (mensagem: string, tom: TomDoAviso = 'sucesso') => {
      const id = proximoId.current
      proximoId.current += 1

      setAvisos((atuais) => [...atuais.slice(-2), { id, mensagem, tom }])
      temporizadores.current.set(
        id,
        setTimeout(() => descartar(id), DURACAO),
      )
    },
    [descartar],
  )

  // Nenhum temporizador sobrevive à desmontagem do provedor.
  useEffect(() => {
    const pendentes = temporizadores.current
    return () => {
      for (const temporizador of pendentes.values()) clearTimeout(temporizador)
      pendentes.clear()
    }
  }, [])

  const controle = useMemo<ControleDeAvisos>(() => ({ avisar }), [avisar])

  return (
    <ContextoDeAvisos.Provider value={controle}>
      {children}
      <div className={estilos.regiao} role="status" aria-live="polite">
        {avisos.map((aviso) => (
          <div key={aviso.id} className={`${estilos.aviso} ${estilos[aviso.tom]}`}>
            {aviso.tom === 'sucesso' ? (
              <CircleCheck className={estilos.icone} size={18} aria-hidden="true" />
            ) : (
              <CircleX className={estilos.icone} size={18} aria-hidden="true" />
            )}
            <span className={estilos.mensagem}>{aviso.mensagem}</span>
            <Botao
              variante="fantasma"
              pequeno
              soIcone
              aria-label="Descartar aviso"
              onClick={() => descartar(aviso.id)}
            >
              <X size={14} aria-hidden="true" />
            </Botao>
          </div>
        ))}
      </div>
    </ContextoDeAvisos.Provider>
  )
}

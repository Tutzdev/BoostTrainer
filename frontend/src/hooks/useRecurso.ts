import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Estados possíveis de uma leitura da API. A união impede combinações
 * inválidas, como erro e dados ao mesmo tempo.
 */
export type EstadoDoRecurso<T> =
  | { situacao: 'carregando' }
  | { situacao: 'pronto'; dados: T }
  | { situacao: 'erro'; erro: unknown }

function ehAbort(erro: unknown): boolean {
  return erro instanceof DOMException && erro.name === 'AbortError'
}

export interface Recurso<T> {
  estado: EstadoDoRecurso<T>
  /** Verdadeiro durante uma releitura que já tem dados na tela. */
  recarregando: boolean
  recarregar: () => Promise<void>
  /** Substitui os dados locais sem ir à rede (resposta de uma mutação). */
  substituir: (dados: T) => void
}

/** O resultado anda junto da chave que o produziu. */
interface Registro<T> {
  chave: string
  estado: EstadoDoRecurso<T>
}

/**
 * Leitura com cancelamento. Cada busca aborta a anterior, então uma resposta
 * atrasada nunca sobrescreve uma mais recente, e nada escreve estado depois
 * de o componente sair da tela.
 */
export function useRecurso<T>(
  buscar: (sinal: AbortSignal) => Promise<T>,
  /** Muda quando o recurso passa a ser outro, e aí a busca é refeita. */
  chave: string,
): Recurso<T> {
  const [registro, setRegistro] = useState<Registro<T>>({
    chave,
    estado: { situacao: 'carregando' },
  })
  const [recarregando, setRecarregando] = useState(false)

  const controlador = useRef<AbortController | null>(null)
  // A função de busca muda de identidade a cada render de quem chama;
  // guardá-la em ref evita refazer a requisição sem necessidade. Quem decide
  // se a busca é refeita é a chave.
  const buscarRef = useRef(buscar)

  useEffect(() => {
    buscarRef.current = buscar
  }, [buscar])

  /**
   * O estado é derivado, não copiado por efeito: assim que a chave muda, a
   * tela já aparece carregando, sem um render intermediário com os dados do
   * recurso anterior.
   */
  const estado: EstadoDoRecurso<T> =
    registro.chave === chave ? registro.estado : { situacao: 'carregando' }

  /**
   * Não escreve estado antes do primeiro await, de propósito: assim o efeito
   * que a dispara não encadeia um render síncrono. Quem sinaliza "recarregando"
   * é o próprio evento, em `recarregar`.
   */
  const executar = useCallback(
    async (chaveAtual: string) => {
      controlador.current?.abort()
      const atual = new AbortController()
      controlador.current = atual

      try {
        const dados = await buscarRef.current(atual.signal)
        if (atual.signal.aborted) return
        setRegistro({ chave: chaveAtual, estado: { situacao: 'pronto', dados } })
      } catch (erro) {
        if (ehAbort(erro) || atual.signal.aborted) return
        setRegistro({ chave: chaveAtual, estado: { situacao: 'erro', erro } })
      } finally {
        if (controlador.current === atual) setRecarregando(false)
      }
    },
    [],
  )

  useEffect(() => {
    // A promessa resolve depois do efeito, então nenhum setState acontece
    // de forma síncrona aqui.
    void executar(chave)
    return () => controlador.current?.abort()
  }, [executar, chave])

  const recarregar = useCallback(() => {
    setRecarregando(true)
    return executar(chave)
  }, [executar, chave])

  const substituir = useCallback(
    (dados: T) => {
      setRegistro({ chave, estado: { situacao: 'pronto', dados } })
    },
    [chave],
  )

  return { estado, recarregando, recarregar, substituir }
}

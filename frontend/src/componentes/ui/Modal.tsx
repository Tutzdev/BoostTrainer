import { X } from 'lucide-react'
import { useEffect, useId, useRef, type ReactNode } from 'react'
import { Botao } from './Botao.tsx'
import estilos from './Modal.module.css'

interface ModalProps {
  aberto: boolean
  titulo: string
  descricao?: string
  /** Chamado pelo Esc, pelo clique no fundo e pelo botão de fechar. */
  aoFechar: () => void
  /**
   * Durante um envio em curso, o Esc e o clique no fundo são ignorados. Sem
   * isso o <dialog> fecharia sozinho e o efeito o reabriria, piscando.
   */
  travado?: boolean
  children: ReactNode
}

export function Modal({
  aberto,
  titulo,
  descricao,
  aoFechar,
  travado = false,
  children,
}: ModalProps) {
  const referencia = useRef<HTMLDialogElement>(null)
  const idTitulo = useId()
  const idDescricao = useId()

  useEffect(() => {
    const dialogo = referencia.current
    if (dialogo === null) return

    if (aberto && !dialogo.open) {
      dialogo.showModal()
    } else if (!aberto && dialogo.open) {
      dialogo.close()
    }
  }, [aberto])

  // O <dialog> rola por conta própria; travar o body evita a página de trás
  // deslizar no celular enquanto a folha está aberta.
  useEffect(() => {
    if (!aberto) return
    const anterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = anterior
    }
  }, [aberto])

  return (
    <dialog
      ref={referencia}
      className={estilos.dialogo}
      aria-labelledby={idTitulo}
      aria-describedby={descricao === undefined ? undefined : idDescricao}
      // O cancel precede o close do Esc: barrá-lo evita o fechamento.
      onCancel={(evento) => {
        if (travado) evento.preventDefault()
      }}
      // Dispara no Esc e no close() nativo, mantendo o estado em sincronia.
      onClose={aoFechar}
      onClick={(evento) => {
        if (!travado && evento.target === referencia.current) aoFechar()
      }}
    >
      <div className={estilos.cabecalho}>
        <div>
          <h2 className={estilos.titulo} id={idTitulo}>
            {titulo}
          </h2>
          {descricao === undefined ? null : (
            <p className={estilos.descricao} id={idDescricao}>
              {descricao}
            </p>
          )}
        </div>
        <Botao
          variante="fantasma"
          pequeno
          soIcone
          aria-label="Fechar"
          disabled={travado}
          onClick={aoFechar}
        >
          <X size={18} aria-hidden="true" />
        </Botao>
      </div>
      <div className={estilos.corpo}>{children}</div>
    </dialog>
  )
}

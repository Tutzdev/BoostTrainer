import { TriangleAlert } from 'lucide-react'
import type { ReactNode } from 'react'
import { Botao } from './Botao.tsx'
import { Modal } from './Modal.tsx'
import estilos from './DialogoConfirmacao.module.css'

interface DialogoConfirmacaoProps {
  aberto: boolean
  titulo: string
  /** O que será perdido, em números reais, antes de a pessoa decidir. */
  consequencia: ReactNode
  rotuloConfirmar: string
  confirmando: boolean
  erro?: string | undefined
  aoConfirmar: () => void
  aoCancelar: () => void
}

export function DialogoConfirmacao({
  aberto,
  titulo,
  consequencia,
  rotuloConfirmar,
  confirmando,
  erro,
  aoConfirmar,
  aoCancelar,
}: DialogoConfirmacaoProps) {
  return (
    <Modal aberto={aberto} titulo={titulo} travado={confirmando} aoFechar={aoCancelar}>
      <div className={estilos.consequencia}>
        <TriangleAlert className={estilos.icone} size={18} aria-hidden="true" />
        <div>{consequencia}</div>
      </div>

      {erro === undefined ? null : (
        <p className={estilos.falha} role="alert">
          {erro}
        </p>
      )}

      <div className={estilos.acoes}>
        <Botao variante="secundaria" onClick={aoCancelar} disabled={confirmando}>
          Cancelar
        </Botao>
        <Botao variante="perigo" onClick={aoConfirmar} carregando={confirmando}>
          {confirmando ? 'Excluindo…' : rotuloConfirmar}
        </Botao>
      </div>
    </Modal>
  )
}

/** Lista das consequências, usada pelos três níveis da hierarquia. */
export function ListaDeConsequencias({ itens }: { itens: readonly string[] }) {
  if (itens.length === 0) return null
  return (
    <ul className={estilos.lista}>
      {itens.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

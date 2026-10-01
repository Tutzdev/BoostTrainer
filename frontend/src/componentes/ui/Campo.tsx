import { CircleAlert } from 'lucide-react'
import {
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react'
import estilos from './Campo.module.css'

interface BaseProps {
  rotulo: string
  /** Mensagem do servidor ou da validação local, exibida junto do campo. */
  erro?: string | undefined
  dica?: string | undefined
  opcional?: boolean
}

/** Rótulo, dica e erro ligados ao controle por id, em um só lugar. */
function Envolvente({
  rotulo,
  erro,
  dica,
  opcional = false,
  idControle,
  idDica,
  idErro,
  children,
}: BaseProps & {
  idControle: string
  idDica: string
  idErro: string
  children: ReactNode
}) {
  return (
    <div className={estilos.campo}>
      <label className={estilos.rotulo} htmlFor={idControle}>
        {rotulo}
        {opcional ? <span className={estilos.opcional}> (opcional)</span> : null}
      </label>
      {children}
      {dica !== undefined && erro === undefined ? (
        <p className={estilos.dica} id={idDica}>
          {dica}
        </p>
      ) : null}
      {erro !== undefined ? (
        <p className={estilos.erro} id={idErro}>
          <CircleAlert className={estilos.iconeErro} size={14} aria-hidden="true" />
          {erro}
        </p>
      ) : null}
    </div>
  )
}

function descricao(erro: string | undefined, dica: string | undefined, idDica: string, idErro: string) {
  if (erro !== undefined) return idErro
  if (dica !== undefined) return idDica
  return undefined
}

type CampoTextoProps = BaseProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'id'> & { numerico?: boolean }

export function CampoTexto({
  rotulo,
  erro,
  dica,
  opcional = false,
  numerico = false,
  ...resto
}: CampoTextoProps) {
  const base = useId()
  const idControle = `${base}-controle`
  const idDica = `${base}-dica`
  const idErro = `${base}-erro`

  return (
    <Envolvente
      rotulo={rotulo}
      erro={erro}
      dica={dica}
      opcional={opcional}
      idControle={idControle}
      idDica={idDica}
      idErro={idErro}
    >
      <input
        id={idControle}
        className={[estilos.controle, numerico ? estilos.numero : '', erro !== undefined ? estilos.invalido : '']
          .filter(Boolean)
          .join(' ')}
        aria-invalid={erro !== undefined || undefined}
        aria-describedby={descricao(erro, dica, idDica, idErro)}
        {...resto}
      />
    </Envolvente>
  )
}

type CampoSelecaoProps = BaseProps &
  Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className' | 'id'> & { children: ReactNode }

export function CampoSelecao({ rotulo, erro, dica, children, ...resto }: CampoSelecaoProps) {
  const base = useId()
  const idControle = `${base}-controle`
  const idDica = `${base}-dica`
  const idErro = `${base}-erro`

  return (
    <Envolvente
      rotulo={rotulo}
      erro={erro}
      dica={dica}
      idControle={idControle}
      idDica={idDica}
      idErro={idErro}
    >
      <select
        id={idControle}
        className={[estilos.controle, estilos.selecao, erro !== undefined ? estilos.invalido : '']
          .filter(Boolean)
          .join(' ')}
        aria-invalid={erro !== undefined || undefined}
        aria-describedby={descricao(erro, dica, idDica, idErro)}
        {...resto}
      >
        {children}
      </select>
    </Envolvente>
  )
}

type CampoLongoProps = BaseProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className' | 'id'>

export function CampoLongo({ rotulo, erro, dica, opcional = false, ...resto }: CampoLongoProps) {
  const base = useId()
  const idControle = `${base}-controle`
  const idDica = `${base}-dica`
  const idErro = `${base}-erro`

  return (
    <Envolvente
      rotulo={rotulo}
      erro={erro}
      dica={dica}
      opcional={opcional}
      idControle={idControle}
      idDica={idDica}
      idErro={idErro}
    >
      <textarea
        id={idControle}
        className={[estilos.controle, erro !== undefined ? estilos.invalido : '']
          .filter(Boolean)
          .join(' ')}
        rows={2}
        style={{ resize: 'vertical', minHeight: '4.5rem' }}
        aria-invalid={erro !== undefined || undefined}
        aria-describedby={descricao(erro, dica, idDica, idErro)}
        {...resto}
      />
    </Envolvente>
  )
}

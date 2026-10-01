import { CircleAlert } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { camposInvalidos, mensagemDoErro } from '../../api/erros.ts'
import type { ExercicioRequest } from '../../api/tipos.ts'
import { Botao } from '../ui/Botao.tsx'
import { CampoLongo, CampoTexto } from '../ui/Campo.tsx'
import estilos from './Formularios.module.css'

interface FormularioExercicioProps {
  inicial?: ExercicioRequest
  rotuloEnviar: string
  aoEnviar: (dados: ExercicioRequest) => Promise<void>
  aoCancelar: () => void
}

export function FormularioExercicio({
  inicial,
  rotuloEnviar,
  aoEnviar,
  aoCancelar,
}: FormularioExercicioProps) {
  const [nome, setNome] = useState(inicial?.nome ?? '')
  const [observacao, setObservacao] = useState(inicial?.observacao ?? '')
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<unknown>(null)
  const [erroLocal, setErroLocal] = useState<string>()

  const doServidor = camposInvalidos(erro)
  const falhaGeral =
    erro !== null && Object.keys(doServidor).length === 0 ? mensagemDoErro(erro) : undefined

  async function enviar(evento: FormEvent) {
    evento.preventDefault()
    const nomeLimpo = nome.trim()
    const observacaoLimpa = observacao.trim()

    if (nomeLimpo === '') {
      setErroLocal('O nome do exercício é obrigatório.')
      return
    }

    setErroLocal(undefined)
    setErro(null)
    setEnviando(true)
    try {
      // Observação vazia vai como null, não como string vazia.
      await aoEnviar({ nome: nomeLimpo, observacao: observacaoLimpa === '' ? null : observacaoLimpa })
    } catch (causa) {
      setErro(causa)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form className={estilos.formulario} onSubmit={enviar} noValidate>
      {falhaGeral === undefined ? null : (
        <p className={estilos.falha} role="alert">
          <CircleAlert className={estilos.iconeFalha} size={16} aria-hidden="true" />
          {falhaGeral}
        </p>
      )}

      <CampoTexto
        rotulo="Nome do exercício"
        value={nome}
        autoFocus
        autoComplete="off"
        maxLength={120}
        erro={erroLocal ?? doServidor['nome']}
        dica="Por exemplo: Supino reto com barra, Puxada frontal, Agachamento livre."
        onChange={(evento) => {
          setNome(evento.target.value)
          if (erroLocal !== undefined) setErroLocal(undefined)
        }}
      />

      <CampoLongo
        rotulo="Observação"
        value={observacao}
        opcional
        maxLength={500}
        erro={doServidor['observacao']}
        dica="Execução, ajuste do aparelho, cadência, descanso entre séries."
        onChange={(evento) => setObservacao(evento.target.value)}
      />

      <div className={estilos.acoes}>
        <Botao variante="secundaria" onClick={aoCancelar} disabled={enviando}>
          Cancelar
        </Botao>
        <Botao type="submit" variante="primaria" carregando={enviando}>
          {enviando ? 'Salvando…' : rotuloEnviar}
        </Botao>
      </div>
    </form>
  )
}

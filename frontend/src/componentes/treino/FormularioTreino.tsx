import { CircleAlert } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { DIAS_SEMANA, type DiaSemana, type DiaTreinoRequest } from '../../api/tipos.ts'
import { camposInvalidos, mensagemDoErro } from '../../api/erros.ts'
import { rotuloDoDia } from '../../dominio/diaSemana.ts'
import { Botao } from '../ui/Botao.tsx'
import { CampoSelecao, CampoTexto } from '../ui/Campo.tsx'
import estilos from './Formularios.module.css'

interface FormularioTreinoProps {
  inicial?: DiaTreinoRequest
  rotuloEnviar: string
  aoEnviar: (dados: DiaTreinoRequest) => Promise<void>
  aoCancelar: () => void
}

export function FormularioTreino({
  inicial,
  rotuloEnviar,
  aoEnviar,
  aoCancelar,
}: FormularioTreinoProps) {
  const [dia, setDia] = useState<DiaSemana>(inicial?.dia ?? 'SEGUNDA')
  const [nome, setNome] = useState(inicial?.nome ?? '')
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<unknown>(null)
  // Validação local para o caso óbvio; a do servidor continua valendo.
  const [erroLocal, setErroLocal] = useState<string>()

  const doServidor = camposInvalidos(erro)
  const erroNome = erroLocal ?? doServidor['nome']
  const falhaGeral =
    erro !== null && Object.keys(doServidor).length === 0 ? mensagemDoErro(erro) : undefined

  async function enviar(evento: FormEvent) {
    evento.preventDefault()
    const nomeLimpo = nome.trim()

    if (nomeLimpo === '') {
      setErroLocal('O nome do treino é obrigatório.')
      return
    }

    setErroLocal(undefined)
    setErro(null)
    setEnviando(true)
    try {
      await aoEnviar({ dia, nome: nomeLimpo })
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

      <div className={`${estilos.linha} ${estilos.linhaDiaNome}`}>
        <CampoSelecao
          rotulo="Dia da semana"
          value={dia}
          erro={doServidor['dia']}
          onChange={(evento) => setDia(evento.target.value as DiaSemana)}
        >
          {DIAS_SEMANA.map((valor) => (
            <option key={valor} value={valor}>
              {rotuloDoDia(valor)}
            </option>
          ))}
        </CampoSelecao>

        <CampoTexto
          rotulo="Nome do treino"
          value={nome}
          erro={erroNome}
          dica="Como você chama esse treino: Peito e tríceps, Pernas, Costas e bíceps."
          maxLength={120}
          autoComplete="off"
          onChange={(evento) => {
            setNome(evento.target.value)
            if (erroLocal !== undefined) setErroLocal(undefined)
          }}
        />
      </div>

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

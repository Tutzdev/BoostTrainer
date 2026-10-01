import { useState, type FormEvent } from 'react'
import { camposInvalidos, mensagemDoErro } from '../../api/erros.ts'
import { cargaParaCampo, lerCarga, lerRepeticoes } from '../../dominio/numeros.ts'
import { Botao } from '../ui/Botao.tsx'
import { CampoTexto } from '../ui/Campo.tsx'
import estilos from './Series.module.css'

export interface DadosDaSerie {
  repeticoes: number
  carga: number | null
}

interface FormularioSerieProps {
  inicial?: DadosDaSerie
  rotuloEnviar: string
  aoEnviar: (dados: DadosDaSerie) => Promise<void>
  aoCancelar: () => void
}

/**
 * Repetições e carga, direto na lista do exercício.
 * O número da série não aparece: na criação quem define é o backend, e na
 * edição ele é preservado — reordenar à mão só criaria números repetidos.
 */
export function FormularioSerie({
  inicial,
  rotuloEnviar,
  aoEnviar,
  aoCancelar,
}: FormularioSerieProps) {
  const [repeticoes, setRepeticoes] = useState(
    inicial === undefined ? '' : String(inicial.repeticoes),
  )
  const [carga, setCarga] = useState(inicial === undefined ? '' : cargaParaCampo(inicial.carga))
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<unknown>(null)
  const [erroRepeticoes, setErroRepeticoes] = useState<string>()
  const [erroCarga, setErroCarga] = useState<string>()

  const doServidor = camposInvalidos(erro)
  const falhaGeral =
    erro !== null && Object.keys(doServidor).length === 0 ? mensagemDoErro(erro) : undefined

  async function enviar(evento: FormEvent) {
    evento.preventDefault()

    const repeticoesLidas = lerRepeticoes(repeticoes)
    const cargaLida = lerCarga(carga)

    setErroRepeticoes(repeticoesLidas.ok ? undefined : repeticoesLidas.erro)
    setErroCarga(cargaLida.ok ? undefined : cargaLida.erro)
    if (!repeticoesLidas.ok || !cargaLida.ok) return

    setErro(null)
    setEnviando(true)
    try {
      await aoEnviar({ repeticoes: repeticoesLidas.valor, carga: cargaLida.valor })
    } catch (causa) {
      setErro(causa)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form className={estilos.formulario} onSubmit={enviar} noValidate>
      <div className={estilos.camposFormulario}>
        <CampoTexto
          rotulo="Repetições"
          value={repeticoes}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          numerico
          autoFocus
          erro={erroRepeticoes ?? doServidor['repeticoes']}
          onChange={(evento) => {
            setRepeticoes(evento.target.value)
            setErroRepeticoes(undefined)
          }}
        />
        <CampoTexto
          rotulo="Carga (kg)"
          value={carga}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          numerico
          opcional
          dica="Deixe vazio para peso do corpo."
          erro={erroCarga ?? doServidor['carga']}
          onChange={(evento) => {
            setCarga(evento.target.value)
            setErroCarga(undefined)
          }}
        />
      </div>

      {falhaGeral === undefined ? null : (
        <p className={estilos.falhaFormulario} role="alert">
          {falhaGeral}
        </p>
      )}

      <div className={estilos.acoesFormulario}>
        <Botao variante="fantasma" pequeno onClick={aoCancelar} disabled={enviando}>
          Cancelar
        </Botao>
        <Botao type="submit" variante="primaria" pequeno carregando={enviando}>
          {enviando ? 'Salvando…' : rotuloEnviar}
        </Botao>
      </div>
    </form>
  )
}

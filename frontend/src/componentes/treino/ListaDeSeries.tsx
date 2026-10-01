import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { mensagemDoErro } from '../../api/erros.ts'
import type { ExercicioResponse, SerieResponse } from '../../api/tipos.ts'
import { atualizarSerie, criarSerie, excluirSerie } from '../../api/treinos.ts'
import { formatarCarga, formatarInteiro, totaisDoExercicio } from '../../dominio/metricas.ts'
import { useAvisos } from '../../hooks/useAvisos.ts'
import { Botao } from '../ui/Botao.tsx'
import { FormularioSerie, type DadosDaSerie } from './FormularioSerie.tsx'
import estilos from './Series.module.css'

interface ListaDeSeriesProps {
  exercicio: ExercicioResponse
  /** Recarrega o treino inteiro: a API não tem GET de série. */
  aoMudar: () => Promise<void>
}

type Edicao =
  | { tipo: 'nenhuma' }
  | { tipo: 'adicionando' }
  | { tipo: 'editando'; serieId: number }
  | { tipo: 'excluindo'; serieId: number }

export function ListaDeSeries({ exercicio, aoMudar }: ListaDeSeriesProps) {
  const { avisar } = useAvisos()
  const [edicao, setEdicao] = useState<Edicao>({ tipo: 'nenhuma' })
  const [excluindo, setExcluindo] = useState(false)

  const totais = totaisDoExercicio(exercicio)
  const ultima = exercicio.series.at(-1)

  async function adicionar(dados: DadosDaSerie) {
    await criarSerie(exercicio.id, dados)
    setEdicao({ tipo: 'nenhuma' })
    avisar(`Série adicionada em ${exercicio.nome}.`)
    await aoMudar()
  }

  async function salvarEdicao(serie: SerieResponse, dados: DadosDaSerie) {
    // O número é preservado: quem o define é o backend.
    await atualizarSerie(serie.id, { numero: serie.numero, ...dados })
    setEdicao({ tipo: 'nenhuma' })
    avisar(`Série ${serie.numero} atualizada.`)
    await aoMudar()
  }

  async function confirmarExclusao(serie: SerieResponse) {
    setExcluindo(true)
    try {
      await excluirSerie(serie.id)
      avisar(`Série ${serie.numero} excluída.`)
      setEdicao({ tipo: 'nenhuma' })
      await aoMudar()
    } catch (causa) {
      avisar(mensagemDoErro(causa), 'erro')
      setEdicao({ tipo: 'nenhuma' })
    } finally {
      setExcluindo(false)
    }
  }

  return (
    <>
      {exercicio.series.length === 0 && edicao.tipo !== 'adicionando' ? (
        <p className={estilos.semSeries}>
          Nenhuma série ainda. Adicione a primeira com as repetições e a carga.
        </p>
      ) : null}

      <ul className={estilos.lista}>
        {exercicio.series.map((serie) => {
          if (edicao.tipo === 'editando' && edicao.serieId === serie.id) {
            return (
              <li key={serie.id}>
                <FormularioSerie
                  inicial={{ repeticoes: serie.repeticoes, carga: serie.carga }}
                  rotuloEnviar="Salvar série"
                  aoEnviar={(dados) => salvarEdicao(serie, dados)}
                  aoCancelar={() => setEdicao({ tipo: 'nenhuma' })}
                />
              </li>
            )
          }

          const naExclusao = edicao.tipo === 'excluindo' && edicao.serieId === serie.id

          return (
            <li key={serie.id} className={`${estilos.linha} ${naExclusao ? estilos.saindo : ''}`}>
              <span className={estilos.numero}>
                <span className="apenasLeitorDeTela">Série </span>
                {serie.numero}
              </span>

              {naExclusao ? (
                <>
                  <span className={estilos.valores}>
                    Excluir esta série? Ela não volta depois.
                  </span>
                  <span className={estilos.acoesLinha}>
                    <Botao
                      variante="fantasma"
                      pequeno
                      onClick={() => setEdicao({ tipo: 'nenhuma' })}
                      disabled={excluindo}
                    >
                      Cancelar
                    </Botao>
                    <Botao
                      variante="perigo"
                      pequeno
                      carregando={excluindo}
                      onClick={() => void confirmarExclusao(serie)}
                    >
                      Excluir
                    </Botao>
                  </span>
                </>
              ) : (
                <>
                  <span className={estilos.valores}>
                    <span className={estilos.valor}>
                      <strong>{formatarInteiro(serie.repeticoes)}</strong>{' '}
                      <span className={estilos.unidade}>
                        {serie.repeticoes === 1 ? 'repetição' : 'repetições'}
                      </span>
                    </span>
                    {serie.carga === null ? (
                      <span className={estilos.semCarga}>sem carga</span>
                    ) : (
                      <span className={estilos.valor}>
                        <strong>{formatarCarga(serie.carga)}</strong>{' '}
                        <span className={estilos.unidade}>kg</span>
                      </span>
                    )}
                  </span>

                  <span className={estilos.acoesLinha}>
                    <Botao
                      variante="fantasma"
                      pequeno
                      soIcone
                      aria-label={`Editar a série ${serie.numero} de ${exercicio.nome}`}
                      onClick={() => setEdicao({ tipo: 'editando', serieId: serie.id })}
                    >
                      <Pencil size={14} aria-hidden="true" />
                    </Botao>
                    <Botao
                      variante="perigoSuave"
                      pequeno
                      soIcone
                      aria-label={`Excluir a série ${serie.numero} de ${exercicio.nome}`}
                      onClick={() => setEdicao({ tipo: 'excluindo', serieId: serie.id })}
                    >
                      <Trash2 size={14} aria-hidden="true" />
                    </Botao>
                  </span>
                </>
              )}
            </li>
          )
        })}

        {edicao.tipo === 'adicionando' ? (
          <li>
            <FormularioSerie
              // A próxima série costuma repetir a anterior: vem preenchida
              // com os valores da última, e editável.
              {...(ultima === undefined
                ? {}
                : { inicial: { repeticoes: ultima.repeticoes, carga: ultima.carga } })}
              rotuloEnviar="Adicionar série"
              aoEnviar={adicionar}
              aoCancelar={() => setEdicao({ tipo: 'nenhuma' })}
            />
          </li>
        ) : null}
      </ul>

      <div className={estilos.rodape}>
        <span className={estilos.totais}>
          {totais.series === 0
            ? 'Sem séries'
            : `${formatarInteiro(totais.series)} ${totais.series === 1 ? 'série' : 'séries'}`}
          {totais.volume > 0 ? ` · ${formatarCarga(totais.volume)} kg de volume` : ''}
          {totais.seriesSemCarga > 0 && totais.series > 0
            ? ` · ${formatarInteiro(totais.seriesSemCarga)} sem carga`
            : ''}
        </span>

        {edicao.tipo === 'adicionando' ? null : (
          <Botao
            variante="secundaria"
            pequeno
            iconeInicial={<Plus size={14} aria-hidden="true" />}
            onClick={() => setEdicao({ tipo: 'adicionando' })}
          >
            Adicionar série
            <span className="apenasLeitorDeTela"> em {exercicio.nome}</span>
          </Botao>
        )}
      </div>
    </>
  )
}

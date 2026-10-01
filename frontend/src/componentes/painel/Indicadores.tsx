import {
  formatarInteiro,
  formatarVolume,
  type ResumoGeral,
} from '../../dominio/metricas.ts'
import estilos from './Indicadores.module.css'

function Ficha({
  rotulo,
  valor,
  apoio,
}: {
  rotulo: string
  valor: string
  apoio?: string
}) {
  return (
    <div className={estilos.ficha}>
      <span className={estilos.rotuloFicha}>{rotulo}</span>
      <span className={estilos.valorFicha}>
        {valor}
        {apoio === undefined ? null : <span className={estilos.apoioFicha}>{apoio}</span>}
      </span>
    </div>
  )
}

export function Indicadores({ resumo }: { resumo: ResumoGeral }) {
  const volume = formatarVolume(resumo.volume)

  const nota =
    resumo.seriesSemCarga === 0
      ? 'Soma de repetições × carga de todas as séries da semana.'
      : `Soma de repetições × carga. ${formatarInteiro(resumo.seriesSemCarga)} ${
          resumo.seriesSemCarga === 1 ? 'série ficou de fora por não ter' : 'séries ficaram de fora por não terem'
        } carga registrada.`

  return (
    <div className={estilos.grade}>
      <div className={estilos.heroi}>
        <div>
          <p className={estilos.rotuloHeroi}>Volume da semana</p>
          <p className={estilos.valorHeroi}>
            {volume.valor}
            <span className={estilos.unidadeHeroi}>{volume.unidade}</span>
          </p>
        </div>
        <p className={estilos.notaHeroi}>{nota}</p>
      </div>

      <Ficha
        rotulo="Treinos montados"
        valor={formatarInteiro(resumo.treinos)}
        apoio={
          resumo.diasComTreino === 1
            ? 'em 1 dia da semana'
            : `em ${formatarInteiro(resumo.diasComTreino)} dias da semana`
        }
      />
      <Ficha rotulo="Exercícios" valor={formatarInteiro(resumo.exercicios)} />
      <Ficha
        rotulo="Séries"
        valor={formatarInteiro(resumo.series)}
        {...(resumo.seriesSemCarga > 0
          ? { apoio: `${formatarInteiro(resumo.seriesSemCarga)} sem carga` }
          : {})}
      />
    </div>
  )
}

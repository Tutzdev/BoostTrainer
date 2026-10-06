import { CalendarDays, Dumbbell, Layers, ListChecks, type LucideIcon } from 'lucide-react'
import type { CSSProperties } from 'react'
import { formatarInteiro, formatarVolume, type ResumoGeral } from '../../dominio/metricas.ts'
import estilos from './Indicadores.module.css'

interface FichaProps {
  icone: LucideIcon
  rotulo: string
  valor: string
  apoio?: string
  ordem: number
}

function Ficha({ icone: Icone, rotulo, valor, apoio, ordem }: FichaProps) {
  return (
    <div className={estilos.ficha} style={{ '--ordem': ordem } as CSSProperties}>
      <span className={estilos.iconeFicha}>
        <Icone size={20} aria-hidden="true" />
      </span>
      <div className={estilos.textoFicha}>
        <span className={estilos.rotuloFicha}>{rotulo}</span>
        <span className={estilos.valorFicha}>{valor}</span>
        {apoio === undefined ? null : <span className={estilos.apoioFicha}>{apoio}</span>}
      </div>
    </div>
  )
}

export function Indicadores({ resumo }: { resumo: ResumoGeral }) {
  const volume = formatarVolume(resumo.volume)
  const nota =
    resumo.seriesSemCarga === 0
      ? 'Repetições × carga de todas as séries.'
      : `Repetições × carga. ${formatarInteiro(resumo.seriesSemCarga)} ${
          resumo.seriesSemCarga === 1 ? 'série sem carga ficou de fora.' : 'séries sem carga ficaram de fora.'
        }`

  return (
    <section className={estilos.grade} aria-label="Resumo da semana">
      <div className={estilos.heroi}>
        <span className={estilos.iconeHeroi}>
          <Dumbbell size={22} aria-hidden="true" />
        </span>
        <div>
          <p className={estilos.rotuloHeroi}>Volume da semana</p>
          <p className={estilos.valorHeroi}>
            {volume.valor}
            <span className={estilos.unidadeHeroi}>{volume.unidade}</span>
          </p>
          <p className={estilos.notaHeroi}>{nota}</p>
        </div>
      </div>
      <Ficha
        icone={CalendarDays}
        rotulo="Treinos montados"
        valor={formatarInteiro(resumo.treinos)}
        apoio={
          resumo.diasComTreino === 1
            ? 'em 1 dia da semana'
            : `em ${formatarInteiro(resumo.diasComTreino)} dias da semana`
        }
        ordem={1}
      />
      <Ficha icone={ListChecks} rotulo="Exercícios" valor={formatarInteiro(resumo.exercicios)} ordem={2} />
      <Ficha
        icone={Layers}
        rotulo="Séries"
        valor={formatarInteiro(resumo.series)}
        {...(resumo.seriesSemCarga > 0
          ? { apoio: `${formatarInteiro(resumo.seriesSemCarga)} sem carga` }
          : {})}
        ordem={3}
      />
    </section>
  )
}

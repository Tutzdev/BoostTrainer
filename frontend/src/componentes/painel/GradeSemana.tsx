import { Plus } from 'lucide-react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { diaDeHoje, rotuloDoDia } from '../../dominio/diaSemana.ts'
import { formatarInteiro, totaisDoTreino, type DiaDaSemana } from '../../dominio/metricas.ts'
import { useCriacaoDeTreino } from '../../hooks/useCriacaoDeTreino.ts'
import estilos from './GradeSemana.module.css'

function resumoDoTreino(exercicios: number, series: number): string {
  const partes = [
    `${formatarInteiro(exercicios)} ${exercicios === 1 ? 'exercício' : 'exercícios'}`,
    `${formatarInteiro(series)} ${series === 1 ? 'série' : 'séries'}`,
  ]
  return partes.join(' · ')
}

export function GradeSemana({ semana }: { semana: readonly DiaDaSemana[] }) {
  const { abrir } = useCriacaoDeTreino()
  const hoje = diaDeHoje()

  return (
    <ul className={estilos.grade}>
      {semana.map((diaDaSemana, indice) => {
        const temTreino = diaDaSemana.treinos.length > 0
        const nome = rotuloDoDia(diaDaSemana.dia)

        return (
          <li
            key={diaDaSemana.dia}
            className={[estilos.dia, temTreino ? '' : estilos.descanso, diaDaSemana.dia === hoje ? estilos.diaDeHoje : '']
              .filter(Boolean)
              .join(' ')}
            style={{ '--indice': indice } as CSSProperties}
          >
            <div className={estilos.cabecalho}>
              <h3 className={estilos.nomeDoDia}>{nome}</h3>
              {diaDaSemana.dia === hoje ? <span className={estilos.hoje}>Hoje</span> : null}
            </div>

            {temTreino ? (
              <div className={estilos.treinos}>
                {diaDaSemana.treinos.map((treino) => {
                  const totais = totaisDoTreino(treino)
                  return (
                    <Link key={treino.id} to={`/treinos/${treino.id}`} className={estilos.treino}>
                      <span className={estilos.nomeDoTreino}>{treino.nome}</span>
                      <span className={estilos.resumoDoTreino}>
                        {resumoDoTreino(totais.exercicios, totais.series)}
                      </span>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <>
                <p className={estilos.vazio}>Descanso</p>
                <button
                  type="button"
                  className={estilos.criar}
                  onClick={() => abrir(diaDaSemana.dia)}
                >
                  <Plus size={14} aria-hidden="true" />
                  Criar treino
                  <span className="apenasLeitorDeTela"> para {nome}</span>
                </button>
              </>
            )}
          </li>
        )
      })}
    </ul>
  )
}

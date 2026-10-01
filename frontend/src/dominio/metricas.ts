import type { DiaSemana, DiaTreinoResponse, ExercicioResponse } from '../api/tipos.ts'
import { ORDEM_SEMANA } from './diaSemana.ts'

/**
 * Tudo aqui é calculado a partir do que a API devolve.
 * A API não guarda datas nem execuções, então não existe progresso no tempo:
 * os números descrevem o plano montado, não um histórico.
 */

export interface Totais {
  exercicios: number
  series: number
  /** Repetições x carga somadas, em kg. Séries sem carga ficam fora. */
  volume: number
  /** Quantas séries não entraram no volume por não ter carga registrada. */
  seriesSemCarga: number
}

const VAZIO: Totais = { exercicios: 0, series: 0, volume: 0, seriesSemCarga: 0 }

function somar(a: Totais, b: Totais): Totais {
  return {
    exercicios: a.exercicios + b.exercicios,
    series: a.series + b.series,
    volume: a.volume + b.volume,
    seriesSemCarga: a.seriesSemCarga + b.seriesSemCarga,
  }
}

export function totaisDoExercicio(exercicio: ExercicioResponse): Totais {
  return exercicio.series.reduce<Totais>(
    (acumulado, serie) => ({
      exercicios: acumulado.exercicios,
      series: acumulado.series + 1,
      volume: acumulado.volume + (serie.carga === null ? 0 : serie.repeticoes * serie.carga),
      seriesSemCarga: acumulado.seriesSemCarga + (serie.carga === null ? 1 : 0),
    }),
    { ...VAZIO, exercicios: 1 },
  )
}

export function totaisDoTreino(treino: DiaTreinoResponse): Totais {
  return treino.exercicios.map(totaisDoExercicio).reduce(somar, VAZIO)
}

export interface ResumoGeral extends Totais {
  treinos: number
  /** Quantos dias da semana têm pelo menos um treino. */
  diasComTreino: number
}

export function resumoGeral(treinos: readonly DiaTreinoResponse[]): ResumoGeral {
  const totais = treinos.map(totaisDoTreino).reduce(somar, VAZIO)
  const diasOcupados = new Set(treinos.map((treino) => treino.dia))

  return { ...totais, treinos: treinos.length, diasComTreino: diasOcupados.size }
}

export interface DiaDaSemana {
  dia: DiaSemana
  /** Pode haver mais de um treino no mesmo dia da semana. */
  treinos: DiaTreinoResponse[]
  totais: Totais
}

/** Os sete dias, sempre na mesma ordem, inclusive os de descanso. */
export function semanaCompleta(treinos: readonly DiaTreinoResponse[]): DiaDaSemana[] {
  return ORDEM_SEMANA.map((dia) => {
    const doDia = treinos.filter((treino) => treino.dia === dia)
    return {
      dia,
      treinos: doDia,
      totais: doDia.map(totaisDoTreino).reduce(somar, VAZIO),
    }
  })
}

const FORMATO_INTEIRO = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 })
const FORMATO_CARGA = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 })

export function formatarInteiro(valor: number): string {
  return FORMATO_INTEIRO.format(valor)
}

/** Carga e volume em kg: até duas casas, sem zeros à direita. */
export function formatarCarga(valor: number): string {
  return FORMATO_CARGA.format(valor)
}

/** Volume fica longo rápido (1.000 kg -> 12,4 t), então encurta acima de 1 t. */
export function formatarVolume(kg: number): { valor: string; unidade: string } {
  if (kg >= 1000) {
    return { valor: FORMATO_CARGA.format(Math.round(kg / 100) / 10), unidade: 't' }
  }
  return { valor: FORMATO_CARGA.format(kg), unidade: 'kg' }
}

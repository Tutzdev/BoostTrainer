/**
 * Espelha os records do backend em `com.treino.api.treino.dto`.
 * A hierarquia é: dia de treino -> exercícios -> séries.
 */

export const DIAS_SEMANA = [
  'SEGUNDA',
  'TERCA',
  'QUARTA',
  'QUINTA',
  'SEXTA',
  'SABADO',
  'DOMINGO',
] as const

export type DiaSemana = (typeof DIAS_SEMANA)[number]

export interface SerieResponse {
  id: number
  numero: number
  repeticoes: number
  /** Em quilos. O backend permite série sem carga (peso do corpo, elástico). */
  carga: number | null
}

export interface ExercicioResponse {
  id: number
  nome: string
  observacao: string | null
  series: SerieResponse[]
}

export interface DiaTreinoResponse {
  id: number
  dia: DiaSemana
  nome: string
  exercicios: ExercicioResponse[]
}

export interface DiaTreinoRequest {
  dia: DiaSemana
  nome: string
}

export interface ExercicioRequest {
  nome: string
  observacao: string | null
}

export interface CriarSerieRequest {
  /** O número da série é gerado pelo backend na criação. */
  repeticoes: number
  carga: number | null
}

export interface AtualizarSerieRequest {
  numero: number
  repeticoes: number
  carga: number | null
}

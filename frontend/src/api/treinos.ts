import { requisitar } from './cliente.ts'
import type {
  AtualizarSerieRequest,
  CriarSerieRequest,
  DiaTreinoRequest,
  DiaTreinoResponse,
  ExercicioRequest,
  ExercicioResponse,
  SerieResponse,
} from './tipos.ts'

/**
 * Os endpoints que o backend realmente expõe. Não existe GET individual de
 * exercício nem de série: depois de mutar um deles, recarregue o dia inteiro.
 */

export function listarDiasTreino(sinal?: AbortSignal): Promise<DiaTreinoResponse[]> {
  return requisitar<DiaTreinoResponse[]>('/dias-treino', sinal ? { sinal } : {})
}

export function buscarDiaTreino(id: number, sinal?: AbortSignal): Promise<DiaTreinoResponse> {
  return requisitar<DiaTreinoResponse>(`/dias-treino/${id}`, sinal ? { sinal } : {})
}

export function criarDiaTreino(dados: DiaTreinoRequest): Promise<DiaTreinoResponse> {
  return requisitar<DiaTreinoResponse>('/dias-treino', { metodo: 'POST', corpo: dados })
}

export function atualizarDiaTreino(
  id: number,
  dados: DiaTreinoRequest,
): Promise<DiaTreinoResponse> {
  return requisitar<DiaTreinoResponse>(`/dias-treino/${id}`, { metodo: 'PUT', corpo: dados })
}

/** Apaga em cascata os exercícios e as séries do dia. */
export function excluirDiaTreino(id: number): Promise<void> {
  return requisitar<void>(`/dias-treino/${id}`, { metodo: 'DELETE' })
}

export function criarExercicio(
  diaTreinoId: number,
  dados: ExercicioRequest,
): Promise<ExercicioResponse> {
  return requisitar<ExercicioResponse>(`/dias-treino/${diaTreinoId}/exercicios`, {
    metodo: 'POST',
    corpo: dados,
  })
}

export function atualizarExercicio(
  id: number,
  dados: ExercicioRequest,
): Promise<ExercicioResponse> {
  return requisitar<ExercicioResponse>(`/exercicios/${id}`, { metodo: 'PUT', corpo: dados })
}

/** Apaga em cascata as séries do exercício. */
export function excluirExercicio(id: number): Promise<void> {
  return requisitar<void>(`/exercicios/${id}`, { metodo: 'DELETE' })
}

/** O número da série é definido pelo backend (maior número existente + 1). */
export function criarSerie(exercicioId: number, dados: CriarSerieRequest): Promise<SerieResponse> {
  return requisitar<SerieResponse>(`/exercicios/${exercicioId}/series`, {
    metodo: 'POST',
    corpo: dados,
  })
}

export function atualizarSerie(id: number, dados: AtualizarSerieRequest): Promise<SerieResponse> {
  return requisitar<SerieResponse>(`/series/${id}`, { metodo: 'PUT', corpo: dados })
}

export function excluirSerie(id: number): Promise<void> {
  return requisitar<void>(`/series/${id}`, { metodo: 'DELETE' })
}

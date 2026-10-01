import assert from 'node:assert/strict'
import { test } from 'node:test'
import type { DiaTreinoResponse } from '../api/tipos.ts'
import { lerCarga, lerRepeticoes } from './numeros.ts'
import { resumoGeral, semanaCompleta, totaisDoTreino } from './metricas.ts'

/*
 * Os cálculos de volume são a única regra de negócio do frontend: é por eles
 * que a visão geral e o gráfico respondem. O resto da tela só exibe o que a
 * API devolve, e testar isso seria repetir a implementação.
 *
 * Roda com o executor nativo do Node, sem dependência nova: npm test
 */

function treino(
  id: number,
  dia: DiaTreinoResponse['dia'],
  series: readonly (readonly [number, number | null])[][],
): DiaTreinoResponse {
  return {
    id,
    dia,
    nome: `Treino ${id}`,
    exercicios: series.map((doExercicio, indice) => ({
      id: id * 100 + indice,
      nome: `Exercício ${indice}`,
      observacao: null,
      series: doExercicio.map(([repeticoes, carga], posicao) => ({
        id: id * 1000 + indice * 10 + posicao,
        numero: posicao + 1,
        repeticoes,
        carga,
      })),
    })),
  }
}

test('volume é repetições × carga somadas', () => {
  const totais = totaisDoTreino(treino(1, 'SEGUNDA', [[[10, 20], [8, 25]]]))

  assert.equal(totais.exercicios, 1)
  assert.equal(totais.series, 2)
  assert.equal(totais.volume, 10 * 20 + 8 * 25)
  assert.equal(totais.seriesSemCarga, 0)
})

test('série sem carga conta como série, mas fica fora do volume', () => {
  const totais = totaisDoTreino(treino(1, 'SEGUNDA', [[[12, null], [10, 30]]]))

  assert.equal(totais.series, 2)
  assert.equal(totais.volume, 300)
  assert.equal(totais.seriesSemCarga, 1)
})

test('carga zero entra na conta sem alterar o volume e não é tratada como ausente', () => {
  const totais = totaisDoTreino(treino(1, 'SEGUNDA', [[[12, 0]]]))

  assert.equal(totais.volume, 0)
  assert.equal(totais.seriesSemCarga, 0, 'carga 0 é um valor registrado, diferente de null')
})

test('exercício sem séries conta como exercício', () => {
  const totais = totaisDoTreino(treino(1, 'SEGUNDA', [[]]))

  assert.equal(totais.exercicios, 1)
  assert.equal(totais.series, 0)
  assert.equal(totais.volume, 0)
})

test('dois treinos no mesmo dia somam juntos e contam como um dia ocupado', () => {
  const resumo = resumoGeral([
    treino(1, 'QUARTA', [[[10, 10]]]),
    treino(2, 'QUARTA', [[[10, 10]]]),
  ])

  assert.equal(resumo.treinos, 2)
  assert.equal(resumo.diasComTreino, 1)
  assert.equal(resumo.volume, 200)
})

test('a semana traz sempre os sete dias, de segunda a domingo', () => {
  const semana = semanaCompleta([treino(1, 'SABADO', [[[10, 10]]])])

  assert.equal(semana.length, 7)
  assert.deepEqual(
    semana.map((dia) => dia.dia),
    ['SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO', 'DOMINGO'],
  )
  assert.equal(semana[0]?.treinos.length, 0, 'segunda é descanso')
  assert.equal(semana[5]?.totais.volume, 100, 'sábado tem o treino')
})

test('repetições aceitam só inteiro positivo, como o @Positive do backend', () => {
  assert.deepEqual(lerRepeticoes('12'), { ok: true, valor: 12 })
  assert.equal(lerRepeticoes('').ok, false)
  assert.equal(lerRepeticoes('0').ok, false)
  assert.equal(lerRepeticoes('-3').ok, false)
  assert.equal(lerRepeticoes('10,5').ok, false)
})

test('carga é opcional e aceita a vírgula decimal do pt-BR', () => {
  assert.deepEqual(lerCarga(''), { ok: true, valor: null })
  assert.deepEqual(lerCarga('22,5'), { ok: true, valor: 22.5 })
  assert.deepEqual(lerCarga('0'), { ok: true, valor: 0 })
  assert.equal(lerCarga('-1').ok, false)
  assert.equal(lerCarga('abc').ok, false)
})

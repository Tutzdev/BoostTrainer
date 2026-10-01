import { ChevronRight } from 'lucide-react'
import { useId, useRef, useState, type CSSProperties } from 'react'
import { diaDeHoje, rotuloCurtoDoDia, rotuloDoDia } from '../../dominio/diaSemana.ts'
import { formatarCarga, formatarInteiro, type DiaDaSemana } from '../../dominio/metricas.ts'
import { useLarguraDoElemento } from '../../hooks/useLarguraDoElemento.ts'
import estilos from './GraficoSemana.module.css'

/** Arredonda o topo do eixo para 1, 2, 2,5 ou 5 vezes uma potência de dez. */
function tetoAgradavel(maximo: number): number {
  if (maximo <= 0) return 1
  const potencia = 10 ** Math.floor(Math.log10(maximo))
  for (const passo of [1, 2, 2.5, 5, 10]) {
    const candidato = passo * potencia
    if (candidato >= maximo) return candidato
  }
  return 10 * potencia
}

const MARGEM = { topo: 22, direita: 6, base: 28, esquerda: 48 }
const ESPESSURA_MAXIMA = 24
const LINHAS_DE_GRADE = 4

/**
 * Colunas por dia da semana, série única (uma cor só) e valor direto apenas
 * no maior dia — um número em cada barra não é lido.
 *
 * Quando nenhuma série tem carga registrada, o volume seria uma fileira de
 * zeros; nesse caso o gráfico passa a contar séries e o título diz isso.
 * A tabela ao pé repete os mesmos números, então nenhum valor depende de
 * passar o mouse nem de distinguir cores.
 */
export function GraficoSemana({ semana }: { semana: readonly DiaDaSemana[] }) {
  const area = useRef<HTMLDivElement>(null)
  const larguraDisponivel = useLarguraDoElemento(area)
  const [faixaAtiva, setFaixaAtiva] = useState<number | null>(null)
  // useId devolve algo como ":r3:", que não é válido em url(#...).
  const idCorte = `corte-${useId().replace(/:/g, '')}`
  const hoje = diaDeHoje()

  const volumeTotal = semana.reduce((soma, dia) => soma + dia.totais.volume, 0)
  const medindoVolume = volumeTotal > 0

  const dados = semana.map((dia) => ({
    dia: dia.dia,
    treinos: dia.treinos.length,
    exercicios: dia.totais.exercicios,
    series: dia.totais.series,
    volume: dia.totais.volume,
    valor: medindoVolume ? dia.totais.volume : dia.totais.series,
  }))

  const titulo = medindoVolume ? 'Volume por dia da semana' : 'Séries por dia da semana'
  const maiorValor = Math.max(0, ...dados.map((coluna) => coluna.valor))
  const teto = tetoAgradavel(maiorValor)
  const indiceMaior = maiorValor > 0 ? dados.findIndex((coluna) => coluna.valor === maiorValor) : -1

  const largura = Math.max(larguraDisponivel, 260)
  const alturaPlot = largura < 480 ? 150 : 190
  const altura = alturaPlot + MARGEM.topo + MARGEM.base
  const larguraPlot = Math.max(largura - MARGEM.esquerda - MARGEM.direita, 70)
  const faixa = larguraPlot / dados.length
  const espessura = Math.min(ESPESSURA_MAXIMA, Math.max(faixa - 10, 6))
  const base = MARGEM.topo + alturaPlot

  function alturaDaBarra(valor: number): number {
    return valor <= 0 ? 2 : Math.max((valor / teto) * alturaPlot, 2)
  }

  function formatarValor(valor: number): string {
    return medindoVolume ? `${formatarCarga(valor)} kg` : formatarInteiro(valor)
  }

  const colunaAtiva = faixaAtiva === null ? undefined : dados[faixaAtiva]

  /**
   * A dica é centralizada na faixa, mas nos dias das pontas isso a jogaria
   * para fora do cartão e criaria rolagem horizontal no celular. Aqui ela é
   * presa dentro da largura disponível.
   */
  const META_DICA = 96
  function posicaoDaDica(indice: number): number {
    const centro = MARGEM.esquerda + faixa * indice + faixa / 2
    if (largura <= META_DICA * 2) return largura / 2
    return Math.min(Math.max(centro, META_DICA), largura - META_DICA)
  }

  return (
    <figure className={estilos.figura}>
      <div className={estilos.cabecalho}>
        <h2 className={estilos.titulo}>{titulo}</h2>
        <span className={estilos.legendaUnidade}>
          {medindoVolume ? 'Repetições × carga, em kg' : 'Nenhuma série tem carga registrada ainda'}
        </span>
      </div>

      <div className={estilos.area} ref={area}>
        {larguraDisponivel === 0 ? null : (
          <svg
            width={largura}
            height={altura}
            viewBox={`0 0 ${largura} ${altura}`}
            role="group"
            aria-label={`${titulo}. Os valores exatos estão na tabela abaixo do gráfico.`}
            onMouseLeave={() => setFaixaAtiva(null)}
          >
            <defs>
              {/* Corta na linha de base: a barra tem topo arredondado de 4px
                  e pé reto, sem desenhar um path (que não aceita transição). */}
              <clipPath id={idCorte}>
                <rect x={0} y={0} width={largura} height={base} />
              </clipPath>
            </defs>

            {Array.from({ length: LINHAS_DE_GRADE + 1 }, (_, indice) => {
              const proporcao = indice / LINHAS_DE_GRADE
              const y = base - proporcao * alturaPlot
              const valor = teto * proporcao
              return (
                <g key={indice}>
                  {indice === 0 ? null : (
                    <line
                      className={estilos.grade}
                      x1={MARGEM.esquerda}
                      x2={MARGEM.esquerda + larguraPlot}
                      y1={y}
                      y2={y}
                    />
                  )}
                  <text
                    className={estilos.marcacao}
                    x={MARGEM.esquerda - 8}
                    y={y}
                    textAnchor="end"
                    dominantBaseline="middle"
                  >
                    {medindoVolume ? formatarCarga(valor) : formatarInteiro(valor)}
                  </text>
                </g>
              )
            })}

            <line
              className={estilos.eixo}
              x1={MARGEM.esquerda}
              x2={MARGEM.esquerda + larguraPlot}
              y1={base}
              y2={base}
            />

            {dados.map((coluna, indice) => {
              const centro = MARGEM.esquerda + faixa * indice + faixa / 2
              const alturaBarra = alturaDaBarra(coluna.valor)
              const semValor = coluna.valor <= 0

              return (
                <g
                  key={coluna.dia}
                  className={faixaAtiva === indice ? estilos.faixaAtiva : undefined}
                >
                  <rect
                    className={`${estilos.barra} ${semValor ? estilos.semValor : ''}`}
                    x={centro - espessura / 2}
                    y={base - alturaBarra}
                    width={espessura}
                    // Desce 6px abaixo da base; o clip devolve o canto reto.
                    height={alturaBarra + 6}
                    rx={4}
                    clipPath={`url(#${idCorte})`}
                  />

                  {indice === indiceMaior ? (
                    <text
                      className={estilos.valorDestaque}
                      x={centro}
                      y={base - alturaBarra - 7}
                      textAnchor="middle"
                    >
                      {medindoVolume ? formatarCarga(coluna.valor) : formatarInteiro(coluna.valor)}
                    </text>
                  ) : null}

                  <text
                    className={`${estilos.rotuloDia} ${
                      coluna.dia === hoje ? estilos.rotuloDiaAtivo : ''
                    }`}
                    x={centro}
                    y={base + 18}
                    textAnchor="middle"
                  >
                    {rotuloCurtoDoDia(coluna.dia)}
                  </text>

                  {/* Alvo do tamanho da faixa inteira, não da barra: mouse e
                      teclado alcançam o dia sem precisão de pixel. */}
                  <rect
                    className={estilos.faixa}
                    x={MARGEM.esquerda + faixa * indice}
                    y={MARGEM.topo}
                    width={faixa}
                    height={alturaPlot + MARGEM.base}
                    tabIndex={0}
                    role="img"
                    aria-label={`${rotuloDoDia(coluna.dia)}: ${formatarValor(coluna.valor)}${
                      medindoVolume ? `, ${formatarInteiro(coluna.series)} séries` : ''
                    }`}
                    onMouseEnter={() => setFaixaAtiva(indice)}
                    onFocus={() => setFaixaAtiva(indice)}
                    onBlur={() => setFaixaAtiva(null)}
                  />
                </g>
              )
            })}
          </svg>
        )}

        {colunaAtiva === undefined || faixaAtiva === null ? null : (
          <div
            className={estilos.dica}
            style={
              {
                left: posicaoDaDica(faixaAtiva),
                top: base - alturaDaBarra(colunaAtiva.valor) - 12,
              } as CSSProperties
            }
          >
            <span className={estilos.dicaTitulo}>{rotuloDoDia(colunaAtiva.dia)}</span>
            {colunaAtiva.treinos === 0 ? (
              <span className={estilos.dicaValor}>Descanso</span>
            ) : (
              <>
                <span className={estilos.dicaValor}>
                  {formatarValor(colunaAtiva.valor)}
                  {medindoVolume ? ' de volume' : ''}
                </span>
                <span className={estilos.dicaValor}>
                  {formatarInteiro(colunaAtiva.exercicios)}{' '}
                  {colunaAtiva.exercicios === 1 ? 'exercício' : 'exercícios'} ·{' '}
                  {formatarInteiro(colunaAtiva.series)}{' '}
                  {colunaAtiva.series === 1 ? 'série' : 'séries'}
                </span>
              </>
            )}
          </div>
        )}
      </div>

      <figcaption>
        <details className={estilos.tabelaAberta}>
          <summary className={estilos.resumoTabela}>
            <ChevronRight size={14} aria-hidden="true" />
            Ver os números em tabela
          </summary>
          <div className={estilos.rolagemTabela}>
            <table className={estilos.tabela}>
              <caption className="apenasLeitorDeTela">
                {titulo}, com treinos, exercícios, séries e volume de cada dia.
              </caption>
              <thead>
                <tr>
                  <th scope="col">Dia</th>
                  <th scope="col">Treinos</th>
                  <th scope="col">Exercícios</th>
                  <th scope="col">Séries</th>
                  <th scope="col">Volume (kg)</th>
                </tr>
              </thead>
              <tbody>
                {dados.map((coluna) => (
                  <tr key={coluna.dia}>
                    <th scope="row">{rotuloDoDia(coluna.dia)}</th>
                    <td>{formatarInteiro(coluna.treinos)}</td>
                    <td>{formatarInteiro(coluna.exercicios)}</td>
                    <td>{formatarInteiro(coluna.series)}</td>
                    <td>{formatarCarga(coluna.volume)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </figcaption>
    </figure>
  )
}

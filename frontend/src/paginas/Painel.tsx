import { Plus } from 'lucide-react'
import { useMemo } from 'react'
import { resumoGeral, semanaCompleta } from '../dominio/metricas.ts'
import { useListaDeTreinos } from '../hooks/useContextoTreinos.ts'
import { useCriacaoDeTreino } from '../hooks/useCriacaoDeTreino.ts'
import { GradeSemana } from '../componentes/painel/GradeSemana.tsx'
import { GraficoSemana } from '../componentes/painel/GraficoSemana.tsx'
import { Indicadores } from '../componentes/painel/Indicadores.tsx'
import { Botao } from '../componentes/ui/Botao.tsx'
import { Esqueleto } from '../componentes/ui/Esqueleto.tsx'
import { EstadoErro } from '../componentes/ui/EstadoErro.tsx'
import { EstadoVazio } from '../componentes/ui/EstadoVazio.tsx'
import estilos from './Painel.module.css'

function CarregandoPainel() {
  return (
    <div className={estilos.pagina} aria-busy="true">
      <span className="apenasLeitorDeTela">Carregando a visão geral da semana.</span>
      <div className={estilos.esqueletoFichas} aria-hidden="true">
        <div className={`${estilos.blocoEsqueleto} ${estilos.esqueletoHeroi}`}>
          <Esqueleto largura="9rem" altura="0.75rem" ordem={0} />
          <Esqueleto largura="12rem" altura="2.75rem" ordem={1} />
        </div>
        {[0, 1, 2].map((indice) => (
          <div key={indice} className={estilos.blocoEsqueleto}>
            <Esqueleto largura="6rem" altura="0.75rem" ordem={indice + 2} />
            <Esqueleto largura="4rem" altura="1.75rem" ordem={indice + 3} />
          </div>
        ))}
      </div>
      <div className={estilos.blocoEsqueleto} aria-hidden="true">
        <Esqueleto largura="14rem" altura="1rem" ordem={5} />
        <Esqueleto altura="11rem" ordem={6} />
      </div>
    </div>
  )
}

export function Painel() {
  const { estado, recarregando, recarregar } = useListaDeTreinos()
  const { abrir } = useCriacaoDeTreino()

  const treinos = estado.situacao === 'pronto' ? estado.dados : null

  const semana = useMemo(() => (treinos === null ? [] : semanaCompleta(treinos)), [treinos])
  const resumo = useMemo(() => (treinos === null ? null : resumoGeral(treinos)), [treinos])

  if (estado.situacao === 'carregando') return <CarregandoPainel />

  if (estado.situacao === 'erro') {
    return (
      <div className={estilos.pagina}>
        <h1>Visão geral</h1>
        <EstadoErro erro={estado.erro} aoTentarNovamente={recarregar} tentando={recarregando} />
      </div>
    )
  }

  if (treinos === null || resumo === null) return null

  if (treinos.length === 0) {
    return (
      <div className={estilos.pagina}>
        <div className={estilos.intro}>
          <h1>Visão geral</h1>
          <p>
            A sua semana de treino começa aqui. Cada treino fica em um dia, recebe exercícios e,
            dentro deles, as séries com repetições e carga.
          </p>
        </div>
        <EstadoVazio
          titulo="Nenhum treino cadastrado"
          descricao="Crie o primeiro treino escolhendo um dia da semana e um nome, por exemplo Segunda · Peito e tríceps. Depois você adiciona os exercícios e as séries."
          acao={
            <Botao
              variante="primaria"
              onClick={() => abrir()}
              iconeInicial={<Plus size={16} aria-hidden="true" />}
            >
              Criar o primeiro treino
            </Botao>
          }
        />
      </div>
    )
  }

  return (
    <div className={`${estilos.pagina} ${recarregando ? estilos.recarregando : ''}`}>
      <header className={estilos.cabecalho}>
        <div className={estilos.intro}>
          <h1>Visão geral</h1>
          <p>
            Os números abaixo são calculados a partir dos treinos cadastrados. A API não guarda
            datas de execução, então eles descrevem o plano montado, não um histórico.
          </p>
        </div>
        <Botao
          variante="primaria"
          onClick={() => abrir()}
          iconeInicial={<Plus size={16} aria-hidden="true" />}
        >
          Novo treino
        </Botao>
      </header>

      <Indicadores resumo={resumo} />

      <section className={estilos.secao} aria-labelledby="titulo-semana">
        <div className={estilos.tituloSecao}>
          <h2 id="titulo-semana">A semana</h2>
          <span className={estilos.apoioSecao}>
            {resumo.diasComTreino === 7
              ? 'Todos os dias têm treino'
              : `${7 - resumo.diasComTreino} ${
                  7 - resumo.diasComTreino === 1 ? 'dia de descanso' : 'dias de descanso'
                }`}
          </span>
        </div>
        <GradeSemana semana={semana} />
      </section>

      <GraficoSemana semana={semana} />
    </div>
  )
}

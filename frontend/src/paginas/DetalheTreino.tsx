import { ArrowLeft, Pencil, Plus, Trash2 } from 'lucide-react'
import { useCallback, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ehNaoEncontrado, mensagemDoErro } from '../api/erros.ts'
import type { DiaTreinoRequest, ExercicioRequest } from '../api/tipos.ts'
import {
  atualizarDiaTreino,
  criarExercicio,
  excluirDiaTreino,
} from '../api/treinos.ts'
import { rotuloDoDia } from '../dominio/diaSemana.ts'
import { formatarCarga, formatarInteiro, totaisDoTreino } from '../dominio/metricas.ts'
import { useAvisos } from '../hooks/useAvisos.ts'
import { useListaDeTreinos } from '../hooks/useContextoTreinos.ts'
import { useTreino } from '../hooks/useTreinos.ts'
import { CartaoExercicio } from '../componentes/treino/CartaoExercicio.tsx'
import { FormularioExercicio } from '../componentes/treino/FormularioExercicio.tsx'
import { FormularioTreino } from '../componentes/treino/FormularioTreino.tsx'
import { Botao } from '../componentes/ui/Botao.tsx'
import { DialogoConfirmacao } from '../componentes/ui/DialogoConfirmacao.tsx'
import { Esqueleto } from '../componentes/ui/Esqueleto.tsx'
import { EstadoErro } from '../componentes/ui/EstadoErro.tsx'
import { EstadoVazio } from '../componentes/ui/EstadoVazio.tsx'
import estilos from './DetalheTreino.module.css'

function LinkDeVolta() {
  return (
    <Link to="/" className={estilos.voltar}>
      <ArrowLeft size={16} aria-hidden="true" />
      Visão geral
    </Link>
  )
}

export function DetalheTreino() {
  const { id } = useParams<{ id: string }>()
  const identificador = Number(id)

  if (!Number.isInteger(identificador) || identificador <= 0) {
    return (
      <div className={estilos.pagina}>
        <LinkDeVolta />
        <EstadoVazio
          titulo="Endereço inválido"
          descricao={`"${id ?? ''}" não é o identificador de um treino. Volte para a visão geral e escolha um treino da semana.`}
        />
      </div>
    )
  }

  return <ConteudoDoTreino identificador={identificador} />
}

function ConteudoDoTreino({ identificador }: { identificador: number }) {
  const { estado, recarregando, recarregar, substituir } = useTreino(identificador)
  const lista = useListaDeTreinos()
  const { avisar } = useAvisos()
  const navegar = useNavigate()

  const [editandoTreino, setEditandoTreino] = useState(false)
  const [adicionandoExercicio, setAdicionandoExercicio] = useState(false)
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false)
  const [excluindo, setExcluindo] = useState(false)
  const [erroExclusao, setErroExclusao] = useState<string>()

  /**
   * Depois de qualquer mutação, o dia é relido inteiro: a API não tem GET de
   * exercício nem de série, então esta é a única forma de voltar ao estado
   * real. A lista da semana recarrega junto, para a barra lateral e a visão
   * geral não ficarem desatualizadas.
   */
  const recarregarTudo = useCallback(async () => {
    await Promise.all([recarregar(), lista.recarregar()])
  }, [lista, recarregar])

  if (estado.situacao === 'carregando') {
    return (
      <div className={estilos.pagina} aria-busy="true">
        <LinkDeVolta />
        <span className="apenasLeitorDeTela">Carregando o treino.</span>
        <div className={estilos.blocoEsqueleto} aria-hidden="true">
          <Esqueleto largura="5rem" altura="1rem" ordem={0} />
          <Esqueleto largura="14rem" altura="2rem" ordem={1} />
          <Esqueleto largura="18rem" altura="0.875rem" ordem={2} />
        </div>
        <div className={estilos.blocoEsqueleto} aria-hidden="true">
          <Esqueleto largura="11rem" altura="1.125rem" ordem={3} />
          <Esqueleto altura="3rem" ordem={4} />
        </div>
      </div>
    )
  }

  if (estado.situacao === 'erro') {
    const naoEncontrado = ehNaoEncontrado(estado.erro)
    return (
      <div className={estilos.pagina}>
        <LinkDeVolta />
        {naoEncontrado ? (
          <EstadoVazio
            titulo="Esse treino não existe mais"
            descricao="Ele pode ter sido excluído, ou a API foi reiniciada — o banco é em memória, então tudo é perdido quando o backend sobe de novo."
            acao={
              <Botao variante="primaria" onClick={() => navegar('/')}>
                Ir para a visão geral
              </Botao>
            }
          />
        ) : (
          <EstadoErro erro={estado.erro} aoTentarNovamente={recarregar} tentando={recarregando} />
        )}
      </div>
    )
  }

  const treino = estado.dados
  const totais = totaisDoTreino(treino)

  async function salvarTreino(dados: DiaTreinoRequest) {
    const atualizado = await atualizarDiaTreino(treino.id, dados)
    substituir(atualizado)
    setEditandoTreino(false)
    avisar(`Treino "${atualizado.nome}" atualizado.`)
    await lista.recarregar()
  }

  async function adicionarExercicio(dados: ExercicioRequest) {
    await criarExercicio(treino.id, dados)
    setAdicionandoExercicio(false)
    avisar(`Exercício "${dados.nome}" adicionado.`)
    await recarregarTudo()
  }

  async function excluirTreino() {
    setErroExclusao(undefined)
    setExcluindo(true)
    try {
      await excluirDiaTreino(treino.id)
      avisar(`Treino "${treino.nome}" excluído.`)
      await lista.recarregar()
      navegar('/')
    } catch (causa) {
      setErroExclusao(mensagemDoErro(causa))
      setExcluindo(false)
    }
  }

  const consequencias: string[] = []
  if (totais.exercicios > 0) {
    consequencias.push(
      `${formatarInteiro(totais.exercicios)} ${totais.exercicios === 1 ? 'exercício' : 'exercícios'}`,
    )
  }
  if (totais.series > 0) {
    consequencias.push(
      `${formatarInteiro(totais.series)} ${totais.series === 1 ? 'série' : 'séries'}`,
    )
  }

  return (
    <div className={`${estilos.pagina} ${recarregando ? estilos.recarregando : ''}`}>
      <LinkDeVolta />

      {editandoTreino ? (
        <div className={estilos.edicaoCabecalho}>
          <h1 className={estilos.tituloEdicao}>Editar treino</h1>
          <FormularioTreino
            inicial={{ dia: treino.dia, nome: treino.nome }}
            rotuloEnviar="Salvar treino"
            aoEnviar={salvarTreino}
            aoCancelar={() => setEditandoTreino(false)}
          />
        </div>
      ) : (
        <header className={`${estilos.cabecalho} casca`}>
          <div className={estilos.identificacao}>
            <span className={estilos.dia}>{rotuloDoDia(treino.dia)}</span>
            <h1 className={estilos.nome}>{treino.nome}</h1>
            <p className={estilos.totais}>
              <span>
                <strong>{formatarInteiro(totais.exercicios)}</strong>{' '}
                {totais.exercicios === 1 ? 'exercício' : 'exercícios'}
              </span>
              <span>
                <strong>{formatarInteiro(totais.series)}</strong>{' '}
                {totais.series === 1 ? 'série' : 'séries'}
              </span>
              <span>
                <strong>{formatarCarga(totais.volume)}</strong> kg de volume
              </span>
            </p>
          </div>

          <div className={estilos.acoesCabecalho}>
            <Botao
              variante="secundaria"
              onClick={() => setEditandoTreino(true)}
              iconeInicial={<Pencil size={15} aria-hidden="true" />}
            >
              Editar
            </Botao>
            <Botao
              variante="secundaria"
              onClick={() => setConfirmandoExclusao(true)}
              iconeInicial={<Trash2 size={15} aria-hidden="true" />}
            >
              Excluir
            </Botao>
          </div>
        </header>
      )}

      <section className={estilos.secao} aria-labelledby="titulo-exercicios">
        <div className={estilos.tituloSecao}>
          <h2 id="titulo-exercicios">Exercícios</h2>
          {adicionandoExercicio || treino.exercicios.length === 0 ? null : (
            <Botao
              variante="primaria"
              onClick={() => setAdicionandoExercicio(true)}
              iconeInicial={<Plus size={16} aria-hidden="true" />}
            >
              Adicionar exercício
            </Botao>
          )}
        </div>

        {treino.exercicios.length === 0 && !adicionandoExercicio ? (
          <EstadoVazio
            titulo="Nenhum exercício neste treino"
            descricao="Adicione o primeiro exercício e depois registre as séries com repetições e carga."
            acao={
              <Botao
                variante="primaria"
                onClick={() => setAdicionandoExercicio(true)}
                iconeInicial={<Plus size={16} aria-hidden="true" />}
              >
                Adicionar exercício
              </Botao>
            }
          />
        ) : (
          <ul className={estilos.exercicios}>
            {treino.exercicios.map((exercicio, indice) => (
              <CartaoExercicio
                key={exercicio.id}
                exercicio={exercicio}
                posicao={indice + 1}
                aoMudar={recarregarTudo}
              />
            ))}
          </ul>
        )}

        {adicionandoExercicio ? (
          <div className={estilos.novoExercicio}>
            <h3 className={estilos.tituloNovo}>Novo exercício</h3>
            <FormularioExercicio
              rotuloEnviar="Adicionar exercício"
              aoEnviar={adicionarExercicio}
              aoCancelar={() => setAdicionandoExercicio(false)}
            />
          </div>
        ) : null}
      </section>

      <DialogoConfirmacao
        aberto={confirmandoExclusao}
        titulo={`Excluir o treino "${treino.nome}"?`}
        rotuloConfirmar="Excluir treino"
        confirmando={excluindo}
        erro={erroExclusao}
        aoConfirmar={() => void excluirTreino()}
        aoCancelar={() => {
          setConfirmandoExclusao(false)
          setErroExclusao(undefined)
        }}
        consequencia={
          consequencias.length === 0 ? (
            <p>Este treino está vazio. A exclusão não pode ser desfeita.</p>
          ) : (
            <p>
              Excluir o treino de {rotuloDoDia(treino.dia)} também apaga{' '}
              <strong>{consequencias.join(' e ')}</strong>. A exclusão não pode ser desfeita.
            </p>
          )
        }
      />
    </div>
  )
}

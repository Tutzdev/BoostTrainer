import { Pencil, Trash2 } from 'lucide-react'
import { useState, type CSSProperties } from 'react'
import { mensagemDoErro } from '../../api/erros.ts'
import type { ExercicioRequest, ExercicioResponse } from '../../api/tipos.ts'
import { atualizarExercicio, excluirExercicio } from '../../api/treinos.ts'
import { formatarInteiro, totaisDoExercicio } from '../../dominio/metricas.ts'
import { useAvisos } from '../../hooks/useAvisos.ts'
import { Botao } from '../ui/Botao.tsx'
import { DialogoConfirmacao } from '../ui/DialogoConfirmacao.tsx'
import { FormularioExercicio } from './FormularioExercicio.tsx'
import { ListaDeSeries } from './ListaDeSeries.tsx'
import estilos from './CartaoExercicio.module.css'

interface CartaoExercicioProps {
  exercicio: ExercicioResponse
  /** Posição na lista, só para leitura; a API não guarda ordem explícita. */
  posicao: number
  aoMudar: () => Promise<void>
}

export function CartaoExercicio({ exercicio, posicao, aoMudar }: CartaoExercicioProps) {
  const { avisar } = useAvisos()
  const [editando, setEditando] = useState(false)
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false)
  const [excluindo, setExcluindo] = useState(false)
  const [erroExclusao, setErroExclusao] = useState<string>()

  const totais = totaisDoExercicio(exercicio)

  async function salvar(dados: ExercicioRequest) {
    await atualizarExercicio(exercicio.id, dados)
    setEditando(false)
    avisar(`Exercício "${dados.nome}" atualizado.`)
    await aoMudar()
  }

  async function excluir() {
    setErroExclusao(undefined)
    setExcluindo(true)
    try {
      await excluirExercicio(exercicio.id)
      setConfirmandoExclusao(false)
      avisar(`Exercício "${exercicio.nome}" excluído.`)
      await aoMudar()
    } catch (causa) {
      setErroExclusao(mensagemDoErro(causa))
    } finally {
      setExcluindo(false)
    }
  }

  return (
    <li className={estilos.cartao} style={{ '--indice': posicao - 1 } as CSSProperties}>
      {editando ? (
        <div className={estilos.corpoEdicao}>
          <FormularioExercicio
            inicial={{ nome: exercicio.nome, observacao: exercicio.observacao }}
            rotuloEnviar="Salvar exercício"
            aoEnviar={salvar}
            aoCancelar={() => setEditando(false)}
          />
        </div>
      ) : (
        <div className={estilos.cabecalho}>
          <span className={estilos.ordem} aria-hidden="true">
            {posicao}
          </span>
          <div className={estilos.identificacao}>
            <h3 className={estilos.nome}>{exercicio.nome}</h3>
            {exercicio.observacao === null || exercicio.observacao.trim() === '' ? null : (
              <p className={estilos.observacao}>{exercicio.observacao}</p>
            )}
          </div>
          <div className={estilos.acoes}>
            <Botao
              variante="fantasma"
              pequeno
              soIcone
              aria-label={`Editar o exercício ${exercicio.nome}`}
              onClick={() => setEditando(true)}
            >
              <Pencil size={15} aria-hidden="true" />
            </Botao>
            <Botao
              variante="perigoSuave"
              pequeno
              soIcone
              aria-label={`Excluir o exercício ${exercicio.nome}`}
              onClick={() => setConfirmandoExclusao(true)}
            >
              <Trash2 size={15} aria-hidden="true" />
            </Botao>
          </div>
        </div>
      )}

      <ListaDeSeries exercicio={exercicio} aoMudar={aoMudar} />

      <DialogoConfirmacao
        aberto={confirmandoExclusao}
        titulo={`Excluir "${exercicio.nome}"?`}
        rotuloConfirmar="Excluir exercício"
        confirmando={excluindo}
        erro={erroExclusao}
        aoConfirmar={() => void excluir()}
        aoCancelar={() => {
          setConfirmandoExclusao(false)
          setErroExclusao(undefined)
        }}
        consequencia={
          totais.series === 0 ? (
            <p>
              Este exercício ainda não tem séries. A exclusão não pode ser desfeita.
            </p>
          ) : (
            <p>
              Excluir o exercício também apaga{' '}
              <strong>
                {formatarInteiro(totais.series)}{' '}
                {totais.series === 1 ? 'série' : 'séries'}
              </strong>
              . A exclusão não pode ser desfeita.
            </p>
          )
        }
      />
    </li>
  )
}

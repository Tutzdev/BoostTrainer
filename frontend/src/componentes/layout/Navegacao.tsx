import { AlertTriangle, Database, LayoutDashboard, Plus, RotateCw } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import type { DiaTreinoResponse } from '../../api/tipos.ts'
import { ORDEM_SEMANA, rotuloCurtoDoDia, rotuloDoDia } from '../../dominio/diaSemana.ts'
import { Esqueleto } from '../ui/Esqueleto.tsx'
import estilos from './Casca.module.css'

interface NavegacaoProps {
  treinos: DiaTreinoResponse[] | null
  situacao: 'carregando' | 'pronto' | 'erro'
  aoNovoTreino: () => void
  aoNavegar?: () => void
  aoRecarregar?: () => void
  recolhida?: boolean
}

const EXPLICACAO_DADOS =
  'Os dados ficam no banco em memória da API. Ao reiniciar o backend, a semana começa vazia de novo.'

function ordenarPelaSemana(treinos: DiaTreinoResponse[]): DiaTreinoResponse[] {
  return [...treinos].sort((a, b) => {
    const diferenca = ORDEM_SEMANA.indexOf(a.dia) - ORDEM_SEMANA.indexOf(b.dia)
    return diferenca === 0 ? a.nome.localeCompare(b.nome, 'pt-BR') : diferenca
  })
}

function classeDoItem({ isActive }: { isActive: boolean }) {
  return isActive ? `${estilos.item} ${estilos.itemAtivo}` : estilos.item
}

export function Navegacao({
  treinos,
  situacao,
  aoNovoTreino,
  aoNavegar,
  aoRecarregar,
  recolhida = false,
}: NavegacaoProps) {
  const ordenados = treinos === null ? [] : ordenarPelaSemana(treinos)

  return (
    <>
      <nav aria-label="Navegação principal" className={estilos.grupo}>
        <NavLink to="/" className={classeDoItem} onClick={aoNavegar} data-dica="Visão geral" end>
          <LayoutDashboard className={estilos.iconeItem} size={20} aria-hidden="true" />
          <span className={estilos.nomeDoItem}>Visão geral</span>
        </NavLink>
      </nav>

      <div className={`${estilos.grupo} ${estilos.grupoTreinos}`}>
        <h2 className={estilos.tituloGrupo} id="titulo-treinos-lateral">
          Treinos da semana
          {ordenados.length > 0 ? <span className={estilos.contagem}>{ordenados.length}</span> : null}
        </h2>
        <div className={estilos.separadorRecolhido} />

        {situacao === 'carregando' ? (
          <div className={estilos.carregandoLateral}>
            <span className="apenasLeitorDeTela">Carregando a lista de treinos.</span>
            <Esqueleto altura="2.25rem" largura="90%" ordem={0} />
            <Esqueleto altura="2.25rem" largura="75%" ordem={1} />
            <Esqueleto altura="2.25rem" largura="82%" ordem={2} />
          </div>
        ) : situacao === 'erro' ? (
          <div className={estilos.erroLateral} data-dica="Não foi possível carregar os treinos">
            <AlertTriangle size={16} aria-hidden="true" />
            <span className={estilos.textoErroLateral}>Não foi possível carregar os treinos</span>
            <button
              type="button"
              className={estilos.botaoRecarregar}
              aria-label="Tentar carregar novamente"
              data-dica="Tentar carregar novamente"
              onClick={aoRecarregar}
            >
              <RotateCw size={14} aria-hidden="true" />
            </button>
          </div>
        ) : ordenados.length === 0 ? (
          <p className={estilos.vaziaLateral}>
            Nenhum treino ainda. Crie o primeiro para montar a sua semana.
          </p>
        ) : (
          <ul className={estilos.lista} aria-labelledby="titulo-treinos-lateral">
            {ordenados.map((treino) => (
              <li key={treino.id}>
                <NavLink
                  to={`/treinos/${treino.id}`}
                  className={classeDoItem}
                  onClick={aoNavegar}
                  data-dica={`${rotuloDoDia(treino.dia)}: ${treino.nome}`}
                >
                  <span className={estilos.diaDoItem} aria-hidden="true">
                    {rotuloCurtoDoDia(treino.dia)}
                  </span>
                  <span className={estilos.nomeDoItem}>
                    <span className="apenasLeitorDeTela">{rotuloDoDia(treino.dia)}: </span>
                    {treino.nome}
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        )}

        <button
          type="button"
          className={estilos.botaoNovo}
          data-dica="Novo treino"
          aria-label={recolhida ? 'Novo treino' : undefined}
          onClick={() => {
            aoNavegar?.()
            aoNovoTreino()
          }}
        >
          <Plus size={18} aria-hidden="true" />
          <span className={estilos.nomeDoItem}>Novo treino</span>
        </button>
      </div>

      <div className={estilos.rodapeLateral}>
        <div
          className={estilos.chipStatus}
          tabIndex={0}
          role="note"
          aria-label={`Dados temporários. ${EXPLICACAO_DADOS}`}
          data-dica={`Dados temporários. ${EXPLICACAO_DADOS}`}
        >
          <Database className={estilos.iconeStatus} size={18} aria-hidden="true" />
          <span className={estilos.textoStatus}>Dados temporários</span>
          {/* Recolhida, a explicação aparece na dica flutuante da Casca. */}
          {recolhida ? null : (
            <div className={estilos.popoverStatus} aria-hidden="true">
              {EXPLICACAO_DADOS}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

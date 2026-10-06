import { Menu, PanelLeftClose, Plus, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Outlet, matchPath, useLocation, useNavigate } from 'react-router-dom'
import { criarDiaTreino } from '../../api/treinos.ts'
import type { DiaSemana, DiaTreinoResponse } from '../../api/tipos.ts'
import { rotuloDoDia } from '../../dominio/diaSemana.ts'
import { ContextoDeCriacao, type CriacaoDeTreino } from '../../hooks/useCriacaoDeTreino.ts'
import { useListaDeTreinos } from '../../hooks/useContextoTreinos.ts'
import { useAvisos } from '../../hooks/useAvisos.ts'
import { useDicaFlutuante } from '../../hooks/useDicaFlutuante.ts'
import { useSidebarState } from '../../hooks/useSidebarState.ts'
import { FormularioTreino } from '../treino/FormularioTreino.tsx'
import { Botao } from '../ui/Botao.tsx'
import { Modal } from '../ui/Modal.tsx'
import { Logo, Simbolo } from './Logo.tsx'
import { Navegacao } from './Navegacao.tsx'
import estilos from './Casca.module.css'

/** Nome da tela atual para o topo, como no painel do Gomo. */
function tituloDaTela(caminho: string, treinos: DiaTreinoResponse[] | null): string {
  if (caminho === '/') return 'Visão geral'
  const rota = matchPath('/treinos/:id', caminho)
  if (rota === null) return 'Boost Trainer'
  const treino = treinos?.find((item) => String(item.id) === rota.params.id)
  return treino === undefined ? 'Treino' : `${rotuloDoDia(treino.dia)} · ${treino.nome}`
}

export function Casca() {
  const { estado, recarregar } = useListaDeTreinos()
  const { avisar } = useAvisos()
  const navegar = useNavigate()
  const localizacao = useLocation()
  const { expandida, alternar } = useSidebarState()
  const { dica, gatilhos } = useDicaFlutuante(!expandida)

  const [pedidoDeGaveta, setPedidoDeGaveta] = useState<string | null>(null)
  const gavetaAberta = pedidoDeGaveta === localizacao.pathname
  const [criando, setCriando] = useState(false)
  const [diaSugerido, setDiaSugerido] = useState<DiaSemana>('SEGUNDA')
  const [aberturas, setAberturas] = useState(0)
  const gaveta = useRef<HTMLDialogElement>(null)
  const botaoMenu = useRef<HTMLButtonElement>(null)

  const treinos = estado.situacao === 'pronto' ? estado.dados : null

  useEffect(() => {
    const elemento = gaveta.current
    if (elemento === null) return
    if (gavetaAberta && !elemento.open) elemento.showModal()
    if (!gavetaAberta && elemento.open) elemento.close()
  }, [gavetaAberta])

  const criacao = useMemo<CriacaoDeTreino>(
    () => ({
      abrir: (dia) => {
        if (dia !== undefined) setDiaSugerido(dia)
        setAberturas((anterior) => anterior + 1)
        setCriando(true)
      },
    }),
    [],
  )

  const salvarNovoTreino = useCallback(
    async (dados: Parameters<typeof criarDiaTreino>[0]) => {
      const criado = await criarDiaTreino(dados)
      setCriando(false)
      avisar(`Treino "${criado.nome}" criado.`)
      await recarregar()
      navegar(`/treinos/${criado.id}`)
    },
    [avisar, navegar, recarregar],
  )

  /** No celular o botão abre a gaveta; no desktop recolhe a barra. */
  function aoClicarMenu() {
    if (window.matchMedia('(min-width: 64rem)').matches) alternar()
    else setPedidoDeGaveta(localizacao.pathname)
  }

  return (
    <ContextoDeCriacao.Provider value={criacao}>
      <a className="pularParaConteudo" href="#conteudo">
        Pular para o conteúdo
      </a>

      <div className={`${estilos.casca} ${expandida ? '' : estilos.recolhida}`}>
        <aside id="barra-lateral" className={`${estilos.lateral} casca`} {...gatilhos}>
          <div className={estilos.conteudoLateral}>
            <div className={estilos.cabecalhoLateral}>
              <span className={estilos.logoExpandida}>
                <Logo variante="branca" altura={24} />
              </span>
              <span className={estilos.logoRecolhida}>
                <Simbolo tamanho={34} branco />
              </span>
              <button
                type="button"
                className={estilos.botaoAlternar}
                onClick={alternar}
                aria-expanded={expandida}
                aria-controls="barra-lateral"
                aria-label={expandida ? 'Recolher menu' : 'Expandir menu'}
                aria-keyshortcuts="Control+B"
                data-dica="Expandir menu (Ctrl+B)"
                title={expandida ? 'Recolher menu (Ctrl+B)' : undefined}
              >
                <PanelLeftClose className={estilos.iconeAlternar} size={16} aria-hidden="true" />
              </button>
            </div>

            <Navegacao
              treinos={treinos}
              situacao={estado.situacao}
              aoNovoTreino={() => criacao.abrir()}
              aoRecarregar={recarregar}
              recolhida={!expandida}
            />
          </div>
        </aside>

        {dica !== null ? (
          <div
            className={'centro' in dica ? `${estilos.dica} ${estilos.dicaCentralizada}` : estilos.dica}
            style={
              'centro' in dica
                ? { top: dica.centro, left: dica.esquerda }
                : { bottom: dica.base, left: dica.esquerda }
            }
            aria-hidden="true"
          >
            {dica.texto}
          </div>
        ) : null}

        <div className={estilos.area}>
          <header className={estilos.topo}>
            <div className={estilos.inicioTopo}>
              <button
                ref={botaoMenu}
                type="button"
                className={estilos.botaoMenu}
                onClick={aoClicarMenu}
                aria-label="Menu de navegação"
                aria-expanded={gavetaAberta || undefined}
              >
                <Menu size={20} aria-hidden="true" />
              </button>
              <span className={estilos.logoTopo}>
                <Simbolo tamanho={28} />
              </span>
              <p className={estilos.tituloTopo}>{tituloDaTela(localizacao.pathname, treinos)}</p>
            </div>
            <div className={estilos.acoesTopo}>
              <Botao
                variante="primaria"
                pequeno
                onClick={() => criacao.abrir()}
                iconeInicial={<Plus size={16} aria-hidden="true" />}
              >
                Novo treino
              </Botao>
            </div>
          </header>

          <main className={estilos.principal} id="conteudo" tabIndex={-1}>
            <div className={estilos.interno} key={localizacao.pathname}>
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      <dialog
        ref={gaveta}
        className={`${estilos.gaveta} casca`}
        aria-label="Menu de navegação"
        onClose={() => {
          setPedidoDeGaveta(null)
          botaoMenu.current?.focus()
        }}
        onClick={(evento) => {
          if (evento.target === gaveta.current) setPedidoDeGaveta(null)
        }}
      >
        <div className={estilos.conteudoLateral}>
          <div className={estilos.cabecalhoLateral}>
            <Logo variante="branca" altura={24} />
            <button
              type="button"
              className={estilos.botaoAlternar}
              aria-label="Fechar menu"
              onClick={() => setPedidoDeGaveta(null)}
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
          <Navegacao
            treinos={treinos}
            situacao={estado.situacao}
            aoNovoTreino={() => criacao.abrir()}
            aoNavegar={() => setPedidoDeGaveta(null)}
            aoRecarregar={recarregar}
          />
        </div>
      </dialog>

      <Modal
        aberto={criando}
        titulo="Novo treino"
        descricao="Escolha o dia da semana e dê um nome ao treino. Os exercícios entram depois."
        aoFechar={() => setCriando(false)}
      >
        <FormularioTreino
          key={`novo-treino-${aberturas}`}
          inicial={{ dia: diaSugerido, nome: '' }}
          rotuloEnviar="Criar treino"
          aoEnviar={salvarNovoTreino}
          aoCancelar={() => setCriando(false)}
        />
      </Modal>
    </ContextoDeCriacao.Provider>
  )
}

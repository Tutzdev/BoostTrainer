import { AlertTriangle, Check, Copy, RotateCw } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { mensagemAmigavel } from '../../api/erros.ts'
import { Botao } from './Botao.tsx'
import estilos from './Estados.module.css'

interface EstadoErroProps {
  erro: unknown
  aoTentarNovamente: () => void
  tentando?: boolean
}

export function EstadoErro({ erro, aoTentarNovamente, tentando = false }: EstadoErroProps) {
  const { titulo, descricao, detalheTecnico } = mensagemAmigavel(erro)
  const [copiado, setCopiado] = useState(false)
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null)

  const copiar = useCallback(async () => {
    if (detalheTecnico === null) return
    try {
      await navigator.clipboard.writeText(detalheTecnico)
      setCopiado(true)
      if (temporizador.current !== null) clearTimeout(temporizador.current)
      temporizador.current = setTimeout(() => setCopiado(false), 2000)
    } catch {
      // Clipboard indisponível
    }
  }, [detalheTecnico])

  return (
    <div className={`${estilos.painel} ${estilos.painelErro}`} role="alert">
      <AlertTriangle className={estilos.iconeErro} size={26} aria-hidden="true" />
      <div className={estilos.texto}>
        <h2>{titulo}</h2>
        <p>{descricao}</p>
      </div>
      <Botao
        variante="primaria"
        onClick={aoTentarNovamente}
        carregando={tentando}
        iconeInicial={<RotateCw size={16} aria-hidden="true" />}
      >
        {tentando ? 'Tentando…' : 'Tentar novamente'}
      </Botao>
      {detalheTecnico !== null ? (
        <details className={estilos.detalhes}>
          <summary className={estilos.resumoDetalhes}>Detalhes técnicos</summary>
          <div className={estilos.areaDetalhes}>
            <pre className={estilos.codigoDetalhes}>{detalheTecnico}</pre>
            <button
              type="button"
              className={estilos.botaoCopiar}
              onClick={() => void copiar()}
              aria-label={copiado ? 'Copiado' : 'Copiar detalhes técnicos'}
            >
              {copiado ? (
                <>
                  <Check size={13} aria-hidden="true" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy size={13} aria-hidden="true" />
                  Copiar
                </>
              )}
            </button>
          </div>
        </details>
      ) : null}
    </div>
  )
}

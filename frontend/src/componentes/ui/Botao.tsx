import { LoaderCircle } from 'lucide-react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import estilos from './Botao.module.css'

type Variante = 'primaria' | 'secundaria' | 'fantasma' | 'perigo' | 'perigoSuave'

interface BotaoProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  variante?: Variante
  pequeno?: boolean
  larguraTotal?: boolean
  /** Botão quadrado, apenas com ícone. Exige aria-label. */
  soIcone?: boolean
  /** Mantém o rótulo visível e bloqueia cliques durante o envio. */
  carregando?: boolean
  iconeInicial?: ReactNode
  children?: ReactNode
}

export function Botao({
  variante = 'secundaria',
  pequeno = false,
  larguraTotal = false,
  soIcone = false,
  carregando = false,
  iconeInicial,
  children,
  disabled,
  type = 'button',
  ...resto
}: BotaoProps) {
  const classes = [
    estilos.botao,
    estilos[variante],
    pequeno ? estilos.pequeno : '',
    larguraTotal ? estilos.larguraTotal : '',
    soIcone ? estilos.soIcone : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled === true || carregando}
      aria-busy={carregando || undefined}
      {...resto}
    >
      {carregando ? (
        <LoaderCircle className={estilos.girando} size={16} aria-hidden="true" />
      ) : (
        iconeInicial
      )}
      {children}
    </button>
  )
}

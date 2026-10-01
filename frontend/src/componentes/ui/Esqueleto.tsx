import estilos from './Estados.module.css'

interface EsqueletoProps {
  largura?: string
  altura?: string
  /** Atrasa o pulso de cada bloco para a área não piscar em bloco. */
  ordem?: number
}

/**
 * Bloco cinza do carregamento. Quem usa marca a região com aria-busy e
 * esconde os blocos dos leitores de tela — eles não são conteúdo.
 */
export function Esqueleto({ largura = '100%', altura = '1rem', ordem = 0 }: EsqueletoProps) {
  return (
    <span
      className={estilos.esqueleto}
      style={{
        display: 'block',
        width: largura,
        height: altura,
        animationDelay: `${ordem * 90}ms`,
      }}
    />
  )
}

type Variante = 'clara' | 'escura' | 'branca'

interface LogoProps {
  /**
   * clara: texto grafite, para fundo claro.
   * escura: texto off-white sobre o quadro grafite.
   * branca: sem fundo, para a barra lateral laranja.
   */
  variante?: Variante
  altura?: number
  /** Em contextos onde o nome já aparece ao lado, a imagem é decorativa. */
  decorativa?: boolean
}

const ARQUIVOS: Record<Variante, string> = {
  clara: '/branding/boost-trainer-logo.svg',
  escura: '/branding/boost-trainer-logo-dark.svg',
  branca: '/branding/boost-trainer-logo-branca.svg',
}

/**
 * Logo de `branding/`, copiada para `public/branding`.
 * O texto já está em curvas, então não depende de a fonte carregar.
 */
export function Logo({ variante = 'clara', altura = 26, decorativa = false }: LogoProps) {
  return (
    <img
      src={ARQUIVOS[variante]}
      alt={decorativa ? '' : 'Boost Trainer'}
      {...(decorativa ? { role: 'presentation' } : {})}
      width={(642 / 120) * altura}
      height={altura}
      style={{ height: altura, width: 'auto' }}
    />
  )
}

/** Só o símbolo das quatro barras, para a barra lateral recolhida. */
export function Simbolo({ tamanho = 28, branco = false }: { tamanho?: number; branco?: boolean }) {
  return (
    <img
      src={branco ? '/branding/boost-trainer-simbolo-branco.svg' : '/branding/boost-trainer-square-laranja.svg'}
      alt=""
      role="presentation"
      width={tamanho}
      height={tamanho}
      style={{ borderRadius: 'var(--raio-1)' }}
    />
  )
}

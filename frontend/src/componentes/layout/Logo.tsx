interface LogoProps {
  /** A versão escura tem o texto off-white, para a barra lateral grafite. */
  paraFundoEscuro?: boolean
  altura?: number
  /** Em contextos onde o nome já aparece ao lado, a imagem é decorativa. */
  decorativa?: boolean
}

/**
 * Logo de `branding/`, copiada para `public/branding` na íntegra.
 * O texto já está em curvas, então não depende de a fonte carregar.
 */
export function Logo({ paraFundoEscuro = false, altura = 26, decorativa = false }: LogoProps) {
  const arquivo = paraFundoEscuro
    ? '/branding/boost-trainer-logo-dark.svg'
    : '/branding/boost-trainer-logo.svg'

  return (
    <img
      src={arquivo}
      alt={decorativa ? '' : 'Boost Trainer'}
      {...(decorativa ? { role: 'presentation' } : {})}
      width={(642 / 120) * altura}
      height={altura}
      style={{ height: altura, width: 'auto' }}
    />
  )
}

/** Só o símbolo das quatro barras, para espaços estreitos. */
export function Simbolo({ tamanho = 28 }: { tamanho?: number }) {
  return (
    <img
      src="/branding/boost-trainer-square-laranja.svg"
      alt=""
      role="presentation"
      width={tamanho}
      height={tamanho}
      style={{ borderRadius: 'var(--raio-2)' }}
    />
  )
}

import { useEffect, useState, type RefObject } from 'react'

/**
 * Largura real do elemento, para desenhar o gráfico em pixels de verdade.
 * Um SVG com viewBox esticado também preencheria o espaço, mas escalaria o
 * texto junto: os rótulos ficariam minúsculos no celular.
 */
export function useLarguraDoElemento(referencia: RefObject<HTMLElement | null>): number {
  const [largura, setLargura] = useState(0)

  useEffect(() => {
    const elemento = referencia.current
    if (elemento === null) return

    const observador = new ResizeObserver((entradas) => {
      const entrada = entradas[0]
      if (entrada !== undefined) setLargura(entrada.contentRect.width)
    })

    observador.observe(elemento)
    return () => observador.disconnect()
  }, [referencia])

  return largura
}

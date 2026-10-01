import type { ReactNode } from 'react'
import estilos from './Estados.module.css'

interface EstadoVazioProps {
  titulo: string
  descricao: string
  acao?: ReactNode
}

export function EstadoVazio({ titulo, descricao, acao }: EstadoVazioProps) {
  return (
    <div className={estilos.painel}>
      <div className={estilos.marcaVazia} aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className={estilos.texto}>
        <h2>{titulo}</h2>
        <p>{descricao}</p>
      </div>
      {acao}
    </div>
  )
}

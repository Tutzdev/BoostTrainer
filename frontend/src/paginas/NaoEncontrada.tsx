import { useNavigate } from 'react-router-dom'
import { Botao } from '../componentes/ui/Botao.tsx'
import { EstadoVazio } from '../componentes/ui/EstadoVazio.tsx'

export function NaoEncontrada() {
  const navegar = useNavigate()

  return (
    <EstadoVazio
      titulo="Página não encontrada"
      descricao="O endereço digitado não corresponde a nenhuma tela do Boost Trainer. A visão geral tem a semana inteira e todos os treinos cadastrados."
      acao={
        <Botao variante="primaria" onClick={() => navegar('/')}>
          Ir para a visão geral
        </Botao>
      }
    />
  )
}

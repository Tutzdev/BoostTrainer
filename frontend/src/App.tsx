import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ProvedorDeTreinos } from './componentes/ProvedorDeTreinos.tsx'
import { Casca } from './componentes/layout/Casca.tsx'
import { ProvedorDeAvisos } from './componentes/ui/Avisos.tsx'
import { DetalheTreino } from './paginas/DetalheTreino.tsx'
import { NaoEncontrada } from './paginas/NaoEncontrada.tsx'
import { Painel } from './paginas/Painel.tsx'

export function App() {
  return (
    <ProvedorDeAvisos>
      <ProvedorDeTreinos>
        <BrowserRouter>
          <Routes>
            {/* A casca carrega a barra lateral e a lista da semana uma vez;
                as rotas filhas trocam só a área de conteúdo. */}
            <Route element={<Casca />}>
              <Route index element={<Painel />} />
              <Route path="treinos/:id" element={<DetalheTreino />} />
              <Route path="*" element={<NaoEncontrada />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ProvedorDeTreinos>
    </ProvedorDeAvisos>
  )
}

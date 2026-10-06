# Boost Trainer — frontend

Dashboard para montar e acompanhar treinos de academia. Consome a API Spring Boot
que está em [`../api`](../api).

Hierarquia dos dados: **dia de treino → exercícios → séries**.

## Como rodar

São dois processos: a API e o servidor de desenvolvimento do Vite.

```bash
# 1) backend, na raiz do repositório
cd api
./mvnw spring-boot:run

# 2) frontend, em outro terminal
cd frontend
npm install
npm run dev          # http://localhost:5173
```

O Vite encaminha `/api` para `http://localhost:8080`, então tudo roda na mesma
origem e a API não precisa de configuração de CORS.

### Se a porta 8080 estiver ocupada

Em máquinas com XAMPP, IIS ou outro servidor local, a 8080 costuma já estar em
uso e o Spring Boot falha com `Port 8080 was already in use`. Suba a API em outra
porta e aponte o proxy para ela:

```bash
cd api
./mvnw spring-boot:run -Dspring-boot.run.arguments=--server.port=8081
```

```ini
# frontend/.env.local  (não vai para o Git)
BOOST_API_URL=http://localhost:8081
```

## Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento com proxy para a API |
| `npm run build` | Checagem de tipos (`tsc -b`) e build de produção |
| `npm run lint` | oxlint |
| `npm test` | Testes do domínio no executor nativo do Node |
| `npm run verificar` | lint + tipos + testes + build, em sequência |
| `npm run preview` | Serve o build de produção |

O `preview` e o build **não** têm proxy: para servir o frontend construído, ou
publique o `dist/` atrás do mesmo host da API, ou habilite CORS no backend.

## Estrutura

```
src/
  api/          cliente tipado, endpoints e classes de erro — nada de fetch nos componentes
  dominio/      dias da semana, cálculo de volume e conversão dos campos numéricos
  hooks/        leitura de recursos com cancelamento, contextos de treinos e avisos
  componentes/
    layout/     casca, barra lateral, gaveta do celular e logo
    ui/         botão, campos, modal, confirmação, esqueleto, estados e avisos
    painel/     indicadores, grade da semana e gráfico
    treino/     formulários e lista de séries
  paginas/      Painel (/) e DetalheTreino (/treinos/:id)
  styles/       tokens.css (decisões visuais) e base.css (reset e utilitários)
```

Cada componente tem o seu CSS Module ao lado. Toda decisão de cor, espaçamento,
raio, duração e curva mora em `src/styles/tokens.css`.

## Dependências

Além de React e das ferramentas do Vite, só duas:

- **react-router-dom** — as rotas `/` e `/treinos/:id`.
- **lucide-react** — biblioteca de ícones com traço consistente.

Sem biblioteca de animação: o `<dialog>` nativo com `@starting-style` resolve
modal e gaveta, e o resto é CSS. Sem biblioteca de gráfico: o gráfico é SVG
desenhado no componente.

## Acessibilidade e movimento

- Foco visível em tudo que recebe teclado, com cor própria sobre a barra lateral laranja.
- Modal e gaveta usam `<dialog>` nativo: foco preso dentro, `Esc` fecha e o foco
  volta ao botão que abriu.
- Mensagens de erro ligadas ao campo por `aria-describedby` + `aria-invalid`.
- O gráfico tem uma tabela equivalente; nenhum valor depende só do gráfico, da
  cor ou do passar o mouse.
- `prefers-reduced-motion` zera as durações em `tokens.css` e desliga as
  entradas; o conteúdo nunca depende de uma animação para aparecer.

## Limitações conhecidas

- O banco da API é **H2 em memória**: ao reiniciar o backend, tudo é perdido.
- A API não guarda datas nem execuções, então **não existe histórico**. Os
  indicadores descrevem o plano montado, não progresso no tempo.
- Não há `GET` individual de exercício nem de série. Depois de qualquer mutação,
  o dia é relido inteiro com `GET /api/dias-treino/{id}`.
- O número da série é do backend (maior número existente + 1) e não é editável na
  interface. Excluir uma série do meio deixa lacuna na numeração, que é o
  comportamento do backend.

import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

/*
 * O backend Spring Boot roda em :8080. O proxy mantém tudo na mesma origem
 * em desenvolvimento, então não é preciso configurar CORS na API.
 *
 * BOOST_API_URL troca o alvo quando a 8080 não está livre (um Apache do
 * XAMPP, por exemplo, costuma ocupá-la). Pode vir do ambiente ou de um
 * arquivo .env.local na raiz do frontend:
 *
 *   BOOST_API_URL=http://localhost:8081
 *
 * e a API sobe na mesma porta com:
 *   ./mvnw spring-boot:run -Dspring-boot.run.arguments=--server.port=8081
 */
export default defineConfig(({ mode }) => {
  // Prefixo vazio: lê BOOST_API_URL do .env sem exigir o prefixo VITE_,
  // já que esta variável é usada só pelo servidor de desenvolvimento.
  const ambiente = loadEnv(mode, process.cwd(), '')
  const alvoDaApi = ambiente.BOOST_API_URL ?? 'http://localhost:8080'

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: alvoDaApi,
          changeOrigin: true,
        },
      },
    },
  }
})

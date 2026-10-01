import { ErroDaApi, ErroDeRede, ErroDeValidacao } from './erros.ts'

/** Em desenvolvimento o proxy do Vite encaminha /api para :8080. */
const BASE = '/api'

type CorpoDeErro = {
  status?: unknown
  /** Campo do GlobalExceptionHandler do projeto. */
  mensagem?: unknown
  campos?: unknown
  /** Campos do corpo de erro padrão do Spring, em falhas não tratadas. */
  message?: unknown
  error?: unknown
}

function ehObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null
}

/** O corpo de erro vem de fora, então é verificado antes de ser usado. */
function lerCamposInvalidos(bruto: unknown): Record<string, string> | null {
  if (!ehObjeto(bruto)) return null

  const campos: Record<string, string> = {}
  for (const [campo, mensagem] of Object.entries(bruto)) {
    if (typeof mensagem === 'string') campos[campo] = mensagem
  }
  return Object.keys(campos).length > 0 ? campos : null
}

async function lancarErroDaResposta(resposta: Response): Promise<never> {
  let corpo: CorpoDeErro = {}
  try {
    corpo = (await resposta.json()) as CorpoDeErro
  } catch {
    // Resposta sem JSON (502 de proxy, HTML de erro): fica a mensagem padrão.
  }

  // Uma falha não tratada pelo backend cai no corpo padrão do Spring, que
  // usa "message" em vez de "mensagem". Sem isso o erro chegaria à tela sem
  // nenhuma pista do que aconteceu.
  const mensagem =
    [corpo.mensagem, corpo.message, corpo.error].find(
      (candidato): candidato is string => typeof candidato === 'string' && candidato !== '',
    ) ?? `A API respondeu ${resposta.status}.`

  const campos = lerCamposInvalidos(corpo.campos)
  if (resposta.status === 400 && campos !== null) {
    throw new ErroDeValidacao(mensagem, campos)
  }

  throw new ErroDaApi(resposta.status, mensagem)
}

interface OpcoesDeRequisicao {
  metodo?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  corpo?: unknown
  sinal?: AbortSignal
}

/**
 * Único ponto de saída para a API. Converte qualquer falha em um dos erros
 * de `erros.ts` para que as telas não precisem inspecionar respostas.
 */
async function requisitar<T>(caminho: string, opcoes: OpcoesDeRequisicao = {}): Promise<T> {
  const { metodo = 'GET', corpo, sinal } = opcoes

  const configuracao: RequestInit = { method: metodo }
  if (corpo !== undefined) {
    configuracao.headers = { 'Content-Type': 'application/json' }
    configuracao.body = JSON.stringify(corpo)
  }
  if (sinal !== undefined) configuracao.signal = sinal

  let resposta: Response
  try {
    resposta = await fetch(`${BASE}${caminho}`, configuracao)
  } catch (causa) {
    // Um abort é cancelamento intencional e não deve virar estado de erro.
    if (causa instanceof DOMException && causa.name === 'AbortError') throw causa
    throw new ErroDeRede(causa)
  }

  if (!resposta.ok) await lancarErroDaResposta(resposta)

  // 204 das exclusões: não há corpo para ler.
  if (resposta.status === 204) return undefined as T

  return (await resposta.json()) as T
}

export { requisitar }

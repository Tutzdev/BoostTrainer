/**
 * Os três tipos de falha que a interface precisa distinguir.
 * O `GlobalExceptionHandler` do backend responde:
 *   404 -> { status, mensagem }
 *   400 -> { status, mensagem: 'Erro de validação', campos: { campo: mensagem } }
 */

/** Erro com resposta do servidor: há status HTTP e mensagem. */
export class ErroDaApi extends Error {
  readonly status: number

  constructor(status: number, mensagem: string) {
    super(mensagem)
    this.name = 'ErroDaApi'
    this.status = status
  }
}

/** 400 com o mapa de campos inválidos, para exibir junto de cada campo. */
/** O nome do campo vem do servidor, então a busca pode não achar nada. */
export type CamposInvalidos = Readonly<Partial<Record<string, string>>>

export class ErroDeValidacao extends ErroDaApi {
  readonly campos: CamposInvalidos

  constructor(mensagem: string, campos: Record<string, string>) {
    super(400, mensagem)
    this.name = 'ErroDeValidacao'
    this.campos = campos
  }
}

/** A requisição não chegou ao servidor: API desligada, rede fora ou CORS. */
export class ErroDeRede extends Error {
  constructor(causa?: unknown) {
    super('Não foi possível falar com a API.')
    this.name = 'ErroDeRede'
    this.cause = causa
  }
}

/** Mensagem pronta para a interface, qualquer que seja a origem da falha. */
export function mensagemDoErro(erro: unknown): string {
  if (erro instanceof ErroDeRede) {
    return 'Não foi possível falar com a API. Verifique se ela está rodando em http://localhost:8080.'
  }
  if (erro instanceof ErroDaApi) {
    return erro.message
  }
  if (erro instanceof Error && erro.message !== '') {
    return erro.message
  }
  return 'Algo deu errado. Tente novamente.'
}

export interface ErroAmigavel {
  titulo: string
  descricao: string
  detalheTecnico: string | null
}

export function mensagemAmigavel(erro: unknown): ErroAmigavel {
  if (erro instanceof ErroDeRede) {
    return {
      titulo: 'Não conseguimos falar com o servidor',
      descricao: 'Verifique se o backend está rodando e tente novamente.',
      detalheTecnico: erro.cause instanceof Error ? erro.cause.message : null,
    }
  }

  if (erro instanceof ErroDaApi) {
    if (erro.status === 404) {
      return {
        titulo: 'Não encontramos este recurso',
        descricao: 'Ele pode ter sido excluído ou o endereço está incorreto.',
        detalheTecnico: erro.message,
      }
    }

    if (erro.status >= 500) {
      return {
        titulo: 'O servidor encontrou um problema',
        descricao: 'Algo deu errado ao processar a requisição. Tente novamente em alguns instantes.',
        detalheTecnico: erro.message,
      }
    }

    return {
      titulo: 'Não foi possível completar a ação',
      descricao: erro.message,
      detalheTecnico: null,
    }
  }

  if (erro instanceof Error && erro.name === 'TimeoutError') {
    return {
      titulo: 'A requisição demorou demais',
      descricao: 'O servidor não respondeu a tempo. Verifique sua conexão e tente novamente.',
      detalheTecnico: erro.message,
    }
  }

  const mensagem = erro instanceof Error ? erro.message : String(erro)
  return {
    titulo: 'Algo deu errado',
    descricao: 'Um erro inesperado aconteceu. Tente novamente.',
    detalheTecnico: mensagem || null,
  }
}

/** Campos inválidos devolvidos pelo servidor, ou vazio se o erro for outro. */
export function camposInvalidos(erro: unknown): CamposInvalidos {
  return erro instanceof ErroDeValidacao ? erro.campos : {}
}

export function ehNaoEncontrado(erro: unknown): boolean {
  return erro instanceof ErroDaApi && erro.status === 404
}

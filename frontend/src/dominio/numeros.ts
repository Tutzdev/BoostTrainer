/**
 * Conversão dos campos numéricos. Em pt-BR as pessoas digitam "22,5", e
 * <input type="number"> rejeita a vírgula em parte dos navegadores — por isso
 * os campos são de texto com inputMode decimal e a conversão mora aqui.
 */

export type Convertido<T> = { ok: true; valor: T } | { ok: false; erro: string }

/** Repetições: inteiro obrigatório maior que zero, igual ao @Positive do DTO. */
export function lerRepeticoes(bruto: string): Convertido<number> {
  const texto = bruto.trim()
  if (texto === '') return { ok: false, erro: 'Informe quantas repetições.' }

  if (!/^\d+$/.test(texto)) {
    return { ok: false, erro: 'Use apenas números inteiros.' }
  }

  const valor = Number(texto)
  if (valor <= 0) return { ok: false, erro: 'As repetições devem ser maiores que zero.' }
  if (valor > 1000) return { ok: false, erro: 'Esse valor parece alto demais. Confira.' }

  return { ok: true, valor }
}

/** Carga: opcional, em kg, maior ou igual a zero (@PositiveOrZero no DTO). */
export function lerCarga(bruto: string): Convertido<number | null> {
  const texto = bruto.trim().replace(',', '.')
  if (texto === '') return { ok: true, valor: null }

  if (!/^\d+(\.\d{1,2})?$/.test(texto)) {
    return { ok: false, erro: 'Use um número em kg, como 22,5.' }
  }

  const valor = Number(texto)
  if (valor < 0) return { ok: false, erro: 'A carga não pode ser negativa.' }
  if (valor > 1000) return { ok: false, erro: 'Esse valor parece alto demais. Confira.' }

  return { ok: true, valor }
}

/** Devolve a carga ao campo no formato que a pessoa espera reeditar. */
export function cargaParaCampo(carga: number | null): string {
  return carga === null ? '' : String(carga).replace('.', ',')
}

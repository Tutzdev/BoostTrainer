import { DIAS_SEMANA, type DiaSemana } from '../api/tipos.ts'

/** A semana começa na segunda, como na grade da tela inicial. */
export const ORDEM_SEMANA: readonly DiaSemana[] = DIAS_SEMANA

const ROTULOS: Record<DiaSemana, { completo: string; curto: string }> = {
  SEGUNDA: { completo: 'Segunda', curto: 'Seg' },
  TERCA: { completo: 'Terça', curto: 'Ter' },
  QUARTA: { completo: 'Quarta', curto: 'Qua' },
  QUINTA: { completo: 'Quinta', curto: 'Qui' },
  SEXTA: { completo: 'Sexta', curto: 'Sex' },
  SABADO: { completo: 'Sábado', curto: 'Sáb' },
  DOMINGO: { completo: 'Domingo', curto: 'Dom' },
}

export function rotuloDoDia(dia: DiaSemana): string {
  return ROTULOS[dia].completo
}

export function rotuloCurtoDoDia(dia: DiaSemana): string {
  return ROTULOS[dia].curto
}

/** Qual dia a grade deve destacar como "hoje". */
export function diaDeHoje(agora: Date = new Date()): DiaSemana {
  // getDay(): 0 = domingo. ORDEM_SEMANA começa na segunda.
  const indice = (agora.getDay() + 6) % 7
  return ORDEM_SEMANA[indice] ?? 'SEGUNDA'
}

/** Converte texto de preço (pt-BR ou decimal simples) para centavos inteiros. */
export function brlInputToCents(s: string): number {
  const t = s.trim()
  if (!t) return 0
  const normalized = t.includes(',') ? t.replace(/\./g, '').replace(',', '.') : t
  const n = Math.round(parseFloat(normalized) * 100)
  return Number.isFinite(n) ? Math.max(0, n) : 0
}

export function centsToBrlInput(cents: number): string {
  return (cents / 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

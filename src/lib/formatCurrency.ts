const BRL = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export function formatCurrencyFromCents(cents: number): string {
  return BRL.format(cents / 100)
}

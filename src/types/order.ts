export type OrderLineSummary = {
  productId: string
  slug: string
  name: string
  quantity: number
  unitPriceCents: number
}

export type Order = {
  id: string
  createdAt: string
  subtotalCents: number
  lines: OrderLineSummary[]
  delivery: { cep: string; city: string; address: string }
  paymentMethod: 'card' | 'pix' | 'boleto'
}

const PAYMENT_LABELS: Record<Order['paymentMethod'], string> = {
  card: 'Cartão de crédito',
  pix: 'Pix',
  boleto: 'Boleto',
}

export function paymentMethodLabel(method: Order['paymentMethod']): string {
  return PAYMENT_LABELS[method]
}

import { randomUUID } from 'node:crypto'

import { findById } from './products-store.js'

export type OrderLine = {
  productId: string
  slug: string
  name: string
  quantity: number
  unitPriceCents: number
}

export type OrderRecord = {
  id: string
  createdAt: string
  subtotalCents: number
  lines: OrderLine[]
  delivery: { cep: string; city: string; address: string }
  paymentMethod: 'card' | 'pix' | 'boleto'
}

const orders = new Map<string, OrderRecord>()

function cepDigits(cep: string): string {
  return cep.replace(/\D/g, '')
}

export function validateDelivery(delivery: {
  cep: string
  city: string
  address: string
}): string | null {
  const cep = cepDigits(delivery.cep)
  const city = delivery.city.trim()
  const addr = delivery.address.trim()
  if (cep.length >= 8) return null
  if (city.length >= 2 && addr.length >= 5) return null
  return 'Informe um CEP com 8 dígitos ou preencha cidade e endereço (mín. 5 caracteres no endereço).'
}

export function createOrder(input: {
  lines: { productId: string; quantity: number }[]
  delivery: { cep: string; city: string; address: string }
  paymentMethod: 'card' | 'pix' | 'boleto'
}): OrderRecord | { error: string } {
  if (!input.lines.length) {
    return { error: 'Carrinho vazio.' }
  }

  const merged = new Map<string, number>()
  for (const raw of input.lines) {
    const q = Math.max(1, Math.floor(Number(raw.quantity)))
    merged.set(raw.productId, (merged.get(raw.productId) ?? 0) + q)
  }
  const normalizedLines = [...merged.entries()].map(([productId, quantity]) => ({
    productId,
    quantity,
  }))

  const msg = validateDelivery(input.delivery)
  if (msg) return { error: msg }

  if (!['card', 'pix', 'boleto'].includes(input.paymentMethod)) {
    return { error: 'Forma de pagamento inválida.' }
  }

  const lines: OrderLine[] = []
  let subtotalCents = 0

  for (const raw of normalizedLines) {
    const q = raw.quantity
    const p = findById(raw.productId)
    if (!p) {
      return { error: 'Um ou mais produtos não estão mais disponíveis.' }
    }
    lines.push({
      productId: p.id,
      slug: p.slug,
      name: p.name,
      quantity: q,
      unitPriceCents: p.priceCents,
    })
    subtotalCents += p.priceCents * q
  }

  const id = randomUUID()
  const createdAt = new Date().toISOString()
  const record: OrderRecord = {
    id,
    createdAt,
    subtotalCents,
    lines,
    delivery: {
      cep: input.delivery.cep.trim(),
      city: input.delivery.city.trim(),
      address: input.delivery.address.trim(),
    },
    paymentMethod: input.paymentMethod,
  }
  orders.set(id, record)
  return record
}

export function getOrder(id: string): OrderRecord | undefined {
  return orders.get(id)
}

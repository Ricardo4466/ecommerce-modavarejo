import type { CartLine } from '@/types'

export function normalizeQuantity(q: number): number {
  if (!Number.isFinite(q)) return 1
  return Math.max(1, Math.floor(q))
}

function isCartLineRecord(value: object): value is CartLine {
  const o = value as Record<string, unknown>
  return typeof o.productId === 'string' && typeof o.quantity === 'number'
}

export function parseLegacyCartLines(raw: unknown): CartLine[] {
  if (!Array.isArray(raw)) return []
  return raw.filter(
    (l): l is CartLine =>
      typeof l === 'object' && l !== null && isCartLineRecord(l),
  )
}

export function normalizeCartLines(lines: CartLine[]): CartLine[] {
  return lines.map((l) => ({
    productId: l.productId,
    quantity: normalizeQuantity(l.quantity),
  }))
}

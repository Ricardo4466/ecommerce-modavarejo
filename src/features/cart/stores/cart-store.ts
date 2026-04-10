import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type { CartLine } from '@/types'

import {
  normalizeCartLines,
  normalizeQuantity,
  parseLegacyCartLines,
} from '@/features/cart/lib/cart-logic'

const STORAGE_KEY = 'ecommerce-modavarejo:cart'

type CartState = {
  lines: CartLine[]
  addItem: (productId: string, quantity?: number) => void
  setQuantity: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  clear: () => void
}

function addOrIncrement(lines: CartLine[], productId: string, quantity: number): CartLine[] {
  const next = lines.map((l) => ({ ...l }))
  const i = next.findIndex((l) => l.productId === productId)
  const n = normalizeQuantity(quantity)
  if (i === -1) {
    next.push({ productId, quantity: n })
  } else {
    const line = next[i]!
    line.quantity = normalizeQuantity(line.quantity + n)
  }
  return normalizeCartLines(next)
}

function updateQuantity(lines: CartLine[], productId: string, quantity: number): CartLine[] {
  const next = lines.map((l) => ({ ...l }))
  const i = next.findIndex((l) => l.productId === productId)
  if (i === -1) return next
  if (quantity < 1) {
    next.splice(i, 1)
  } else {
    next[i]!.quantity = normalizeQuantity(quantity)
  }
  return normalizeCartLines(next)
}

function migrateRawStorage(raw: string | null): string | null {
  if (raw == null) return null
  try {
    const parsed = JSON.parse(raw) as unknown
    if (Array.isArray(parsed)) {
      const lines = normalizeCartLines(parseLegacyCartLines(parsed))
      return JSON.stringify({ state: { lines }, version: 0 })
    }
  } catch {
    return raw
  }
  return raw
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      addItem: (productId, quantity = 1) =>
        set((s) => ({ lines: addOrIncrement(s.lines, productId, quantity) })),
      setQuantity: (productId, quantity) =>
        set((s) => ({ lines: updateQuantity(s.lines, productId, quantity) })),
      removeItem: (productId) =>
        set((s) => ({ lines: s.lines.filter((l) => l.productId !== productId) })),
      clear: () => set({ lines: [] }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => ({
        getItem: (name) => migrateRawStorage(localStorage.getItem(name)),
        setItem: (name, value) => localStorage.setItem(name, value),
        removeItem: (name) => localStorage.removeItem(name),
      })),
      partialize: (s) => ({ lines: s.lines }),
    },
  ),
)

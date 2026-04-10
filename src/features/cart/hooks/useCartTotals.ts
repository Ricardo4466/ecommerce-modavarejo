import { useEffect, useMemo, useRef, useState } from 'react'

import type { CartLine } from '@/types'
import { productService } from '@/features/products/services/product.service'

type CartTotalsState = {
  subtotalCents: number
  isLoading: boolean
}

type LoadedTotals = {
  linesKey: string
  subtotalCents: number
}

function cartLinesKey(lines: CartLine[]): string {
  return lines.map((l) => `${l.productId}:${l.quantity}`).join('|')
}

export function useCartTotals(lines: CartLine[]): CartTotalsState {
  const linesRef = useRef(lines)

  const linesKey = useMemo(() => cartLinesKey(lines), [lines])

  const [loaded, setLoaded] = useState<LoadedTotals | null>(null)

  useEffect(() => {
    linesRef.current = lines
  }, [lines])

  useEffect(() => {
    const snapshot = linesRef.current
    if (snapshot.length === 0) {
      return
    }

    let cancelled = false

    Promise.all(
      snapshot.map((l) =>
        productService
          .getById(l.productId)
          .then((p) => ({ line: l, product: p }))
          .catch(() => ({ line: l, product: null })),
      ),
    ).then((rows) => {
      if (cancelled) return
      const subtotalCents = rows.reduce((acc, { line, product }) => {
        if (!product) return acc
        return acc + product.priceCents * line.quantity
      }, 0)
      setLoaded({ linesKey, subtotalCents })
    })

    return () => {
      cancelled = true
    }
  }, [linesKey])

  if (lines.length === 0) {
    return { subtotalCents: 0, isLoading: false }
  }

  if (loaded === null || loaded.linesKey !== linesKey) {
    return { subtotalCents: 0, isLoading: true }
  }

  return { subtotalCents: loaded.subtotalCents, isLoading: false }
}

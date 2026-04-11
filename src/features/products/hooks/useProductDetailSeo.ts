import { useEffect } from 'react'

import type { Product } from '@/types'

function truncateMeta(text: string, max: number): string {
  const normalized = text.replace(/\s+/g, ' ').trim()
  if (normalized.length <= max) return normalized
  return `${normalized.slice(0, max - 1).trimEnd()}…`
}

export function useProductDetailSeo(product: Product | undefined) {
  useEffect(() => {
    if (!product) return

    const prevTitle = document.title
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const prevDescription = meta?.content ?? ''

    document.title = `${product.name} · ${product.brand} | StyleWare`
    if (meta) {
      const desc = (product.longDescription ?? product.description).replace(/\s+/g, ' ').trim()
      meta.content = truncateMeta(desc, 158)
    }

    return () => {
      document.title = prevTitle
      if (meta) meta.content = prevDescription
    }
  }, [product])
}

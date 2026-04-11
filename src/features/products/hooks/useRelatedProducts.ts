import { useEffect, useState } from 'react'

import { productService } from '@/features/products/services/product.service'
import type { Product } from '@/types'

export function useRelatedProducts(slug: string | undefined) {
  const [data, setData] = useState<Product[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!slug?.trim()) {
      setData([])
      setError(null)
      setIsLoading(false)
      return
    }

    let cancelled = false
    setIsLoading(true)
    setError(null)

    void productService
      .getRelatedBySlug(slug, 4)
      .then((items) => {
        if (!cancelled) setData(items)
      })
      .catch(() => {
        if (!cancelled) {
          setData([])
          setError('Não foi possível carregar produtos relacionados.')
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [slug])

  return { data, error, isLoading }
}

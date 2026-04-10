import { useEffect, useState } from 'react'

import type { Product } from '@/types'
import {
  fetchProductListing,
} from '@/features/products/services/product.service'
import type { ListingFilters } from '@/features/products/lib/apply-listing-filters'

export function useProductListing(filters: ListingFilters) {
  const { category, brandSlug, sort, condition, query } = filters
  const [data, setData] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    setIsLoading(true)
    setError(null)

    const payload: ListingFilters = { category, brandSlug, sort, condition, query }

    void fetchProductListing(payload)
      .then((next) => {
        if (!cancelled) {
          setData(next)
          setIsLoading(false)
          setError(null)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Não foi possível carregar a listagem.')
          setIsLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [category, brandSlug, sort, condition, query])

  return { data, isLoading, error }
}

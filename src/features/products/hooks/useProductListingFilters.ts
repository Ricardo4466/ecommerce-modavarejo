import { useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'

import type { ListingFilters } from '@/features/products/lib/apply-listing-filters'
import { useListingFiltersStore } from '@/features/products/stores/listing-filters-store'

export function useProductListingFilters(): {
  filters: ListingFilters
  resetFilters: () => void
} {
  const { category, brandSlug, sort, condition, query, resetFilters } = useListingFiltersStore(
    useShallow((s) => ({
      category: s.category,
      brandSlug: s.brandSlug,
      sort: s.sort,
      condition: s.condition,
      query: s.query,
      resetFilters: s.resetFilters,
    })),
  )

  const filters = useMemo<ListingFilters>(
    () => ({
      category,
      brandSlug,
      sort,
      condition,
      query,
    }),
    [category, brandSlug, sort, condition, query],
  )

  return { filters, resetFilters }
}

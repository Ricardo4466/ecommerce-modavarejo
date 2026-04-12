import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { ProductCategory, ProductCondition } from '@/types'

import { createOptionalLocalStorage } from '@/lib/optional-local-storage'

import type { SortOption } from '@/features/products/lib/apply-listing-filters'
import type { ListingFiltersSnapshot } from '@/features/products/lib/listing-search-params'

type ListingFiltersState = {
  category: ProductCategory | ''
  brandSlug: string
  sort: SortOption
  condition: ProductCondition | ''
  query: string
  setCategory: (v: ProductCategory | '') => void
  setBrandSlug: (v: string) => void
  setSort: (v: SortOption) => void
  setCondition: (v: ProductCondition | '') => void
  setQuery: (v: string) => void
  /** Atualiza todos os filtros de uma vez (ex.: hidratar da URL). */
  replaceListingFilters: (next: ListingFiltersSnapshot) => void
  resetFilters: () => void
}

const defaults = {
  category: '' as ProductCategory | '',
  brandSlug: '',
  sort: 'name-asc' as SortOption,
  condition: '' as ProductCondition | '',
  query: '',
}

export const useListingFiltersStore = create<ListingFiltersState>()(
  persist(
    (set) => ({
      ...defaults,
      setCategory: (category) => set({ category }),
      setBrandSlug: (brandSlug) => set({ brandSlug }),
      setSort: (sort) => set({ sort }),
      setCondition: (condition) => set({ condition }),
      setQuery: (query) => set({ query }),
      replaceListingFilters: (next) =>
        set({
          category: next.category,
          brandSlug: next.brandSlug,
          sort: next.sort,
          condition: next.condition,
          query: next.query,
        }),
      resetFilters: () => set(defaults),
    }),
    {
      name: 'ecommerce-modavarejo:plp-filters',
      storage: createOptionalLocalStorage(),
      partialize: (s) => ({
        category: s.category,
        brandSlug: s.brandSlug,
        sort: s.sort,
        condition: s.condition,
        query: s.query,
      }),
    },
  ),
)

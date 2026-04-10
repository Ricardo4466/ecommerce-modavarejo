import { describe, expect, it, beforeEach } from 'vitest'

import { EMPTY_LISTING_FILTERS } from '@/features/products/lib/listing-search-params'

import { useListingFiltersStore } from './listing-filters-store'

describe('listing-filters-store', () => {
  beforeEach(() => {
    useListingFiltersStore.getState().resetFilters()
  })

  it('replaceListingFilters atualiza o snapshot completo', () => {
    useListingFiltersStore.getState().replaceListingFilters({
      category: 'feminino',
      brandSlug: 'marca-teste',
      sort: 'price-desc',
      condition: 'novo',
      query: 'teste',
    })
    const s = useListingFiltersStore.getState()
    expect(s.category).toBe('feminino')
    expect(s.brandSlug).toBe('marca-teste')
    expect(s.sort).toBe('price-desc')
    expect(s.condition).toBe('novo')
    expect(s.query).toBe('teste')
  })

  it('resetFilters volta ao estado inicial', () => {
    useListingFiltersStore.getState().replaceListingFilters({
      ...EMPTY_LISTING_FILTERS,
      category: 'acessorios',
    })
    useListingFiltersStore.getState().resetFilters()
    const s = useListingFiltersStore.getState()
    expect(s.category).toBe('')
    expect(s.sort).toBe('name-asc')
    expect(s.condition).toBe('')
    expect(s.query).toBe('')
  })
})

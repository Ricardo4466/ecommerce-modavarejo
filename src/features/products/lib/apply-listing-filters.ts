import type { Product, ProductCategory, ProductCondition } from '@/types'

export type SortOption = 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc'

/** PLP: categoria, marca, ordenação, condição; `query` mapeia para `q` na API (não aplicado aqui). */
export type ListingFilters = {
  category: ProductCategory | ''
  brandSlug: string
  sort: SortOption
  condition: ProductCondition | ''
  /** Busca textual; enviada como `q` na query HTTP. */
  query: string
}

export function applyListingFilters(products: Product[], filters: ListingFilters): Product[] {
  let list = [...products]

  if (filters.category) {
    list = list.filter((p) => p.category === filters.category)
  }

  if (filters.brandSlug) {
    list = list.filter((p) => p.brandSlug === filters.brandSlug)
  }

  if (filters.condition) {
    list = list.filter((p) => p.condition === filters.condition)
  }

  switch (filters.sort) {
    case 'price-asc':
      return list.sort((a, b) => a.priceCents - b.priceCents)
    case 'price-desc':
      return list.sort((a, b) => b.priceCents - a.priceCents)
    case 'name-asc':
      return list.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
    case 'name-desc':
      return list.sort((a, b) => b.name.localeCompare(a.name, 'pt-BR'))
    default:
      return list
  }
}

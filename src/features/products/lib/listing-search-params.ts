import type { ProductCategory, ProductCondition } from '@/types'

import type { SortOption } from '@/features/products/lib/apply-listing-filters'

const SORT_VALUES: SortOption[] = ['price-asc', 'price-desc', 'name-asc', 'name-desc']

export type ListingFiltersSnapshot = {
  category: ProductCategory | ''
  brandSlug: string
  sort: SortOption
  condition: ProductCondition | ''
  query: string
}

/** Estado “limpo” da PLP (também usado ao voltar o histórico para `/` sem query). */
export const EMPTY_LISTING_FILTERS: ListingFiltersSnapshot = {
  category: '',
  brandSlug: '',
  sort: 'name-asc',
  condition: '',
  query: '',
}

function isProductCategory(value: string): value is ProductCategory {
  return value === 'masculino' || value === 'feminino' || value === 'acessorios'
}

function isSortOption(value: string): value is SortOption {
  return SORT_VALUES.includes(value as SortOption)
}

function isProductCondition(value: string): value is ProductCondition {
  return value === 'novo' || value === 'usado' || value === 'excelente'
}

/** Há intenção explícita de filtro na URL (qualquer chave conhecida com valor não vazio). */
export function hasListingSearchIntent(searchParams: URLSearchParams): boolean {
  const keys = ['category', 'brand', 'sort', 'q', 'condition'] as const
  return keys.some((key) => {
    const value = searchParams.get(key)
    return value != null && value !== ''
  })
}

export function parseListingSearchParams(searchParams: URLSearchParams): ListingFiltersSnapshot {
  const defaults: ListingFiltersSnapshot = {
    category: '',
    brandSlug: '',
    sort: 'name-asc',
    condition: '',
    query: '',
  }
  const rawCategory = searchParams.get('category') ?? ''
  const category = isProductCategory(rawCategory) ? rawCategory : ''

  const brandSlug = (searchParams.get('brand') ?? '').trim()

  const rawSort = searchParams.get('sort') ?? ''
  const sort = isSortOption(rawSort) ? rawSort : defaults.sort

  const rawCondition = (searchParams.get('condition') ?? '').trim()
  const condition = isProductCondition(rawCondition) ? rawCondition : ''

  const query = (searchParams.get('q') ?? '').trim()

  return { category, brandSlug, sort, condition, query }
}

/** Monta query string omitindo valores padrão (URL mais limpa). */
export function buildListingSearchParams(filters: ListingFiltersSnapshot): URLSearchParams {
  const params = new URLSearchParams()
  if (filters.category) params.set('category', filters.category)
  if (filters.brandSlug) params.set('brand', filters.brandSlug)
  if (filters.sort !== 'name-asc') params.set('sort', filters.sort)
  if (filters.condition) params.set('condition', filters.condition)
  if (filters.query.trim()) params.set('q', filters.query.trim())
  return params
}

export function listingSnapshotsEqual(a: ListingFiltersSnapshot, b: ListingFiltersSnapshot): boolean {
  return (
    a.category === b.category &&
    a.brandSlug === b.brandSlug &&
    a.sort === b.sort &&
    a.condition === b.condition &&
    a.query.trim() === b.query.trim()
  )
}

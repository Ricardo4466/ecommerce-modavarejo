import { describe, expect, it } from 'vitest'

import type { Product } from '@/types'

import { applyListingFilters, type ListingFilters } from './apply-listing-filters'

const baseProduct = (overrides: Partial<Product> & Pick<Product, 'id' | 'slug' | 'name'>): Product => ({
  id: overrides.id,
  slug: overrides.slug,
  name: overrides.name,
  description: overrides.description ?? '',
  priceCents: overrides.priceCents ?? 10_000,
  category: overrides.category ?? 'masculino',
  condition: overrides.condition ?? 'novo',
  imageUrl: overrides.imageUrl ?? 'https://example.com/p.jpg',
  stock: overrides.stock ?? 1,
  rating: overrides.rating ?? 4,
  reviewCount: overrides.reviewCount ?? 10,
  brand: overrides.brand ?? 'Marca',
  brandSlug: overrides.brandSlug ?? 'marca',
  specifications: overrides.specifications ?? [],
})

const catalog: Product[] = [
  baseProduct({
    id: '1',
    slug: 'a',
    name: 'Camiseta',
    priceCents: 50_000,
    category: 'masculino',
    brandSlug: 'marca-x',
  }),
  baseProduct({
    id: '2',
    slug: 'b',
    name: 'Bolsa',
    priceCents: 120_000,
    category: 'feminino',
    brandSlug: 'marca-y',
    condition: 'usado',
  }),
  baseProduct({
    id: '3',
    slug: 'c',
    name: 'Cinto',
    priceCents: 30_000,
    category: 'acessorios',
    brandSlug: 'marca-x',
    condition: 'excelente',
  }),
]

const emptyFilters = (): ListingFilters => ({
  category: '',
  brandSlug: '',
  sort: 'name-asc',
  condition: '',
  query: '',
})

describe('applyListingFilters', () => {
  it('filtra por categoria e marca', () => {
    const filters: ListingFilters = { ...emptyFilters(), category: 'feminino', brandSlug: 'marca-y' }
    const result = applyListingFilters(catalog, filters)
    expect(result).toHaveLength(1)
    expect(result[0].slug).toBe('b')
  })

  it('ordena por preço ascendente', () => {
    const filters: ListingFilters = { ...emptyFilters(), sort: 'price-asc' }
    const result = applyListingFilters(catalog, filters)
    expect(result.map((p) => p.slug)).toEqual(['c', 'a', 'b'])
  })

  it('filtra por condição comercial', () => {
    const filters: ListingFilters = { ...emptyFilters(), condition: 'usado' }
    const result = applyListingFilters(catalog, filters)
    expect(result).toHaveLength(1)
    expect(result[0].slug).toBe('b')
  })

})

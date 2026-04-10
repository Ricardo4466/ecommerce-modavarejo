import { httpGet, isHttpError } from '@/lib/http/client'
import type { Product, ProductCategory } from '@/types'
import type { ListingFilters } from '@/features/products/lib/apply-listing-filters'

/** Monta query da PLP (mesma semântica que a URL do front). */
function listingsQuery(filters: ListingFilters): string {
  const params = new URLSearchParams()
  if (filters.category) params.set('category', filters.category)
  if (filters.brandSlug) params.set('brand', filters.brandSlug)
  params.set('sort', filters.sort)
  if (filters.condition) params.set('condition', filters.condition)
  if (filters.query.trim()) params.set('q', filters.query.trim())
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

export async function fetchProductListing(filters: ListingFilters): Promise<Product[]> {
  const { items } = await httpGet<{ items: Product[] }>(`/api/products${listingsQuery(filters)}`)
  return items
}

/**
 * Camada de produtos via API REST (`/api`). Em dev o Vite encaminha `/api` para o servidor em `server/`.
 */
export const productService = {
  async list(filters?: { category?: ProductCategory; query?: string }): Promise<Product[]> {
    const params = new URLSearchParams()
    if (filters?.category) params.set('category', filters.category)
    if (filters?.query?.trim()) params.set('q', filters.query.trim())
    const qs = params.toString()
    const { items } = await httpGet<{ items: Product[] }>(`/api/products${qs ? `?${qs}` : ''}`)
    return items
  },

  async getBySlug(slug: string): Promise<Product | null> {
    try {
      return await httpGet<Product>(`/api/products/${encodeURIComponent(slug)}`)
    } catch (e) {
      if (isHttpError(e) && e.status === 404) return null
      throw e
    }
  },

  async getById(id: string): Promise<Product | null> {
    try {
      return await httpGet<Product>(`/api/product/${encodeURIComponent(id)}`)
    } catch (e) {
      if (isHttpError(e) && e.status === 404) return null
      throw e
    }
  },
}

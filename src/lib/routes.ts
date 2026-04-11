import type { ProductCategory } from '@/types'

export const ROUTES = {
  home: '/',
  product: (slug: string) => `/produto/${slug}`,
  cart: '/carrinho',
  checkout: '/checkout',
  order: (orderId: string) => `/pedido/${orderId}`,
  favorites: '/favoritos',
  admin: '/admin',
  adminNew: '/admin/novo',
  adminEdit: (id: string) => `/admin/editar/${id}`,
} as const

/** Monta URL da PLP com filtros (ex.: categoria para breadcrumbs). */
export function buildProductListingHref(filters: {
  category?: ProductCategory | ''
  brandSlug?: string
}): string {
  const params = new URLSearchParams()
  if (filters.category) params.set('category', filters.category)
  if (filters.brandSlug) params.set('brand', filters.brandSlug)
  const qs = params.toString()
  return qs ? `${ROUTES.home}?${qs}` : ROUTES.home
}

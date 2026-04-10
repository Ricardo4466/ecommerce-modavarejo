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

export type ProductCategory = 'masculino' | 'feminino' | 'acessorios'

export type ProductCondition = 'novo' | 'usado' | 'excelente'

export type ProductSpecification = {
  label: string
  value: string
}

export type Product = {
  id: string
  slug: string
  name: string
  description: string
  priceCents: number
  category: ProductCategory
  /** Condição comercial para vitrine e filtros */
  condition: ProductCondition
  imageUrl: string
  stock: number
  /** Nota média 0–5 */
  rating: number
  /** Quantidade de avaliações (exibição) */
  reviewCount: number
  /** Marca para filtros na PLP */
  brand: string
  brandSlug: string
  /** Fotos extras na PDP; se vazio/omitido, usa só `imageUrl` */
  galleryUrls?: string[]
  specifications: ProductSpecification[]
}

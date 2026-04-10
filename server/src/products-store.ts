import type { Product } from '../../src/types/product.js'
import { PLP_MOCK_PRODUCTS } from '../../src/features/products/mock/plp-mock.js'
import { slugify } from '../../src/lib/slugify.js'

let products: Product[] = PLP_MOCK_PRODUCTS.map((p) => structuredClone(p))

export function getProducts(): Product[] {
  return products
}

export function findById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export function findBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export function addProduct(product: Product): void {
  products.push(product)
}

export function replaceProduct(id: string, next: Product): boolean {
  const i = products.findIndex((p) => p.id === id)
  if (i === -1) return false
  products[i] = next
  return true
}

export function removeProduct(id: string): boolean {
  const i = products.findIndex((p) => p.id === id)
  if (i === -1) return false
  products.splice(i, 1)
  return true
}

/** Garante slug único no catálogo; `exceptId` permite manter o mesmo slug na edição. */
export function ensureUniqueSlug(base: string, exceptId?: string): string {
  let s = slugify(base)
  if (!s) s = 'item'
  let candidate = s
  let n = 1
  while (true) {
    const found = findBySlug(candidate)
    if (!found || found.id === exceptId) return candidate
    n += 1
    candidate = `${s}-${n}`
  }
}

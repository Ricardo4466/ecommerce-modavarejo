import { randomUUID } from 'node:crypto'

import cors from 'cors'
import express from 'express'

import { applyListingFilters } from '../../src/features/products/lib/apply-listing-filters.js'
import type { ListingFilters } from '../../src/features/products/lib/apply-listing-filters.js'
import { parseListingSearchParams } from '../../src/features/products/lib/listing-search-params.js'
import { slugify } from '../../src/lib/slugify.js'
import type { Product, ProductCategory, ProductCondition, ProductSpecification } from '../../src/types/product.js'
import {
  addProduct,
  ensureUniqueSlug,
  findById,
  findBySlug,
  getProducts,
  removeProduct,
  replaceProduct,
} from './products-store.js'
import { createOrder, getOrder } from './orders-store.js'

const PORT = Number(process.env.PORT) || 3001

const app = express()

app.use(cors({ origin: true }))
app.use(express.json({ limit: '512kb' }))

function queryToSearchParams(query: express.Request['query']): URLSearchParams {
  const params = new URLSearchParams()
  for (const [key, raw] of Object.entries(query)) {
    if (typeof raw === 'string' && raw !== '') {
      params.set(key, raw)
    } else if (Array.isArray(raw) && typeof raw[0] === 'string') {
      params.set(key, raw[0])
    }
  }
  return params
}

function isCategory(x: unknown): x is ProductCategory {
  return x === 'masculino' || x === 'feminino' || x === 'acessorios'
}

function isCondition(x: unknown): x is ProductCondition {
  return x === 'novo' || x === 'usado' || x === 'excelente'
}

function parseSpecs(raw: unknown): ProductSpecification[] {
  if (!Array.isArray(raw)) return []
  return raw
    .filter((x): x is { label?: unknown; value?: unknown } => typeof x === 'object' && x !== null)
    .map((x) => ({
      label: String(x.label ?? '').trim() || '—',
      value: String(x.value ?? '').trim() || '—',
    }))
}

function parseOptionalLongDescription(raw: unknown): string | undefined {
  if (raw == null) return undefined
  const s = String(raw).trim()
  return s.length > 0 ? s : undefined
}

function parseOptionalCompareAtPriceCents(raw: unknown): number | undefined {
  if (raw == null || raw === '') return undefined
  const n = Math.round(Number(raw))
  if (!Number.isFinite(n) || n < 0) return undefined
  return n
}

function parseGallery(raw: unknown): string[] | undefined {
  if (raw == null) return undefined
  if (Array.isArray(raw)) {
    const urls = raw.map((u) => String(u).trim()).filter(Boolean)
    return urls.length ? urls : undefined
  }
  if (typeof raw === 'string') {
    const urls = raw
      .split(/[\n,]/)
      .map((u) => u.trim())
      .filter(Boolean)
    return urls.length ? urls : undefined
  }
  return undefined
}

function parseBodyToProductInput(body: unknown): Omit<Product, 'id' | 'slug' | 'brandSlug'> & {
  slug?: string
} | null {
  if (typeof body !== 'object' || body === null) return null
  const b = body as Record<string, unknown>
  const name = String(b.name ?? '').trim()
  const description = String(b.description ?? '').trim()
  const brand = String(b.brand ?? '').trim()
  const imageUrl = String(b.imageUrl ?? '').trim()
  if (!name || !brand) return null
  if (!isCategory(b.category)) return null
  if (!isCondition(b.condition)) return null

  const priceCents = Math.round(Number(b.priceCents))
  if (!Number.isFinite(priceCents) || priceCents < 0) return null

  const stock = Math.max(0, Math.floor(Number(b.stock)))
  const rating = Math.min(5, Math.max(0, Number(b.rating)))
  const reviewCount = Math.max(0, Math.floor(Number(b.reviewCount)))

  const longDescription = parseOptionalLongDescription(b.longDescription)
  const compareAtPriceCents = parseOptionalCompareAtPriceCents(b.compareAtPriceCents)

  return {
    name,
    description,
    longDescription,
    priceCents,
    compareAtPriceCents,
    category: b.category,
    condition: b.condition,
    brand,
    slug: typeof b.slug === 'string' ? b.slug.trim() : undefined,
    imageUrl,
    galleryUrls: parseGallery(b.galleryUrls),
    stock: Number.isFinite(stock) ? stock : 0,
    rating: Number.isFinite(rating) ? rating : 0,
    reviewCount: Number.isFinite(reviewCount) ? reviewCount : 0,
    specifications: parseSpecs(b.specifications),
  }
}

app.get('/api/brands', (_req, res) => {
  const map = new Map<string, string>()
  for (const p of getProducts()) {
    map.set(p.brandSlug, p.brand)
  }
  const items = [...map.entries()]
    .sort((a, b) => a[1].localeCompare(b[1], 'pt-BR'))
    .map(([value, label]) => ({ value, label }))
  res.json({ items })
})

app.get('/api/products', (req, res) => {
  const params = queryToSearchParams(req.query)
  const snapshot = parseListingSearchParams(params)

  const filters: ListingFilters = {
    category: snapshot.category,
    brandSlug: snapshot.brandSlug,
    sort: snapshot.sort,
    condition: snapshot.condition,
    query: snapshot.query,
  }

  let items = applyListingFilters(getProducts(), filters)
  const q = snapshot.query.trim().toLowerCase()
  if (q) {
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
    )
  }

  res.json({ items })
})

app.post('/api/products', (req, res) => {
  const parsed = parseBodyToProductInput(req.body)
  if (!parsed) {
    res.status(400).json({ message: 'Dados do produto inválidos.' })
    return
  }

  const brandSlug = slugify(parsed.brand)
  if (!brandSlug) {
    res.status(400).json({ message: 'Marca inválida para gerar identificador.' })
    return
  }

  const slug = ensureUniqueSlug(parsed.slug || parsed.name, undefined)
  const id = randomUUID()

  const product: Product = {
    id,
    slug,
    brandSlug,
    name: parsed.name,
    description: parsed.description,
    ...(parsed.longDescription != null ? { longDescription: parsed.longDescription } : {}),
    priceCents: parsed.priceCents,
    ...(parsed.compareAtPriceCents != null ? { compareAtPriceCents: parsed.compareAtPriceCents } : {}),
    category: parsed.category,
    condition: parsed.condition,
    brand: parsed.brand,
    imageUrl: parsed.imageUrl,
    galleryUrls: parsed.galleryUrls,
    stock: parsed.stock,
    rating: parsed.rating,
    reviewCount: parsed.reviewCount,
    specifications: parsed.specifications,
  }

  addProduct(product)
  res.status(201).json(product)
})

app.put('/api/product/:id', (req, res) => {
  const existing = findById(req.params.id)
  if (!existing) {
    res.status(404).json({ message: 'Produto não encontrado.' })
    return
  }

  const parsed = parseBodyToProductInput(req.body)
  if (!parsed) {
    res.status(400).json({ message: 'Dados do produto inválidos.' })
    return
  }

  const brandSlug = slugify(parsed.brand)
  if (!brandSlug) {
    res.status(400).json({ message: 'Marca inválida para gerar identificador.' })
    return
  }

  const slug = ensureUniqueSlug(parsed.slug || parsed.name, req.params.id)

  const next: Product = {
    id: existing.id,
    slug,
    brandSlug,
    name: parsed.name,
    description: parsed.description,
    ...(parsed.longDescription != null ? { longDescription: parsed.longDescription } : {}),
    priceCents: parsed.priceCents,
    ...(parsed.compareAtPriceCents != null ? { compareAtPriceCents: parsed.compareAtPriceCents } : {}),
    category: parsed.category,
    condition: parsed.condition,
    brand: parsed.brand,
    imageUrl: parsed.imageUrl,
    galleryUrls: parsed.galleryUrls,
    stock: parsed.stock,
    rating: parsed.rating,
    reviewCount: parsed.reviewCount,
    specifications: parsed.specifications,
  }

  replaceProduct(req.params.id, next)
  res.json(next)
})

app.delete('/api/product/:id', (req, res) => {
  const ok = removeProduct(req.params.id)
  if (!ok) {
    res.status(404).json({ message: 'Produto não encontrado.' })
    return
  }
  res.status(204).send()
})

app.get('/api/product/:id', (req, res) => {
  const found = findById(req.params.id)
  if (!found) {
    res.status(404).json({ message: 'Produto não encontrado.' })
    return
  }
  res.json(found)
})

app.get('/api/products/:slug/related', (req, res) => {
  const { slug } = req.params
  const rawLimit = Number(req.query.limit)
  const limit = Number.isFinite(rawLimit) ? Math.min(12, Math.max(1, Math.floor(rawLimit))) : 4

  const found = findBySlug(slug)
  if (!found) {
    res.status(404).json({ message: 'Produto não encontrado.' })
    return
  }

  const items = getProducts()
    .filter((p) => p.slug !== slug && p.category === found.category)
    .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
    .slice(0, limit)

  res.json({ items })
})

app.get('/api/products/:slug', (req, res) => {
  const found = findBySlug(req.params.slug)
  if (!found) {
    res.status(404).json({ message: 'Produto não encontrado.' })
    return
  }
  res.json(found)
})

type OrderBody = {
  lines?: unknown
  delivery?: unknown
  paymentMethod?: unknown
}

function parseOrderBody(body: unknown): Parameters<typeof createOrder>[0] | null {
  if (typeof body !== 'object' || body === null) return null
  const b = body as OrderBody
  if (!Array.isArray(b.lines)) return null
  const lines: { productId: string; quantity: number }[] = []
  for (const row of b.lines) {
    if (typeof row !== 'object' || row === null) return null
    const r = row as { productId?: unknown; quantity?: unknown }
    const productId = String(r.productId ?? '').trim()
    if (!productId) return null
    const quantity = Math.max(1, Math.floor(Number(r.quantity)))
    if (!Number.isFinite(quantity)) return null
    lines.push({ productId, quantity })
  }
  if (typeof b.delivery !== 'object' || b.delivery === null) return null
  const d = b.delivery as { cep?: unknown; city?: unknown; address?: unknown }
  const delivery = {
    cep: String(d.cep ?? ''),
    city: String(d.city ?? ''),
    address: String(d.address ?? ''),
  }
  const pm = String(b.paymentMethod ?? '')
  if (pm !== 'card' && pm !== 'pix' && pm !== 'boleto') return null
  return { lines, delivery, paymentMethod: pm }
}

app.post('/api/orders', (req, res) => {
  const parsed = parseOrderBody(req.body)
  if (!parsed) {
    res.status(400).json({ message: 'Corpo da requisição inválido.' })
    return
  }
  const result = createOrder(parsed)
  if ('error' in result) {
    res.status(400).json({ message: result.error })
    return
  }
  res.status(201).json(result)
})

app.get('/api/orders/:id', (req, res) => {
  const found = getOrder(req.params.id)
  if (!found) {
    res.status(404).json({ message: 'Pedido não encontrado.' })
    return
  }
  res.json(found)
})

app.listen(PORT, () => {
  console.log(`API em http://localhost:${PORT}`)
})

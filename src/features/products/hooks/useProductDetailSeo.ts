import { useEffect } from 'react'

import { ROUTES } from '@/lib/routes'
import type { Product, ProductCondition } from '@/types'

const PDP_SEO_ATTR = 'data-styleware-pdp-seo'

function truncateMeta(text: string, max: number): string {
  const normalized = text.replace(/\s+/g, ' ').trim()
  if (normalized.length <= max) return normalized
  return `${normalized.slice(0, max - 1).trimEnd()}…`
}

function toAbsoluteUrl(url: string): string {
  const t = url.trim()
  if (t.startsWith('http://') || t.startsWith('https://')) return t
  if (typeof window === 'undefined') return t
  const path = t.startsWith('/') ? t : `/${t}`
  return `${window.location.origin}${path}`
}

function removePdpSeoNodes() {
  document.querySelectorAll(`[${PDP_SEO_ATTR}]`).forEach((el) => el.remove())
}

function appendMarkedNode(node: HTMLElement) {
  node.setAttribute(PDP_SEO_ATTR, '')
  document.head.appendChild(node)
}

function setMeta(attrs: { property?: string; name?: string }, content: string) {
  const el = document.createElement('meta')
  if (attrs.property) el.setAttribute('property', attrs.property)
  if (attrs.name) el.setAttribute('name', attrs.name)
  el.setAttribute('content', content)
  appendMarkedNode(el)
}

function schemaItemCondition(condition: ProductCondition): string {
  switch (condition) {
    case 'novo':
      return 'https://schema.org/NewCondition'
    case 'usado':
    case 'excelente':
      return 'https://schema.org/UsedCondition'
    default:
      return 'https://schema.org/NewCondition'
  }
}

function buildProductJsonLd(product: Product, canonicalUrl: string, imageUrls: string[]) {
  const desc = (product.longDescription ?? product.description).replace(/\s+/g, ' ').trim()
  const price = (product.priceCents / 100).toFixed(2)
  const inStock = product.stock > 0

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: desc,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    offers: {
      '@type': 'Offer',
      url: canonicalUrl,
      priceCurrency: 'BRL',
      price,
      availability: inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: schemaItemCondition(product.condition),
    },
  }

  if (imageUrls.length > 0) {
    jsonLd.image = imageUrls
  }

  if (product.reviewCount > 0 && product.rating > 0) {
    jsonLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
      bestRating: 5,
      worstRating: 1,
    }
  }

  return jsonLd
}

export function useProductDetailSeo(product: Product | undefined) {
  useEffect(() => {
    if (!product) return

    const prevTitle = document.title
    const metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const prevDescription = metaDesc?.content ?? ''

    const plainDesc = (product.longDescription ?? product.description).replace(/\s+/g, ' ').trim()
    const metaDescription = truncateMeta(plainDesc, 158)
    const ogDescription = truncateMeta(plainDesc, 200)

    const path = ROUTES.product(product.slug)
    const canonicalUrl =
      typeof window !== 'undefined' ? `${window.location.origin}${path}` : path

    const gallery =
      product.galleryUrls && product.galleryUrls.length > 0
        ? product.galleryUrls
        : [product.imageUrl]
    const imageUrls = gallery
      .filter((u): u is string => typeof u === 'string' && u.trim().length > 0)
      .map(toAbsoluteUrl)
    const primaryImage = imageUrls[0] ?? toAbsoluteUrl(product.imageUrl)

    const pageTitle = `${product.name} · ${product.brand} | StyleWare`

    document.title = pageTitle
    if (metaDesc) {
      metaDesc.content = metaDescription
    }

    setMeta({ property: 'og:title' }, pageTitle)
    setMeta({ property: 'og:description' }, ogDescription)
    setMeta({ property: 'og:type' }, 'website')
    setMeta({ property: 'og:url' }, canonicalUrl)
    setMeta({ property: 'og:site_name' }, 'StyleWare')
    setMeta({ property: 'og:locale' }, 'pt_BR')
    setMeta({ property: 'og:image' }, primaryImage)
    setMeta({ property: 'og:image:alt' }, product.name)

    setMeta({ name: 'twitter:card' }, 'summary_large_image')
    setMeta({ name: 'twitter:title' }, pageTitle)
    setMeta({ name: 'twitter:description' }, ogDescription)
    setMeta({ name: 'twitter:image' }, primaryImage)

    const link = document.createElement('link')
    link.rel = 'canonical'
    link.href = canonicalUrl
    appendMarkedNode(link)

    const ld = buildProductJsonLd(product, canonicalUrl, imageUrls)
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute(PDP_SEO_ATTR, '')
    script.textContent = JSON.stringify(ld)
    document.head.appendChild(script)

    return () => {
      document.title = prevTitle
      if (metaDesc) metaDesc.content = prevDescription
      removePdpSeoNodes()
    }
  }, [product])
}

import type { Product } from '../../src/types/product.js'

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function truncateMeta(text: string, max: number): string {
  const normalized = text.replace(/\s+/g, ' ').trim()
  if (normalized.length <= max) return normalized
  return `${normalized.slice(0, max - 1).trimEnd()}…`
}

export function buildSocialPdpHtml(
  product: Product,
  opts: { canonicalUrl: string; primaryImageUrl: string },
): string {
  const plainDesc = (product.longDescription ?? product.description).replace(/\s+/g, ' ').trim()
  const metaDescription = truncateMeta(plainDesc, 158)
  const ogDescription = truncateMeta(plainDesc, 200)
  const pageTitle = `${product.name} · ${product.brand} | StyleWare`

  const title = escapeHtml(pageTitle)
  const desc = escapeHtml(metaDescription)
  const ogDesc = escapeHtml(ogDescription)
  const ogUrl = escapeHtml(opts.canonicalUrl)
  const ogImage = escapeHtml(opts.primaryImageUrl)
  const name = escapeHtml(product.name)

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <meta name="description" content="${desc}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${ogDesc}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${ogUrl}" />
  <meta property="og:site_name" content="StyleWare" />
  <meta property="og:locale" content="pt_BR" />
  <meta property="og:image" content="${ogImage}" />
  <meta property="og:image:alt" content="${name}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${ogDesc}" />
  <meta name="twitter:image" content="${ogImage}" />
  <link rel="canonical" href="${ogUrl}" />
</head>
<body></body>
</html>
`
}

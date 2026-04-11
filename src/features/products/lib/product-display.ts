import type { Product, ProductCondition } from '@/types'

/** Pílula de condição comercial — cartão de produto (PLP / favoritos). */
export const PRODUCT_CONDITION_BADGE_CARD: Record<ProductCondition, string> = {
  novo: 'border-success/40 bg-success/15 text-foreground shadow-sm backdrop-blur-sm',
  usado: 'border-border/80 bg-muted/80 text-muted-foreground shadow-sm backdrop-blur-sm',
  excelente: 'border-primary/30 bg-primary/12 text-primary shadow-sm backdrop-blur-sm',
}

/** Pílula de condição — página de detalhe (PDP). */
export const PRODUCT_CONDITION_BADGE_PDP: Record<ProductCondition, string> = {
  novo: 'border-success/35 bg-success/12 text-foreground',
  usado: 'border-border/80 bg-muted/70 text-muted-foreground',
  excelente: 'border-primary/30 bg-primary/10 text-primary',
}

export type ProductCardStockRibbon = {
  label: string
  className: string
}

/** Faixa “Últimas unidades” / “Indisponível” sobre a mídia do card. */
export function productCardStockRibbon(stock: number): ProductCardStockRibbon | null {
  if (stock < 1) {
    return {
      label: 'Indisponível',
      className:
        'border border-border/80 bg-muted/80 text-muted-foreground shadow-sm backdrop-blur-sm',
    }
  }
  if (stock < 5) {
    return {
      label: 'Últimas unidades',
      className:
        'border border-warning/45 bg-warning/30 text-foreground shadow-sm backdrop-blur-sm',
    }
  }
  return null
}

export type ProductDetailStockPill = {
  text: string
  className: string
}

/** Selo de estoque — PDP (texto + estilo da pílula). */
export function productDetailStockPill(stock: number): ProductDetailStockPill {
  if (stock < 1) {
    return {
      text: 'Esgotado',
      className: 'border-destructive/30 bg-destructive/10 text-destructive',
    }
  }
  if (stock < 5) {
    return {
      text: `Apenas ${stock} unidades`,
      className: 'border-warning/35 bg-warning/15 text-foreground',
    }
  }
  return {
    text: 'Em estoque',
    className: 'border-success/30 bg-success/10 text-foreground',
  }
}

/** Indica se há URL de foto principal utilizável (evita `<img src="">`). */
export function hasProductPhotoUrl(url: string | undefined | null): boolean {
  return typeof url === 'string' && url.trim().length > 0
}

/** Diferença em centavos entre preço “De” e preço atual; null se não houver promoção válida. */
export function productSavingsCents(product: Product): number | null {
  const ref = product.compareAtPriceCents
  if (ref == null || ref <= product.priceCents) return null
  return ref - product.priceCents
}

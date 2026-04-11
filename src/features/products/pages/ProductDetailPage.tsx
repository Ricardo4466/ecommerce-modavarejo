import { motion, useReducedMotion } from 'framer-motion'
import { useParams } from 'react-router-dom'

import { formatCurrencyFromCents } from '@/lib/formatCurrency'
import { cn } from '@/lib/cn'
import { buildProductListingHref, ROUTES } from '@/lib/routes'
import { Breadcrumb, Button, StarRating } from '@/ui'
import { useCart } from '@/features/cart/hooks/useCart'
import { FavoriteButton } from '@/features/products/components/FavoriteButton'
import { ProductShareButton } from '@/features/products/components/ProductShareButton'
import { ProductDetailBackButton } from '@/features/products/components/ProductDetailBackButton'
import { ProductImageGallery } from '@/features/products/components/ProductImageGallery'
import { ProductDetailLoadError } from '@/features/products/components/ProductDetailLoadError'
import { ProductDetailSkeleton } from '@/features/products/components/ProductDetailSkeleton'
import { ProductDetailTabs } from '@/features/products/components/ProductDetailTabs'
import { ProductRelatedSection } from '@/features/products/components/ProductRelatedSection'
import { useProduct } from '@/features/products/hooks/useProduct'
import { useProductDetailSeo } from '@/features/products/hooks/useProductDetailSeo'
import {
  PRODUCT_CONDITION_BADGE_PDP,
  productDetailStockPill,
  productSavingsCents,
} from '@/features/products/lib/product-display'
import {
  commercialConditionLabel,
  productCategoryLabel,
} from '@/lib/product-labels'
import { springSoft } from '@/lib/motion'

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data, error, isLoading } = useProduct(slug)
  const { addItem } = useCart()
  const prefersReducedMotion = useReducedMotion()

  useProductDetailSeo(data ?? undefined)

  if (isLoading) {
    return <ProductDetailSkeleton />
  }

  if (error || !data) {
    return <ProductDetailLoadError message={error ?? 'Produto não encontrado.'} />
  }

  const images = (
    data.galleryUrls && data.galleryUrls.length > 0 ? data.galleryUrls : [data.imageUrl]
  ).filter((u): u is string => typeof u === 'string' && u.trim().length > 0)

  const stock = productDetailStockPill(data.stock)
  const savings = productSavingsCents(data)
  const showCompare =
    data.compareAtPriceCents != null && data.compareAtPriceCents > data.priceCents

  return (
    <div className="mx-auto w-full max-w-6xl pb-12 pt-6 md:pb-16 md:pt-8">
      <div className="mb-6 sm:mb-8 space-y-4">
        <ProductDetailBackButton />
        <Breadcrumb
          items={[
            { label: 'Início', href: ROUTES.home },
            {
              label: productCategoryLabel(data.category),
              href: buildProductListingHref({ category: data.category }),
            },
            { label: data.name },
          ]}
        />
      </div>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14 lg:items-start">
        <div className="relative z-10 min-w-0 overflow-visible">
          <ProductImageGallery
            key={data.slug}
            className="overflow-visible lg:sticky lg:top-[calc(var(--header-height)+0.75rem)]"
            productName={data.name}
            urls={images}
          />
        </div>

        <motion.div
          className="relative z-0 flex flex-col gap-6"
          initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={prefersReducedMotion ? { duration: 0 } : springSoft}
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-border bg-muted/80 px-3 py-1 text-xs font-semibold uppercase tracking-label text-muted-foreground">
              {data.brand}
            </span>
            <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {productCategoryLabel(data.category)}
            </span>
            <span
              className={cn(
                'rounded-full border px-3 py-1 text-xs font-medium',
                PRODUCT_CONDITION_BADGE_PDP[data.condition],
              )}
            >
              {commercialConditionLabel(data.condition)}
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-text-h md:text-4xl">
                {data.name}
              </h1>
              <div className="flex shrink-0 items-center gap-1 self-start">
                <ProductShareButton productName={data.name} />
                <FavoriteButton productId={data.id} />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <p
                className={cn(
                  'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold',
                  stock.className,
                )}
              >
                {stock.text}
                {data.stock > 0 && (
                  <span className="ml-2 font-normal opacity-80">
                    · {data.stock} disponíveis
                  </span>
                )}
              </p>
              {data.stock > 0 && data.stock < 5 ? (
                <span className="inline-flex items-center rounded-full border border-warning/40 bg-warning/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-foreground">
                  Últimas unidades
                </span>
              ) : null}
            </div>
          </div>

          <StarRating
            rating={data.rating}
            reviewCount={data.reviewCount}
            size="md"
            className="text-warning"
          />

          <div className="flex flex-col gap-3 border-b border-border pb-6">
            <div className="flex flex-wrap items-baseline gap-3">
              {showCompare ? (
                <p className="text-lg font-medium tabular-nums text-muted-foreground line-through decoration-muted-foreground/60">
                  {formatCurrencyFromCents(data.compareAtPriceCents!)}
                </p>
              ) : null}
              <p className="font-sans text-4xl font-extrabold tabular-nums tracking-tight text-primary md:text-5xl">
                {formatCurrencyFromCents(data.priceCents)}
              </p>
            </div>
            {savings != null ? (
              <p className="inline-flex w-fit rounded-full border border-success/35 bg-success/12 px-3 py-1 text-sm font-semibold text-success">
                Economize {formatCurrencyFromCents(savings)}
              </p>
            ) : null}
            <span className="text-sm text-muted-foreground">à vista no Pix e cartão</span>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              type="button"
              size="lg"
              className="w-full min-w-[240px] cursor-pointer shadow-glow sm:w-auto"
              onClick={() => addItem(data.id)}
              disabled={data.stock < 1}
            >
              {data.stock < 1 ? 'Indisponível' : 'Adicionar ao carrinho'}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Frete e prazo calculados no checkout. Troca em até 7 dias conforme política da loja.
          </p>

          <ProductDetailTabs product={data} />
        </motion.div>
      </div>

      <ProductRelatedSection current={data} />
    </div>
  )
}

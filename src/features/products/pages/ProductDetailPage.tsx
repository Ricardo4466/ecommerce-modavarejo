import { motion, useReducedMotion } from 'framer-motion'
import { useParams } from 'react-router-dom'

import { formatCurrencyFromCents } from '@/lib/formatCurrency'
import { cn } from '@/lib/cn'
import { ROUTES } from '@/lib/routes'
import { Breadcrumb, Button, StarRating } from '@/ui'
import { useCart } from '@/features/cart/hooks/useCart'
import { FavoriteButton } from '@/features/products/components/FavoriteButton'
import { ProductShareButton } from '@/features/products/components/ProductShareButton'
import { ProductDetailBackButton } from '@/features/products/components/ProductDetailBackButton'
import { ProductImageGallery } from '@/features/products/components/ProductImageGallery'
import { ProductDetailLoadError } from '@/features/products/components/ProductDetailLoadError'
import { ProductDetailSkeleton } from '@/features/products/components/ProductDetailSkeleton'
import { ProductSpecifications } from '@/features/products/components/ProductSpecifications'
import { useProduct } from '@/features/products/hooks/useProduct'
import { useProductDetailSeo } from '@/features/products/hooks/useProductDetailSeo'
import {
  PRODUCT_CONDITION_BADGE_PDP,
  productDetailStockPill,
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

  return (
    <div className="mx-auto w-full max-w-6xl pb-12 pt-6 md:pb-16 md:pt-8">
      <div className="mb-6 sm:mb-8 space-y-4">
        <ProductDetailBackButton />
        <Breadcrumb
          items={[
            { label: 'Início', href: ROUTES.home },
            { label: 'Produtos', href: ROUTES.home },
            { label: data.name },
          ]}
        />
      </div>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14 lg:items-start">
        <ProductImageGallery
          key={data.slug}
          className="lg:sticky lg:top-[calc(var(--header-height)+0.75rem)]"
          productName={data.name}
          urls={images}
        />

        <motion.div
          className="flex flex-col gap-6"
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
          </div>

          <StarRating
            rating={data.rating}
            reviewCount={data.reviewCount}
            size="md"
            className="text-warning"
          />

          <div className="flex flex-wrap items-baseline gap-3 border-b border-border pb-6">
            <p className="font-sans text-4xl font-extrabold tabular-nums tracking-tight text-primary md:text-5xl">
              {formatCurrencyFromCents(data.priceCents)}
            </p>
            <span className="text-sm text-muted-foreground">à vista no Pix e cartão</span>
          </div>

          <p className="text-base leading-relaxed text-text md:text-lg">{data.description}</p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              type="button"
              size="lg"
              className="w-full min-w-[240px] shadow-glow sm:w-auto"
              onClick={() => addItem(data.id)}
              disabled={data.stock < 1}
            >
              {data.stock < 1 ? 'Indisponível' : 'Adicionar ao carrinho'}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Frete e prazo calculados no checkout. Troca em até 7 dias conforme política da loja.
          </p>

          <ProductSpecifications specifications={data.specifications} />
        </motion.div>
      </div>
    </div>
  )
}

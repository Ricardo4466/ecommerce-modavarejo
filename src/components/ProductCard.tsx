import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

import { formatCurrencyFromCents } from '@/lib/formatCurrency'
import { springFloat } from '@/lib/motion'
import { cn } from '@/lib/cn'
import { ROUTES } from '@/lib/routes'
import type { Product } from '@/types'
import { commercialConditionLabel } from '@/lib/product-labels'
import {
  PRODUCT_CONDITION_BADGE_CARD,
  hasProductPhotoUrl,
  productCardStockRibbon,
} from '@/features/products/lib/product-display'
import { ProductPhotoPlaceholder } from '@/features/products/components/ProductPhotoPlaceholder'

import { Button } from '@/ui/Button'
import { LazyImage } from '@/ui/LazyImage'
import { StarRating } from '@/ui/StarRating'

export type ProductCardProps = {
  product: Product
  className?: string
  topAction?: ReactNode
  /** Quando definido, exibe CTA “Adicionar” sem navegar para a PDP */
  onAddToCart?: (productId: string) => void
  /** Catálogo estático (ex.: admin): sem link para a PDP */
  preview?: boolean
}

const linkShellClass =
  'flex min-h-0 flex-1 flex-col text-inherit no-underline outline-none rounded-t-2xl sm:rounded-t-3xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

export function ProductCard({
  product,
  className,
  topAction,
  onAddToCart,
  preview = false,
}: ProductCardProps) {
  const stockRibbon = productCardStockRibbon(product.stock)

  const cardMain = (
    <>
      <div
        className={cn(
          'relative aspect-square w-full overflow-hidden',
          'bg-gradient-to-br from-muted/35 via-muted/12 to-transparent p-2 sm:p-2',
        )}
      >
        <div className="relative h-full w-full overflow-hidden rounded-[0.875rem] ring-1 ring-inset ring-foreground/[0.05] dark:ring-white/[0.07] sm:rounded-2xl">
          {stockRibbon ? (
            <span
              className={cn(
                'absolute left-2 top-2 z-10 max-w-[calc(100%-4.5rem)] truncate rounded-lg',
                'px-2 py-1 text-[0.625rem] font-extrabold uppercase leading-none tracking-label',
                stockRibbon.className,
              )}
            >
              {stockRibbon.label}
            </span>
          ) : null}
          <span
            className={cn(
              'absolute right-2 bottom-2 z-10 max-w-[calc(100%-1rem)] truncate rounded-lg',
              'border px-2 py-1 text-[0.625rem] font-bold leading-none tracking-label',
              PRODUCT_CONDITION_BADGE_CARD[product.condition],
            )}
          >
            {commercialConditionLabel(product.condition)}
          </span>
          {hasProductPhotoUrl(product.imageUrl) ? (
            <LazyImage
              src={product.imageUrl}
              alt={preview ? product.name : ''}
              width={400}
              height={400}
              className={cn(
                'h-full w-full object-cover transition-[transform,filter] duration-700 [transition-timing-function:cubic-bezier(0.33,1,0.68,1)]',
                'group-hover/card:scale-[1.03] motion-reduce:group-hover/card:scale-100',
                product.stock < 1 && 'grayscale',
              )}
            />
          ) : (
            <ProductPhotoPlaceholder className="rounded-[0.875rem] sm:rounded-2xl" />
          )}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-card via-card/45 to-transparent opacity-0 transition-opacity duration-500 [transition-timing-function:cubic-bezier(0.33,1,0.68,1)] group-hover/card:opacity-100"
            aria-hidden
          />
        </div>
      </div>

      <div className="flex min-h-[7.5rem] flex-1 flex-col gap-2.5 px-4 pb-4 pt-3.5 sm:min-h-[8rem] sm:gap-3 sm:px-5 sm:pb-4 sm:pt-4">
        <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">
          {product.brand}
        </p>
        <h3 className="line-clamp-2 min-h-[2.5rem] text-[0.9375rem] font-semibold leading-snug tracking-[-0.018em] text-text-h transition-colors duration-500 [transition-timing-function:cubic-bezier(0.33,1,0.68,1)] group-hover/card:text-primary sm:text-base sm:min-h-[2.75rem]">
          {product.name}
        </h3>
        <StarRating
          rating={product.rating}
          reviewCount={product.reviewCount}
          className="text-warning"
        />

        <div
          className={cn(
            'mt-auto space-y-1 rounded-xl border border-border/40 bg-muted/15 px-3 py-2.5 pt-2.5 sm:rounded-2xl sm:px-3.5 sm:py-3',
            'transition-[background-color,border-color,backdrop-filter] duration-500 [transition-timing-function:cubic-bezier(0.33,1,0.68,1)]',
            'group-hover/card:border-primary/15 group-hover/card:bg-muted/25 group-hover/card:backdrop-blur-[3px]',
          )}
        >
          <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">
            {product.stock < 1 ? 'Preço' : 'Por apenas'}
          </p>
          <p
            className={cn(
              'text-xl font-extrabold tabular-nums tracking-tight text-primary sm:text-[1.35rem]',
              product.stock < 1 &&
                'text-muted-foreground line-through decoration-destructive/50',
            )}
          >
            {formatCurrencyFromCents(product.priceCents)}
          </p>
          {product.stock > 0 ? (
            <p className="flex items-center justify-between gap-2 text-xs font-semibold text-primary">
              <span className="truncate">à vista · Pix e cartão</span>
              <span
                className="shrink-0 text-[0.7rem] font-bold opacity-0 transition-opacity duration-500 [transition-timing-function:cubic-bezier(0.33,1,0.68,1)] group-hover/card:opacity-100"
                aria-hidden
              >
                Ver →
              </span>
            </p>
          ) : null}
        </div>
      </div>
    </>
  )

  return (
    <motion.article
      className={cn(
        'group/card relative isolate flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/95 sm:rounded-3xl',
        'shadow-sm shadow-foreground/[0.03] ring-1 ring-foreground/[0.04] transition-[box-shadow,border-color,ring-color,transform]',
        'duration-500 [transition-timing-function:cubic-bezier(0.33,1,0.68,1)]',
        'hover:border-primary/25 hover:shadow-xl hover:shadow-primary/[0.06] hover:ring-primary/15',
        'dark:border-border/80 dark:bg-card dark:ring-white/[0.06] dark:hover:ring-primary/20',
        product.stock < 1 && 'opacity-[0.92]',
        className,
      )}
      whileHover={product.stock < 1 ? undefined : { y: -2, transition: springFloat }}
    >
      {topAction ? (
        <div className="absolute right-2.5 top-2.5 z-20 drop-shadow-md">{topAction}</div>
      ) : null}

      {preview ? (
        <div
          className={linkShellClass}
          role="region"
          aria-label="Pré-visualização do produto no catálogo"
        >
          {cardMain}
        </div>
      ) : (
        <Link to={ROUTES.product(product.slug)} className={linkShellClass}>
          {cardMain}
        </Link>
      )}

      {onAddToCart ? (
        <div className="border-t border-border/40 bg-card/80 px-4 pb-4 pt-3 backdrop-blur-[2px] sm:px-5 sm:pb-5">
          <Button
            type="button"
            size="sm"
            className="h-10 w-full rounded-xl shadow-sm sm:h-11"
            disabled={product.stock < 1}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onAddToCart(product.id)
            }}
          >
            {product.stock < 1 ? 'Indisponível' : 'Adicionar ao carrinho'}
          </Button>
        </div>
      ) : null}
    </motion.article>
  )
}

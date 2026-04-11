import { useEffect, useState } from 'react'

import type { CartLine, Product } from '@/types'
import { formatCurrencyFromCents } from '@/lib/formatCurrency'
import { cn } from '@/lib/cn'
import { Button, LazyImage, Skeleton } from '@/ui'
import { commercialConditionLabel } from '@/lib/product-labels'
import { ProductPhotoPlaceholder } from '@/features/products/components/ProductPhotoPlaceholder'
import { hasProductPhotoUrl } from '@/features/products/lib/product-display'
import { productService } from '@/features/products/services/product.service'

type Props = {
  line: CartLine
  onChangeQty: (productId: string, quantity: number) => void
  onRemove: (productId: string) => void
}

const cardShell =
  'rounded-2xl border border-border/80 bg-card p-4 shadow-sm transition-[border-color,box-shadow] duration-300 ease-in-out hover:border-primary/25 hover:shadow-md'

export function CartLineItem({ line, onChangeQty, onRemove }: Props) {
  const [product, setProduct] = useState<Product | null>(null)

  useEffect(() => {
    let cancelled = false
    productService.getById(line.productId).then((p) => {
      if (!cancelled) setProduct(p)
    })
    return () => {
      cancelled = true
    }
  }, [line.productId])

  if (!product) {
    return (
      <li className={cn('flex flex-col gap-3', cardShell)}>
        <div className="flex gap-3">
          <Skeleton className="h-16 w-16 shrink-0 rounded-xl sm:h-20 sm:w-20" />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-[70%] max-w-full rounded-md" />
            <Skeleton className="h-3 w-24 rounded-md" />
          </div>
        </div>
        <div className="border-t border-border/60 pt-3">
          <Skeleton className="h-10 w-28 rounded-lg" />
        </div>
      </li>
    )
  }

  const lineTotal = product.priceCents * line.quantity

  return (
    <li className={cn('flex flex-col gap-3', cardShell)}>
      {/* Bloco 1: foto + texto — não usa breakpoint de viewport (evita grid 5 col dentro do drawer estreito). */}
      <div className="flex gap-3">
        {hasProductPhotoUrl(product.imageUrl) ? (
          <LazyImage
            eager
            src={product.imageUrl}
            alt=""
            width={80}
            height={80}
            className="h-16 w-16 shrink-0 rounded-xl object-cover ring-1 ring-inset ring-foreground/[0.06] sm:h-20 sm:w-20"
          />
        ) : (
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl ring-1 ring-inset ring-foreground/[0.06] sm:h-20 sm:w-20">
            <ProductPhotoPlaceholder compact />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="break-words font-semibold leading-snug tracking-tight text-text-h">{product.name}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Condição: {commercialConditionLabel(product.condition)}
          </p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {formatCurrencyFromCents(product.priceCents)} cada
          </p>
        </div>
      </div>

      {/* Bloco 2: sem grid por viewport — drawer estreito não é a viewport; layout em coluna evita sobreposição. */}
      <div className="flex flex-col gap-3 border-t border-border/60 pt-3">
        <label className="flex max-w-[12rem] flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">Quantidade</span>
          <input
            type="number"
            min={1}
            value={line.quantity}
            onChange={(e) => onChangeQty(line.productId, Number(e.target.value))}
            className={cn(
              'h-11 w-full min-w-[4.5rem] rounded-lg border border-border bg-surface px-3 py-2',
              'text-center text-sm font-medium text-text-h tabular-nums shadow-sm',
              'transition-[border-color,box-shadow] duration-300 ease-in-out',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              'touch-manipulation',
            )}
          />
        </label>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-base font-semibold tabular-nums text-text-h">
            {formatCurrencyFromCents(lineTotal)}
          </p>
          <Button
            type="button"
            variant="ghost"
            className="min-h-11 min-w-[6.5rem] shrink-0"
            onClick={() => onRemove(line.productId)}
          >
            Remover
          </Button>
        </div>
      </div>
    </li>
  )
}

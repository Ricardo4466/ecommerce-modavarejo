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
      <li
        className={cn(
          'grid grid-cols-[4rem_1fr] gap-4 rounded-2xl border border-border/80 bg-card p-4 shadow-sm',
          'sm:grid-cols-[5rem_minmax(0,1fr)_auto_auto_auto] sm:items-center sm:gap-4',
        )}
      >
        <Skeleton className="h-16 w-16 shrink-0 rounded-xl sm:h-20 sm:w-20" />
        <div className="col-span-2 flex min-w-0 flex-col gap-2 sm:col-span-1">
          <Skeleton className="h-4 w-[70%] max-w-full rounded-md" />
          <Skeleton className="h-3 w-24 rounded-md" />
        </div>
      </li>
    )
  }

  const lineTotal = product.priceCents * line.quantity

  return (
    <li
      className={cn(
        'grid grid-cols-[4rem_1fr] gap-4 rounded-2xl border border-border/80 bg-card p-4 shadow-sm',
        'transition-[border-color,box-shadow] duration-300 ease-in-out hover:border-primary/25 hover:shadow-md',
        'sm:grid-cols-[5rem_minmax(0,1fr)_minmax(0,7.5rem)_minmax(0,5.5rem)_auto] sm:items-center sm:gap-4',
      )}
    >
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
      <div className="min-w-0 sm:max-w-md">
        <p className="font-semibold leading-snug tracking-tight text-text-h">{product.name}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Condição: {commercialConditionLabel(product.condition)}
        </p>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {formatCurrencyFromCents(product.priceCents)} cada
        </p>
      </div>

      <label className="col-span-2 flex flex-col gap-1 sm:col-span-1 sm:col-auto">
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
            'touch-manipulation sm:w-20',
          )}
        />
      </label>

      <p className="col-span-2 text-base font-semibold tabular-nums text-text-h sm:col-span-1 sm:text-right">
        {formatCurrencyFromCents(lineTotal)}
      </p>

      <div className="col-span-2 sm:col-span-1 sm:justify-self-end">
        <Button
          type="button"
          variant="ghost"
          className="min-h-11 w-full min-w-[6.5rem] sm:w-auto"
          onClick={() => onRemove(line.productId)}
        >
          Remover
        </Button>
      </div>
    </li>
  )
}

import { Star, StarHalf } from 'lucide-react'

import { cn } from '@/lib/cn'

export type StarRatingProps = {
  rating: number
  reviewCount?: number
  className?: string
  size?: 'sm' | 'md'
}

export function StarRating({
  rating,
  reviewCount,
  className,
  size = 'sm',
}: StarRatingProps) {
  const clamped = Math.min(5, Math.max(0, rating))
  const full = Math.floor(clamped)
  const hasHalf = clamped - full >= 0.5 && full < 5
  const label =
    reviewCount != null && reviewCount > 0
      ? `${String(clamped.toFixed(1))} de 5 estrelas, ${reviewCount} avaliações`
      : `${String(clamped.toFixed(1))} de 5 estrelas`

  const iconClass = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'

  return (
    <div
      className={cn('flex flex-wrap items-center gap-1.5 text-warning', className)}
      role="img"
      aria-label={label}
    >
      <span className="flex items-center gap-0.5" aria-hidden>
        {[0, 1, 2, 3, 4].map((i) => {
          if (i < full) {
            return (
              <Star
                key={i}
                className={cn(iconClass, 'shrink-0 fill-warning text-warning')}
                strokeWidth={0}
              />
            )
          }
          if (i === full && hasHalf) {
            return (
              <StarHalf
                key={i}
                className={cn(iconClass, 'shrink-0 fill-warning text-warning')}
                strokeWidth={1.5}
              />
            )
          }
          return (
            <Star
              key={i}
              className={cn(
                iconClass,
                'shrink-0 fill-transparent text-muted-foreground/45',
              )}
              strokeWidth={1.5}
            />
          )
        })}
      </span>
      <span className="text-xs font-semibold tabular-nums text-muted-foreground">
        {clamped.toFixed(1)}
        {reviewCount != null && reviewCount > 0 ? (
          <span className="ml-1 font-medium opacity-90">
            ({reviewCount >= 1000 ? `${(reviewCount / 1000).toFixed(1)}k` : reviewCount})
          </span>
        ) : null}
      </span>
    </div>
  )
}

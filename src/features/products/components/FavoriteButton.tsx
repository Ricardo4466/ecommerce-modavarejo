import { useShallow } from 'zustand/react/shallow'

import { cn } from '@/lib/cn'
import { useFavoritesStore } from '@/features/products/stores/favorites-store'

export type FavoriteButtonProps = {
  productId: string
  className?: string
  labels?: { add: string; remove: string }
}

export function FavoriteButton({
  productId,
  className,
  labels = { add: 'Adicionar aos favoritos', remove: 'Remover dos favoritos' },
}: FavoriteButtonProps) {
  const { active, toggle } = useFavoritesStore(
    useShallow((s) => ({
      active: s.ids.includes(productId),
      toggle: s.toggle,
    })),
  )

  return (
    <button
      type="button"
      className={cn(
        'inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-border bg-card/90 text-lg shadow-sm backdrop-blur-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        active ? 'text-destructive' : 'text-muted-foreground hover:text-foreground',
        className,
      )}
      aria-label={active ? labels.remove : labels.add}
      aria-pressed={active}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggle(productId)
      }}
    >
      <span aria-hidden className="leading-none">
        {active ? '♥' : '♡'}
      </span>
    </button>
  )
}

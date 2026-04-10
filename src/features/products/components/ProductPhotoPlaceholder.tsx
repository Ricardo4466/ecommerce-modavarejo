import { ImageOff } from 'lucide-react'

import { cn } from '@/lib/cn'

type Props = {
  className?: string
  /** Miniatura (carrinho) — só ícone; `aria-label` no pai. */
  compact?: boolean
}

export function ProductPhotoPlaceholder({ className, compact }: Props) {
  if (compact) {
    return (
      <div
        className={cn(
          'flex h-full w-full items-center justify-center bg-muted/50 text-muted-foreground',
          className,
        )}
        role="img"
        aria-label="Sem foto"
      >
        <ImageOff className="h-7 w-7 opacity-45" strokeWidth={1.5} aria-hidden />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex h-full w-full flex-col items-center justify-center gap-2 bg-muted/50 text-muted-foreground',
        className,
      )}
      role="img"
      aria-label="Sem foto"
    >
      <ImageOff className="h-10 w-10 opacity-40 sm:h-12 sm:w-12" strokeWidth={1.25} aria-hidden />
      <span className="text-center text-[0.65rem] font-semibold uppercase tracking-wide sm:text-xs">
        Sem foto
      </span>
    </div>
  )
}

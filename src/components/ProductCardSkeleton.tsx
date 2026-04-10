import { cn } from '@/lib/cn'
import { Skeleton } from '@/ui/Skeleton'

export type ProductCardSkeletonProps = {
  className?: string
}

export function ProductCardSkeleton({ className }: ProductCardSkeletonProps) {
  return (
    <div
      className={cn(
        'isolate overflow-hidden rounded-2xl border border-border/75 bg-card/90 shadow-sm shadow-foreground/[0.03] ring-1 ring-foreground/[0.04] dark:ring-white/[0.06] sm:rounded-3xl',
        className,
      )}
    >
      <div className="bg-gradient-to-br from-muted/45 via-muted/20 to-muted/5 p-1.5">
        <Skeleton className="aspect-square w-full rounded-xl" />
      </div>
      <div className="space-y-2 px-3.5 pb-3 pt-2 sm:px-4 sm:pb-3.5 sm:pt-3">
        <Skeleton className="h-3 w-[28%] max-w-full rounded-md" />
        <Skeleton className="h-4 w-[88%] max-w-full rounded-md" />
        <Skeleton className="h-4 w-[55%] max-w-full rounded-md" />
        <Skeleton className="h-3 w-[40%] max-w-full rounded-md" />
      </div>
      <div className="mx-3.5 mb-2 space-y-2 rounded-xl border border-border/50 bg-muted/20 px-3 py-2.5 sm:mx-4 sm:px-3.5 sm:py-3">
        <Skeleton className="h-3 w-[32%] max-w-full rounded-md" />
        <Skeleton className="h-7 w-[45%] max-w-full rounded-md" />
      </div>
      <div className="mx-3.5 mb-3 border-t border-border/50 px-3.5 pb-3 pt-2 sm:mx-4 sm:mb-3.5 sm:px-4 sm:pb-4">
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </div>
  )
}

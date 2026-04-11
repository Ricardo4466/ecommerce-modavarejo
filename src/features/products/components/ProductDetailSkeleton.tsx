import { Skeleton } from '@/ui/Skeleton'

export function ProductDetailSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl py-8 md:py-12">
      <Skeleton className="mb-8 h-4 w-72 rounded-md" />
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14 lg:items-start">
        <div className="space-y-4 lg:sticky lg:top-[calc(var(--header-height)+0.75rem)]">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="flex gap-2">
            <Skeleton className="h-16 w-16 shrink-0 rounded-xl sm:h-20 sm:w-20" />
            <Skeleton className="h-16 w-16 shrink-0 rounded-xl sm:h-20 sm:w-20" />
            <Skeleton className="h-16 w-16 shrink-0 rounded-xl sm:h-20 sm:w-20" />
          </div>
        </div>
        <div className="space-y-5">
          <Skeleton className="h-5 w-32 rounded-full" />
          <Skeleton className="h-10 w-full max-w-xl rounded-lg" />
          <Skeleton className="h-8 w-40 rounded-full" />
          <Skeleton className="h-12 w-48 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-36 rounded-md" />
            <Skeleton className="h-14 w-full max-w-xs rounded-lg" />
          </div>
          <Skeleton className="h-12 w-full max-w-sm rounded-xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      </div>
      <div className="mt-14 border-t border-border pt-10">
        <Skeleton className="h-8 w-64 rounded-lg" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="aspect-[3/4] w-full rounded-3xl" />
          <Skeleton className="aspect-[3/4] w-full rounded-3xl" />
          <Skeleton className="aspect-[3/4] w-full rounded-3xl" />
          <Skeleton className="aspect-[3/4] w-full rounded-3xl" />
        </div>
      </div>
    </div>
  )
}

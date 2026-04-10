import { Skeleton } from '@/ui/Skeleton'

export function ProductDetailSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl py-8 md:py-12">
      <Skeleton className="mb-8 h-4 w-56 rounded-md" />
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14 lg:items-start">
        <Skeleton className="aspect-square w-full rounded-2xl lg:sticky lg:top-[calc(var(--header-height)+0.75rem)]" />
        <div className="space-y-5">
          <Skeleton className="h-5 w-32 rounded-full" />
          <Skeleton className="h-10 w-full max-w-xl rounded-lg" />
          <Skeleton className="h-12 w-48 rounded-lg" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-12 w-full max-w-sm rounded-xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  )
}

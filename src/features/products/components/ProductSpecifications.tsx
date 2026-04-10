import type { Product } from '@/types'

type ProductSpecificationsProps = {
  specifications: Product['specifications']
}

export function ProductSpecifications({ specifications }: ProductSpecificationsProps) {
  return (
    <section
      className="rounded-2xl border border-border bg-muted/25 p-6 md:p-8"
      aria-labelledby="product-specs-heading"
    >
      <h2 id="product-specs-heading" className="text-lg font-semibold text-text-h">
        Especificações
      </h2>
      <dl className="mt-4 grid gap-0 divide-y divide-border sm:grid-cols-1">
        {specifications.map((spec) => (
          <div
            key={spec.label}
            className="grid gap-1 py-3 sm:grid-cols-[minmax(8rem,32%)_1fr] sm:gap-6"
          >
            <dt className="text-sm font-medium text-muted-foreground">{spec.label}</dt>
            <dd className="text-sm text-text-h">{spec.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

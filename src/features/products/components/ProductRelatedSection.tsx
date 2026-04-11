import { ProductCard } from '@/components/ProductCard'
import { useRelatedProducts } from '@/features/products/hooks/useRelatedProducts'
import { Skeleton } from '@/ui'
import type { Product } from '@/types'

type Props = {
  current: Product
}

export function ProductRelatedSection({ current }: Props) {
  const { data, error, isLoading } = useRelatedProducts(current.slug)

  if (isLoading) {
    return (
      <section className="mt-14 border-t border-border pt-10 md:mt-16 md:pt-12" aria-busy="true">
        <h2 className="text-xl font-bold tracking-tight text-text-h md:text-2xl">
          Quem viu, viu também
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] w-full rounded-3xl" />
          ))}
        </div>
      </section>
    )
  }

  if (error || data.length === 0) {
    return null
  }

  return (
    <section className="mt-14 border-t border-border pt-10 md:mt-16 md:pt-12">
      <h2 className="text-xl font-bold tracking-tight text-text-h md:text-2xl">
        Quem viu, viu também
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Outras peças na mesma categoria que podem combinar com o seu estilo.
      </p>
      <ul className="mt-6 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
        {data.map((p) => (
          <li key={p.id}>
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
    </section>
  )
}

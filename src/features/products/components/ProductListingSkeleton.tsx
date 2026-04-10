import { ProductCardSkeleton } from '@/components/ProductCardSkeleton'

import { PLP_GRID_CLASS } from '@/features/products/constants'

type Props = {
  count?: number
}

export function ProductListingSkeleton({ count = 8 }: Props) {
  return (
    <ul className={PLP_GRID_CLASS}>
      {Array.from({ length: count }).map((_, i) => (
        <li key={i}>
          <ProductCardSkeleton />
        </li>
      ))}
    </ul>
  )
}

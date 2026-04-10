import { useEffect, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'

import type { ProductCategory, ProductCondition } from '@/types'
import { Select } from '@/ui'
import { cn } from '@/lib/cn'
import {
  PLP_CATEGORY_OPTIONS,
  PLP_CONDITION_OPTIONS,
  PLP_SORT_OPTIONS,
} from '@/features/products/constants'
import type { SortOption } from '@/features/products/lib/apply-listing-filters'
import { PLP_BRAND_OPTIONS } from '@/features/products/mock/plp-mock'
import { useListingFiltersStore } from '@/features/products/stores/listing-filters-store'
import { httpGet } from '@/lib/http/client'

type Props = {
  className?: string
  /** Campos em coluna única (ex.: modal mobile). */
  layout?: 'stack' | 'grid'
}

export function ProductListingFilterFields({
  className,
  layout = 'grid',
}: Props) {
  const [brandOptions, setBrandOptions] = useState(PLP_BRAND_OPTIONS)

  useEffect(() => {
    void httpGet<{ items: { value: string; label: string }[] }>('/api/brands')
      .then((d) => {
        setBrandOptions([{ value: '', label: 'Todas as marcas' }, ...d.items])
      })
      .catch(() => {
        /* mantém PLP_BRAND_OPTIONS do mock */
      })
  }, [])

  const { category, brandSlug, sort, condition, setCategory, setBrandSlug, setSort, setCondition } =
    useListingFiltersStore(
      useShallow((s) => ({
        category: s.category,
        brandSlug: s.brandSlug,
        sort: s.sort,
        condition: s.condition,
        setCategory: s.setCategory,
        setBrandSlug: s.setBrandSlug,
        setSort: s.setSort,
        setCondition: s.setCondition,
      })),
    )

  const gridClass =
    layout === 'stack'
      ? 'flex flex-col gap-4'
      : 'grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'

  return (
    <div className={cn(gridClass, className)}>
      <div className="min-w-0 w-full">
        <Select
          label="Categoria"
          className="w-full min-h-11"
          value={category}
          onChange={(e) => setCategory(e.target.value as ProductCategory | '')}
          options={PLP_CATEGORY_OPTIONS}
        />
      </div>
      <div className="min-w-0 sm:min-w-[180px] lg:min-w-[200px]">
        <Select
          label="Marca"
          className="w-full min-h-11"
          value={brandSlug}
          onChange={(e) => setBrandSlug(e.target.value)}
          options={brandOptions}
        />
      </div>
      <div className="min-w-0 w-full">
        <Select
          label="Condição"
          className="w-full min-h-11"
          value={condition}
          onChange={(e) => setCondition(e.target.value as ProductCondition | '')}
          options={PLP_CONDITION_OPTIONS}
        />
      </div>
      <div className="min-w-0 w-full">
        <Select
          label="Ordenar"
          className="w-full min-h-11"
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          options={PLP_SORT_OPTIONS}
        />
      </div>
    </div>
  )
}

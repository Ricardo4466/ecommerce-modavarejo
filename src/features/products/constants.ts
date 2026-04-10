import type { ProductCategory, ProductCondition } from '@/types'

import type { SortOption } from '@/features/products/lib/apply-listing-filters'
import { commercialConditionLabel } from '@/lib/product-labels'

/** Id do bloco de resultados na PLP. */
export const PLP_CATALOG_ANCHOR_ID = 'catalog'

export const PLP_CATEGORY_OPTIONS: { value: ProductCategory | ''; label: string }[] = [
  { value: '', label: 'Todas' },
  { value: 'masculino', label: 'Masculino' },
  { value: 'feminino', label: 'Feminino' },
  { value: 'acessorios', label: 'Acessórios' },
]

export const PLP_SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'name-asc', label: 'Nome (A–Z)' },
  { value: 'name-desc', label: 'Nome (Z–A)' },
  { value: 'price-asc', label: 'Menor preço' },
  { value: 'price-desc', label: 'Maior preço' },
]

const PLP_CONDITION_VALUES: ProductCondition[] = ['novo', 'usado', 'excelente']

export const PLP_CONDITION_OPTIONS: { value: ProductCondition | ''; label: string }[] = [
  { value: '', label: 'Todas' },
  ...PLP_CONDITION_VALUES.map((value) => ({
    value,
    label: commercialConditionLabel(value),
  })),
]

/** Classes de grid compartilhadas entre resultados e skeleton (mobile-first) */
export const PLP_GRID_CLASS =
  'm-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4 xl:gap-6'

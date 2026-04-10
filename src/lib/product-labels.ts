import type { ProductCategory, ProductCondition } from '@/types'

const CATEGORY_LABELS: Record<ProductCategory, string> = {
  masculino: 'Masculino',
  feminino: 'Feminino',
  acessorios: 'Acessórios',
}

export function productCategoryLabel(category: ProductCategory): string {
  return CATEGORY_LABELS[category]
}

const CONDITION_LABELS: Record<ProductCondition, string> = {
  novo: 'Novo',
  usado: 'Usado',
  excelente: 'Excelente estado',
}

export function commercialConditionLabel(condition: ProductCondition): string {
  return CONDITION_LABELS[condition]
}

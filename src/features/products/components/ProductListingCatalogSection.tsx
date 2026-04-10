import { Link } from 'react-router-dom'
import { AlertCircle, SearchX } from 'lucide-react'

import { Button, buttonStyles, EmptyState, ErrorState } from '@/ui'
import { PLP_CATALOG_ANCHOR_ID } from '@/features/products/constants'
import { ProductListingGrid } from '@/features/products/components/ProductListingGrid'
import { ProductListingSkeleton } from '@/features/products/components/ProductListingSkeleton'
import { ROUTES } from '@/lib/routes'
import type { Product } from '@/types'

export type ProductListingCatalogSectionProps = {
  products: Product[]
  isLoading: boolean
  error: string | null
  onResetFilters: () => void
}

/**
 * Bloco de resultados da PLP (âncora do catálogo, meta, vazio / erro / grid).
 */
export function ProductListingCatalogSection({
  products,
  isLoading,
  error,
  onResetFilters,
}: ProductListingCatalogSectionProps) {
  return (
    <section
      id={PLP_CATALOG_ANCHOR_ID}
      className="relative z-0 scroll-mt-[calc(var(--header-height)+1rem)]"
      aria-label="Resultados do catálogo"
    >
      <p
        className="page__results-meta"
        aria-live="polite"
        data-loading={isLoading ? 'true' : 'false'}
      >
        {isLoading
          ? 'Carregando resultados…'
          : `${products.length} ${products.length === 1 ? 'produto' : 'produtos'}`}
      </p>

      {isLoading && <ProductListingSkeleton />}

      {error ? (
        <ErrorState
          className="mt-6"
          icon={AlertCircle}
          title="Não foi possível carregar os produtos"
          description={error}
        />
      ) : null}

      {!isLoading && !error && products.length === 0 ? (
        <EmptyState
          className="mt-6"
          icon={SearchX}
          title="Nenhum produto encontrado"
          description="Ajuste a busca ou os filtros para ver mais resultados no catálogo."
        >
          <Button type="button" variant="secondary" onClick={() => onResetFilters()}>
            Limpar busca e filtros
          </Button>
          <Link to={ROUTES.home} className={buttonStyles({ variant: 'outline' })}>
            Ir ao início
          </Link>
        </EmptyState>
      ) : null}

      {!isLoading && !error && products.length > 0 ? (
        <ProductListingGrid products={products} />
      ) : null}
    </section>
  )
}

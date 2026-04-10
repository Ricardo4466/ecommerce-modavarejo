import { useCallback, useState } from 'react'

import { Button, Modal } from '@/ui'

import { ProductListingFilterFields } from '@/features/products/components/ProductListingFilterFields'
import { ProductListingSearchField } from '@/features/products/components/ProductListingSearchField'

export function ProductListingToolbar() {
  const [filtersOpen, setFiltersOpen] = useState(false)
  const closeFilters = useCallback(() => setFiltersOpen(false), [])

  return (
    <>
      <div className="catalog-toolbar plp-toolbar-panel flex flex-col gap-3 md:gap-4">
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
          <ProductListingSearchField className="min-w-0 flex-1" />
          <Button
            type="button"
            variant="secondary"
            className="h-11 w-full shrink-0 sm:max-w-44 md:hidden"
            onClick={() => setFiltersOpen(true)}
          >
            Filtros
          </Button>
        </div>

        <div className="hidden md:block">
          <ProductListingFilterFields layout="grid" />
        </div>
      </div>

      <Modal
        open={filtersOpen}
        onClose={closeFilters}
        title="Filtros"
        description="Busca por texto, condição comercial, categoria, marca e ordenação por preço ou nome."
      >
        <ProductListingFilterFields layout="stack" />
        <Button
          type="button"
          className="mt-6 w-full min-h-11 md:hidden"
          onClick={closeFilters}
        >
          Aplicar e fechar
        </Button>
      </Modal>
    </>
  )
}

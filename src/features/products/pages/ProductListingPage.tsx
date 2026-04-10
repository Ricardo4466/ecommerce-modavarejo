import { ProductListingCatalogSection } from '@/features/products/components/ProductListingCatalogSection'
import { ProductListingToolbar } from '@/features/products/components/ProductListingToolbar'
import { useProductListing } from '@/features/products/hooks/useProductListing'
import { useProductListingFilters } from '@/features/products/hooks/useProductListingFilters'
import { useProductListingUrlSync } from '@/features/products/hooks/useProductListingUrlSync'
import { Breadcrumb } from '@/ui'
import { ROUTES } from '@/lib/routes'

export function ProductListingPage() {
  useProductListingUrlSync()

  const { filters, resetFilters } = useProductListingFilters()
  const { data, isLoading, error } = useProductListing(filters)

  return (
    <div className="page product-listing">
      <Breadcrumb
        className="page__breadcrumb"
        items={[{ label: 'Início', href: ROUTES.home }, { label: 'Produtos' }]}
      />

      <ProductListingToolbar />

      <ProductListingCatalogSection
        products={data}
        isLoading={isLoading}
        error={error}
        onResetFilters={resetFilters}
      />
    </div>
  )
}

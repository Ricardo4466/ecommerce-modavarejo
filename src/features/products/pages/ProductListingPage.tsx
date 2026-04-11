import { ProductListingCatalogSection } from '@/features/products/components/ProductListingCatalogSection'
import { ProductListingToolbar } from '@/features/products/components/ProductListingToolbar'
import { useProductListing } from '@/features/products/hooks/useProductListing'
import { useProductListingFilters } from '@/features/products/hooks/useProductListingFilters'
import { useProductListingUrlSync } from '@/features/products/hooks/useProductListingUrlSync'
import { Breadcrumb } from '@/ui'
import { ROUTES } from '@/lib/routes'
import { productCategoryLabel } from '@/lib/product-labels'

export function ProductListingPage() {
  useProductListingUrlSync()

  const { filters, resetFilters } = useProductListingFilters()
  const { data, isLoading, error } = useProductListing(filters)

  const breadcrumbItems =
    filters.category !== ''
      ? [
          { label: 'Início', href: ROUTES.home },
          { label: productCategoryLabel(filters.category) },
        ]
      : [
          { label: 'Início', href: ROUTES.home },
          { label: 'Produtos' },
        ]

  return (
    <div className="page product-listing">
      <Breadcrumb className="page__breadcrumb" items={breadcrumbItems} />

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

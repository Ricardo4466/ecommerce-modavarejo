import { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'
import { Heart, PackageX } from 'lucide-react'

import {
  Breadcrumb,
  buttonStyles,
  EmptyState,
} from '@/ui'
import { PageIntro } from '@/components/PageIntro'
import { ProductListingGrid } from '@/features/products/components/ProductListingGrid'
import { ProductListingSkeleton } from '@/features/products/components/ProductListingSkeleton'
import { fetchProductListing } from '@/features/products/services/product.service'
import { useFavoritesStore } from '@/features/products/stores/favorites-store'
import type { Product } from '@/types'
import { EMPTY_LISTING_FILTERS } from '@/features/products/lib/listing-search-params'
import { ROUTES } from '@/lib/routes'

export function FavoritesPage() {
  const ids = useFavoritesStore((s) => s.ids)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (ids.length === 0) {
      setProducts([])
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)

    void fetchProductListing({ ...EMPTY_LISTING_FILTERS })
      .then((all) => {
        if (!cancelled) {
          setProducts(all.filter((p) => ids.includes(p.id)))
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setProducts([])
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [ids])

  return (
    <div className="page favorites-page">
      <Breadcrumb
        className="mb-6"
        items={[
          { label: 'Início', href: ROUTES.home },
          { label: 'Favoritos' },
        ]}
      />
      <PageIntro
        title="Favoritos"
        description="Produtos que você marcou. Os favoritos ficam salvos neste dispositivo."
      />

      {ids.length === 0 ? (
        <EmptyState
          className="mt-6"
          icon={Heart}
          title="Nenhum favorito ainda"
          description="Explore o catálogo e toque no coração para guardar produtos aqui."
        >
          <Link to={ROUTES.home} className={buttonStyles({ variant: 'primary' })}>
            Ver catálogo
          </Link>
        </EmptyState>
      ) : loading ? (
        <div className="mt-6">
          <ProductListingSkeleton />
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          className="mt-6"
          icon={PackageX}
          title="Favoritos indisponíveis"
          description="Alguns itens salvos não estão mais no catálogo de demonstração."
          role="status"
        >
          <Link to={ROUTES.home} className={buttonStyles({ variant: 'secondary' })}>
            Voltar ao catálogo
          </Link>
        </EmptyState>
      ) : (
        <ProductListingGrid products={products} />
      )}
    </div>
  )
}

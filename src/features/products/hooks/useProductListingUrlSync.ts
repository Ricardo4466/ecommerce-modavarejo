import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'

import {
  buildListingSearchParams,
  EMPTY_LISTING_FILTERS,
  hasListingSearchIntent,
  listingSnapshotsEqual,
  parseListingSearchParams,
  type ListingFiltersSnapshot,
} from '@/features/products/lib/listing-search-params'
import { useListingFiltersStore } from '@/features/products/stores/listing-filters-store'

/**
 * Sincroniza filtros da PLP com a query string: links compartilháveis e histórico do browser.
 * Após `persist`, parâmetros na URL sobrescrevem o que estiver no localStorage.
 */
export function useProductListingUrlSync() {
  const [searchParams, setSearchParams] = useSearchParams()
  const searchKey = searchParams.toString()

  /** Evita ciclo: ignorar atualizações de URL que acabamos de emitir a partir da store. */
  const lastPushedRef = useRef<string | null>(null)
  const prevSearchKeyRef = useRef('')

  const [persistHydrated, setPersistHydrated] = useState(() =>
    useListingFiltersStore.persist.hasHydrated(),
  )

  useEffect(() => {
    if (persistHydrated) return
    return useListingFiltersStore.persist.onFinishHydration(() => setPersistHydrated(true))
  }, [persistHydrated])

  const { category, brandSlug, sort, condition, query, replaceListingFilters } =
    useListingFiltersStore(
      useShallow((s) => ({
        category: s.category,
        brandSlug: s.brandSlug,
        sort: s.sort,
        condition: s.condition,
        query: s.query,
        replaceListingFilters: s.replaceListingFilters,
      })),
    )

  // URL → store (back/forward, link externo; não sobrescreve push programático da store).
  useEffect(() => {
    if (!persistHydrated) return

    const prev = prevSearchKeyRef.current

    if (lastPushedRef.current !== null && searchKey === lastPushedRef.current) {
      prevSearchKeyRef.current = searchKey
      return
    }

    const params = new URLSearchParams(searchKey)

    if (!hasListingSearchIntent(params)) {
      if (searchKey === '' && prev !== '') {
        replaceListingFilters(EMPTY_LISTING_FILTERS)
      }
      prevSearchKeyRef.current = searchKey
      return
    }

    const parsed = parseListingSearchParams(params)
    const current = useListingFiltersStore.getState()
    const snapshot: ListingFiltersSnapshot = {
      category: current.category,
      brandSlug: current.brandSlug,
      sort: current.sort,
      condition: current.condition,
      query: current.query,
    }
    if (!listingSnapshotsEqual(parsed, snapshot)) {
      replaceListingFilters(parsed)
    }
    prevSearchKeyRef.current = searchKey
  }, [searchKey, persistHydrated, replaceListingFilters])

  // store → URL
  useEffect(() => {
    if (!persistHydrated) return
    const next = buildListingSearchParams({
      category,
      brandSlug,
      sort,
      condition,
      query,
    })
    const nextStr = next.toString()
    lastPushedRef.current = nextStr
    if (nextStr === searchKey) return
    setSearchParams(next, { replace: true })
  }, [
    persistHydrated,
    category,
    brandSlug,
    sort,
    condition,
    query,
    searchKey,
    setSearchParams,
  ])
}

import { useEffect, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'

import { Input } from '@/ui'
import { cn } from '@/lib/cn'

import { useListingFiltersStore } from '@/features/products/stores/listing-filters-store'

const DEBOUNCE_MS = 300

/**
 * Busca textual na PLP: estado local + debounce antes de gravar na store (menos requisições à API).
 */
export function ProductListingSearchField({ className }: { className?: string }) {
  const { query, setQuery } = useListingFiltersStore(
    useShallow((s) => ({ query: s.query, setQuery: s.setQuery })),
  )

  const [draft, setDraft] = useState(query)

  useEffect(() => {
    setDraft(query)
  }, [query])

  useEffect(() => {
    const id = window.setTimeout(() => {
      if (draft !== query) {
        setQuery(draft)
      }
    }, DEBOUNCE_MS)
    return () => window.clearTimeout(id)
  }, [draft, query, setQuery])

  return (
    <div className={cn('w-full', className)}>
      <Input
        type="search"
        label="Buscar"
        placeholder="Nome ou descrição…"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        autoComplete="off"
        className="min-h-11 w-full"
      />
    </div>
  )
}

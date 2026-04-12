import { useFavoritesStore } from '@/features/products/stores/favorites-store'
import { useListingFiltersStore } from '@/features/products/stores/listing-filters-store'
import {
  COOKIE_CONSENT_STORAGE_KEY,
  removeOptionalPersistedKeys,
} from '@/lib/cookie-consent'
import { useThemeStore } from '@/lib/stores/theme-store'

/** Grava o aceite e força persistência do estado atual dos stores opcionais. */
export function acceptOptionalCookies(): void {
  try {
    localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, 'accepted')
  } catch {
    /* ignore */
  }
  flushOptionalStoresAfterAccept()
}

/** Grava a recusa, apaga chaves opcionais e zera estado em memória (favoritos, filtros, tema). */
export function rejectOptionalCookies(): void {
  try {
    localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, 'rejected')
  } catch {
    /* ignore */
  }
  removeOptionalPersistedKeys()
  useFavoritesStore.setState({ ids: [] })
  useListingFiltersStore.getState().resetFilters()
  useThemeStore.setState({ preference: 'light' })
}

function flushOptionalStoresAfterAccept(): void {
  useFavoritesStore.setState((s) => ({ ids: [...s.ids] }))
  useListingFiltersStore.setState((s) => ({ ...s }))
  useThemeStore.setState((s) => ({ preference: s.preference }))
}

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type FavoritesState = {
  ids: string[]
  toggle: (productId: string) => void
  clear: () => void
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set) => ({
      ids: [],
      toggle: (productId) =>
        set((s) => {
          const next = new Set(s.ids)
          if (next.has(productId)) next.delete(productId)
          else next.add(productId)
          return { ids: [...next] }
        }),
      clear: () => set({ ids: [] }),
    }),
    {
      name: 'ecommerce-modavarejo:favorites',
      partialize: (s) => ({ ids: s.ids }),
    },
  ),
)

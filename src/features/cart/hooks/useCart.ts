import { useShallow } from 'zustand/react/shallow'

import { useCartStore } from '@/features/cart/stores/cart-store'

export function useCart() {
  return useCartStore(
    useShallow((s) => ({
      lines: s.lines,
      itemCount: s.lines.reduce((acc, l) => acc + l.quantity, 0),
      miniCartOpen: s.miniCartOpen,
      openMiniCart: s.openMiniCart,
      closeMiniCart: s.closeMiniCart,
      addItem: s.addItem,
      setQuantity: s.setQuantity,
      removeItem: s.removeItem,
      clear: s.clear,
    })),
  )
}

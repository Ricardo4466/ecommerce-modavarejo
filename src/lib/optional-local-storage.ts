import { createJSONStorage } from 'zustand/middleware'

import { allowsOptionalCookies } from '@/lib/cookie-consent'

/**
 * Persistência local só quando o usuário aceitou cookies opcionais.
 * Antes do aceite ou após recusa: comportamento em memória (nada gravado nessas chaves).
 */
export function createOptionalLocalStorage() {
  return createJSONStorage(() => {
    if (typeof window === 'undefined') {
      return {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      }
    }
    return {
      getItem: (name) => {
        if (!allowsOptionalCookies()) return null
        return localStorage.getItem(name)
      },
      setItem: (name, value) => {
        if (!allowsOptionalCookies()) return
        localStorage.setItem(name, value)
      },
      removeItem: (name) => {
        if (!allowsOptionalCookies()) return
        localStorage.removeItem(name)
      },
    }
  })
}

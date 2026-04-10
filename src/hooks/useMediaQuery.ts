import { useSyncExternalStore } from 'react'

/**
 * Observa `window.matchMedia` de forma compatível com SSR (snapshot do servidor = `serverFallback`).
 */
export function useMediaQuery(query: string, serverFallback = false): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query)
      mq.addEventListener('change', onChange)
      return () => mq.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    () => serverFallback,
  )
}

import { useEffect, useState } from 'react'

import type { Product } from '@/types'
import { productService } from '@/features/products/services/product.service'

type Status = 'idle' | 'loading' | 'success' | 'error'

export function useProduct(slug: string | undefined) {
  const [status, setStatus] = useState<Status>('idle')
  const [data, setData] = useState<Product | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) {
      return
    }

    let cancelled = false

    void (async () => {
      setStatus('loading')
      setError(null)
      try {
        const product = await productService.getBySlug(slug)
        if (!cancelled) {
          setData(product)
          if (product) {
            setStatus('success')
          } else {
            setError('Produto não encontrado.')
            setStatus('error')
          }
        }
      } catch {
        if (!cancelled) {
          setError('Erro ao carregar o produto.')
          setStatus('error')
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [slug])

  if (!slug) {
    return { status: 'idle' as const, data: null, error: null, isLoading: false }
  }

  return { status, data, error, isLoading: status === 'loading' }
}

import { Share2 } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/cn'

export type ProductShareButtonProps = {
  productName: string
  className?: string
}

export function ProductShareButton({ productName, className }: ProductShareButtonProps) {
  const [copied, setCopied] = useState(false)
  const copiedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (copiedTimeoutRef.current) clearTimeout(copiedTimeoutRef.current)
    }
  }, [])

  const handleClick = useCallback(async () => {
    const url = window.location.href

    if ('share' in navigator && typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: productName, url })
        return
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return
      }
    }

    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      if (copiedTimeoutRef.current) clearTimeout(copiedTimeoutRef.current)
      copiedTimeoutRef.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable */
    }
  }, [productName])

  return (
    <button
      type="button"
      className={cn(
        'inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-border bg-card/90 text-muted-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        copied && 'text-primary',
        className,
      )}
      aria-label={copied ? 'Link copiado' : 'Compartilhar produto'}
      title={copied ? 'Link copiado' : 'Compartilhar'}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        void handleClick()
      }}
    >
      <Share2 className="size-5" strokeWidth={1.75} aria-hidden />
    </button>
  )
}

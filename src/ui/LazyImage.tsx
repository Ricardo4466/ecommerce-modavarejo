import { forwardRef, type ImgHTMLAttributes } from 'react'

import { cn } from '@/lib/cn'

export type LazyImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  /** Carrega com prioridade (hero / LCP) */
  eager?: boolean
}

/** Imagem com lazy loading nativo, decode assíncrono e transição suave ao carregar. */
export const LazyImage = forwardRef<HTMLImageElement, LazyImageProps>(
  function LazyImage(
    {
      eager = false,
      loading,
      className,
      decoding = 'async',
      alt = '',
      width,
      height,
      style,
      ...rest
    },
    ref,
  ) {
    const ratioStyle =
      width !== undefined && height !== undefined
        ? ({ aspectRatio: `${String(width)} / ${String(height)}` } as const)
        : {}

    return (
      <img
        ref={ref}
        alt={alt}
        width={width}
        height={height}
        loading={eager ? 'eager' : loading ?? 'lazy'}
        decoding={decoding}
        fetchPriority={eager ? 'high' : undefined}
        className={cn(
          'bg-muted/30 transition-[opacity,filter] duration-700 [transition-timing-function:cubic-bezier(0.33,1,0.68,1)] motion-reduce:transition-none',
          className,
        )}
        style={{ ...ratioStyle, ...style }}
        {...rest}
      />
    )
  },
)

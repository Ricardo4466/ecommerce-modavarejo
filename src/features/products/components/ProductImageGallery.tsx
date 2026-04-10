import { useCallback, useState, type KeyboardEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { cn } from '@/lib/cn'
import { easeOutExpo } from '@/lib/motion'
import { ProductPhotoPlaceholder } from '@/features/products/components/ProductPhotoPlaceholder'
import { LazyImage } from '@/ui'

type Props = {
  productName: string
  urls: string[]
  className?: string
}

export function ProductImageGallery({ productName, urls, className }: Props) {
  const list = urls.filter(Boolean)
  const [active, setActive] = useState(0)

  const count = list.length
  const safeIndex = count ? Math.min(active, count - 1) : 0
  const mainSrc = count ? list[safeIndex] : ''

  const go = useCallback(
    (next: number) => {
      if (!count) return
      const i = ((next % count) + count) % count
      setActive(i)
    },
    [count],
  )

  const onKeyDown = (e: KeyboardEvent) => {
    if (!count || count < 2) return
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      go(safeIndex - 1)
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      go(safeIndex + 1)
    }
  }

  if (!count) {
    return (
      <div
        className={cn(
          'aspect-square w-full overflow-hidden rounded-2xl border border-dashed border-border bg-muted/30',
          className,
        )}
      >
        <ProductPhotoPlaceholder className="h-full w-full rounded-2xl" />
      </div>
    )
  }

  const alt = `${productName} — imagem ${safeIndex + 1} de ${count}`

  return (
    <div className={cn('space-y-4', className)}>
      <div
        className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-md ring-1 ring-black/5 dark:ring-white/10"
        tabIndex={0}
        role="region"
        aria-roledescription="Galeria de imagens"
        aria-label={`Fotos de ${productName}`}
        onKeyDown={onKeyDown}
      >
        <div className="relative aspect-square w-full overflow-hidden bg-muted/20">
          <AnimatePresence mode="wait">
            <motion.div
              key={mainSrc}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: easeOutExpo }}
            >
              <LazyImage
                eager
                src={mainSrc}
                alt={alt}
                width={960}
                height={960}
                className="h-full w-full object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </div>
        {count > 1 && (
          <>
            <motion.button
              type="button"
              aria-label="Imagem anterior"
              className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border/80 bg-background/90 text-foreground opacity-0 shadow-sm backdrop-blur-sm transition-opacity hover:bg-background focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group-hover:opacity-100 md:left-3"
              onClick={() => go(safeIndex - 1)}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 500, damping: 22 }}
            >
              ‹
            </motion.button>
            <motion.button
              type="button"
              aria-label="Próxima imagem"
              className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border/80 bg-background/90 text-foreground opacity-0 shadow-sm backdrop-blur-sm transition-opacity hover:bg-background focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group-hover:opacity-100 md:right-3"
              onClick={() => go(safeIndex + 1)}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 500, damping: 22 }}
            >
              ›
            </motion.button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {list.map((src, i) => {
            const selected = i === safeIndex
            return (
              <motion.button
                key={src}
                type="button"
                aria-label={`Mostrar imagem ${i + 1}`}
                aria-current={selected ? 'true' : undefined}
                onClick={() => setActive(i)}
                whileTap={{ scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 520, damping: 24 }}
                className={cn(
                  'relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:h-20 sm:w-20',
                  selected
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'border-transparent opacity-80 hover:opacity-100',
                )}
              >
                <LazyImage
                  src={src}
                  alt=""
                  width={160}
                  height={160}
                  className="h-full w-full object-cover"
                />
              </motion.button>
            )
          })}
        </div>
      )}
    </div>
  )
}

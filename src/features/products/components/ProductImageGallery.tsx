import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Maximize2 } from 'lucide-react'

import { cn } from '@/lib/cn'
import { easeOutExpo } from '@/lib/motion'
import { ProductPhotoPlaceholder } from '@/features/products/components/ProductPhotoPlaceholder'
import { LazyImage, Modal } from '@/ui'

type Props = {
  productName: string
  urls: string[]
  className?: string
}

const ZOOM_BG_SIZE_PCT = 250

export function ProductImageGallery({ productName, urls, className }: Props) {
  const list = urls.filter(Boolean)
  const [active, setActive] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 })
  const stageRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

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

  const onStageMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = stageRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    setPos({
      x: Math.min(1, Math.max(0, x)),
      y: Math.min(1, Math.max(0, y)),
    })
  }

  useEffect(() => {
    if (!lightboxOpen || !count) return
    const onKey = (e: Event) => {
      if (e instanceof KeyboardEvent) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault()
          go(safeIndex - 1)
        }
        if (e.key === 'ArrowRight') {
          e.preventDefault()
          go(safeIndex + 1)
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxOpen, count, go, safeIndex])

  const showHoverZoom = !prefersReducedMotion && hovering && count > 0
  const alt = `${productName} — imagem ${safeIndex + 1} de ${count}`

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

  return (
    <div className={cn('space-y-4 overflow-visible', className)}>
      {/*
        Zoom estilo Amazon: lente + painel só existem enquanto o cursor está sobre a imagem.
        O painel é um flyout absoluto à direita; fora do hover não há coluna reservada nem placeholder.
      */}
      <div className="relative w-full min-w-0 overflow-visible">
        <div
          className="group relative min-w-0 overflow-hidden rounded-2xl border border-border bg-card shadow-md ring-1 ring-black/5 dark:ring-white/10"
          tabIndex={0}
          role="region"
          aria-roledescription="Galeria de imagens"
          aria-label={`Fotos de ${productName}`}
          onKeyDown={onKeyDown}
        >
          <div
            ref={stageRef}
            className="relative aspect-square w-full cursor-crosshair overflow-hidden bg-muted/20 lg:cursor-crosshair"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            onMouseMove={onStageMove}
            onClick={() => {
              if (prefersReducedMotion || window.matchMedia('(max-width: 1023px)').matches) {
                setLightboxOpen(true)
              }
            }}
          >
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

            {showHoverZoom ? (
              <div
                className="pointer-events-none absolute z-20 h-[28%] w-[28%] rounded-md border-2 border-primary/55 bg-primary/12 shadow-sm backdrop-blur-[1px]"
                style={{
                  left: `${pos.x * 100}%`,
                  top: `${pos.y * 100}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                aria-hidden
              />
            ) : null}

            {count > 1 ? (
              <>
                <motion.button
                  type="button"
                  aria-label="Imagem anterior"
                  className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-border/80 bg-background/90 text-foreground opacity-0 shadow-sm backdrop-blur-sm transition-opacity hover:bg-background focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group-hover:opacity-100 md:left-3"
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
                  className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-border/80 bg-background/90 text-foreground opacity-0 shadow-sm backdrop-blur-sm transition-opacity hover:bg-background focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group-hover:opacity-100 md:right-3"
                  onClick={() => go(safeIndex + 1)}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                >
                  ›
                </motion.button>
              </>
            ) : null}

            <div className="pointer-events-none absolute bottom-2 right-2 z-10 flex items-center gap-2">
              <span className="rounded-full border border-border/80 bg-background/90 px-2 py-1 text-[0.65rem] font-medium text-muted-foreground shadow-sm backdrop-blur-sm md:hidden">
                {prefersReducedMotion ? 'Toque para ampliar' : 'Clique na imagem ou expanda'}
              </span>
              <span className="hidden rounded-full border border-border/80 bg-background/90 px-2 py-1 text-[0.65rem] font-medium text-muted-foreground shadow-sm backdrop-blur-sm md:inline">
                {prefersReducedMotion
                  ? 'Use o botão expandir para detalhes'
                  : 'Passe o mouse sobre a foto para ampliar'}
              </span>
            </div>

            <button
              type="button"
              aria-label="Abrir imagem em tela cheia"
              className="pointer-events-auto absolute bottom-2 left-2 z-10 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border/80 bg-background/90 text-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={(e) => {
                e.stopPropagation()
                setLightboxOpen(true)
              }}
            >
              <Maximize2 className="h-4 w-4" strokeWidth={2} aria-hidden />
            </button>
          </div>
        </div>

        {showHoverZoom ? (
          <div
            className="pointer-events-none absolute left-full top-0 z-20 ml-3 hidden aspect-square w-[min(44rem,calc(65vw-1.5rem))] max-w-[min(92vw,44rem)] overflow-hidden rounded-2xl border border-border bg-card shadow-xl ring-1 ring-black/10 dark:ring-white/10 md:block"
            aria-hidden
          >
            <div
              className="h-full w-full bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${mainSrc})`,
                backgroundSize: `${ZOOM_BG_SIZE_PCT}% ${ZOOM_BG_SIZE_PCT}%`,
                backgroundPosition: `${pos.x * 100}% ${pos.y * 100}%`,
              }}
            />
          </div>
        ) : null}
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
                  'relative h-16 w-16 shrink-0 cursor-pointer overflow-hidden rounded-xl border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:h-20 sm:w-20',
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

      <Modal
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        title={productName}
        description={`Foto ${safeIndex + 1} de ${count}`}
        className="z-80"
      >
        <div className="relative mx-auto flex max-h-[min(80vh,720px)] w-full max-w-3xl items-center justify-center">
          <LazyImage
            eager
            src={mainSrc}
            alt={alt}
            width={1200}
            height={1200}
            className="max-h-[min(80vh,720px)] w-auto max-w-full object-contain"
          />
          {count > 1 ? (
            <>
              <button
                type="button"
                aria-label="Imagem anterior"
                className="absolute left-1 top-1/2 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-border bg-card/95 text-lg shadow-md hover:bg-card"
                onClick={() => go(safeIndex - 1)}
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="Próxima imagem"
                className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-border bg-card/95 text-lg shadow-md hover:bg-card"
                onClick={() => go(safeIndex + 1)}
              >
                ›
              </button>
            </>
          ) : null}
        </div>
      </Modal>
    </div>
  )
}

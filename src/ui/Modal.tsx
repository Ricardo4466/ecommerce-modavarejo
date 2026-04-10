import { useEffect, useRef, type ReactNode } from 'react'

import { cn } from '@/lib/cn'

export type ModalProps = {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  className?: string
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  className,
}: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onDialogClose = () => {
      onCloseRef.current()
    }
    el.addEventListener('close', onDialogClose)

    if (open && !el.open) {
      el.showModal()
    } else if (!open && el.open) {
      el.close()
    }

    return () => el.removeEventListener('close', onDialogClose)
  }, [open])

  return (
    <dialog
      ref={ref}
      className={cn(
        'modal-sheet-root fixed inset-0 z-[70] m-0 w-full max-w-none translate-x-0 translate-y-0 border-0 bg-transparent p-0 text-foreground shadow-none backdrop:bg-black/45 open:flex open:flex-col md:backdrop:bg-black/50',
        className,
      )}
      aria-labelledby="modal-title"
      aria-describedby={description ? 'modal-description' : undefined}
      aria-modal="true"
    >
      <div
        className="flex min-h-0 flex-1 flex-col justify-end bg-transparent md:items-center md:justify-center md:p-3"
        onClick={() => ref.current?.close()}
      >
        <div
          className={cn(
            'modal-sheet-panel flex min-h-0 w-full flex-shrink-0 flex-col overflow-hidden rounded-t-3xl border border-border border-b-0 bg-card pt-0 shadow-2xl md:w-[min(100%-1.5rem,28rem)] md:rounded-2xl md:border-b',
            'pb-[max(0px,env(safe-area-inset-bottom))]',
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="flex shrink-0 justify-center pt-2 pb-1 md:hidden"
            role="presentation"
          >
            <span className="block h-1 w-10 rounded-full bg-muted-foreground/35" />
          </div>
          <header className="flex shrink-0 items-start justify-between gap-3 border-b border-border px-4 py-4 pt-[max(0.5rem,env(safe-area-inset-top))] md:px-5 md:pt-4">
            <div className="min-w-0">
              <h2 id="modal-title" className="text-lg font-semibold text-text-h">
                {title}
              </h2>
              {description ? (
                <p
                  id="modal-description"
                  className="mt-1 text-sm text-muted-foreground"
                >
                  {description}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary-200/80 dark:hover:bg-secondary-800/80"
              onClick={() => ref.current?.close()}
              aria-label="Fechar"
            >
              ×
            </button>
          </header>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:px-5">
            {children}
          </div>
        </div>
      </div>
    </dialog>
  )
}

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'

import { CartLineItem } from '@/features/cart/components/CartLineItem'
import { useCart } from '@/features/cart/hooks/useCart'
import { useCartTotals } from '@/features/cart/hooks/useCartTotals'
import { formatCurrencyFromCents } from '@/lib/formatCurrency'
import { ROUTES } from '@/lib/routes'
import { cn } from '@/lib/cn'
import { Button, Skeleton, buttonStyles } from '@/ui'

export function MiniCartDrawer() {
  const { lines, miniCartOpen, closeMiniCart, setQuantity, removeItem } = useCart()
  const { subtotalCents, isLoading: totalsLoading } = useCartTotals(lines)
  const ref = useRef<HTMLDialogElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onDialogClose = () => {
      closeMiniCart()
    }
    el.addEventListener('close', onDialogClose)
    if (miniCartOpen && !el.open) {
      el.showModal()
      queueMicrotask(() => closeBtnRef.current?.focus())
    } else if (!miniCartOpen && el.open) {
      el.close()
    }
    return () => el.removeEventListener('close', onDialogClose)
  }, [miniCartOpen, closeMiniCart])

  /* Portal em document.body: evita empilhamento preso ao .shell / PDP (ex.: coluna z-[100]). */
  const dialog = (
    <dialog
      ref={ref}
      dir="ltr"
      className={cn(
        'mini-cart-dialog',
        /* Abaixo do skip link (z-10000 no foco); acima do header (50), PDP e modais. */
        'fixed inset-0 z-9999 m-0 max-h-none max-w-none translate-x-0 translate-y-0',
        'border-0 bg-transparent p-0 text-foreground shadow-none',
        /* Sem escurecimento atrás do carrinho (backdrop do dialog). */
        'backdrop:bg-transparent open:flex open:flex-col',
      )}
      aria-labelledby="mini-cart-title"
      aria-modal="true"
    >
      {/*
        Mobile: bottom sheet (fluxo normal).
        Desktop: painel com position absolute + right:0 — não depende de flex/grid nem do UA
        shrink-wrap do <dialog> (globals: dialog.mini-cart-dialog[open] em viewport cheia).
      */}
      <div
        className="relative flex h-full min-h-0 w-full flex-1 cursor-pointer flex-col justify-end bg-transparent md:block md:h-full md:min-h-full"
        onClick={() => ref.current?.close()}
      >
        <div
          className={cn(
            'mini-cart-panel',
            'flex max-h-[min(92vh,720px)] w-full shrink-0 flex-col overflow-hidden md:min-h-0',
            'rounded-t-3xl border border-border border-b-0 bg-card shadow-2xl',
            /* Desktop: coluna à direita, do fim do header até o rodapé da viewport (altura “cheia” útil). */
            'md:absolute md:right-0 md:left-auto md:top-(--header-height) md:bottom-0 md:h-auto md:max-h-none',
            'md:w-[min(32rem,100%)] md:max-w-lg md:shrink-0 md:cursor-auto md:rounded-none md:border md:border-r-0 md:border-border md:border-t md:pb-0 md:shadow-2xl',
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

          <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3 pt-[max(0.5rem,env(safe-area-inset-top))] md:px-5 md:pt-4">
            <h2 id="mini-cart-title" className="text-lg font-semibold text-text-h">
              Carrinho
            </h2>
            <button
              ref={closeBtnRef}
              type="button"
              className="inline-flex min-h-11 min-w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-border bg-secondary text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary-200/80 dark:hover:bg-secondary-800/80"
              onClick={() => ref.current?.close()}
              aria-label="Fechar carrinho"
            >
              ×
            </button>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 md:px-5">
            {lines.length === 0 ? (
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <ShoppingBag className="h-12 w-12 text-muted-foreground/50" strokeWidth={1.25} />
                <p className="text-sm text-muted-foreground">Seu carrinho está vazio.</p>
                <Button type="button" variant="secondary" onClick={() => ref.current?.close()}>
                  Continuar comprando
                </Button>
              </div>
            ) : (
              <ul className="m-0 flex list-none flex-col gap-3 p-0">
                {lines.map((line) => (
                  <CartLineItem
                    key={line.productId}
                    line={line}
                    onChangeQty={setQuantity}
                    onRemove={removeItem}
                  />
                ))}
              </ul>
            )}
          </div>

          {lines.length > 0 ? (
            <footer className="shrink-0 border-t border-border bg-card/95 px-4 py-4 backdrop-blur-sm md:px-5">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-sm font-medium text-muted-foreground">Subtotal</span>
                {totalsLoading ? (
                  <Skeleton className="h-7 w-28 rounded-md" />
                ) : (
                  <span className="text-lg font-bold tabular-nums text-text-h">
                    {formatCurrencyFromCents(subtotalCents)}
                  </span>
                )}
              </div>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <Link
                  to={ROUTES.cart}
                  className={buttonStyles({
                    variant: 'secondary',
                    size: 'md',
                    className: 'min-h-11 w-full cursor-pointer justify-center sm:flex-1',
                  })}
                  onClick={() => ref.current?.close()}
                >
                  Ver carrinho
                </Link>
                <Link
                  to={ROUTES.checkout}
                  className={buttonStyles({
                    variant: 'primary',
                    size: 'md',
                    className: 'min-h-11 w-full cursor-pointer justify-center sm:flex-1',
                  })}
                  onClick={() => ref.current?.close()}
                >
                  Finalizar compra
                </Link>
              </div>
            </footer>
          ) : null}
        </div>
      </div>
    </dialog>
  )

  if (typeof document === 'undefined') return null
  return createPortal(dialog, document.body)
}

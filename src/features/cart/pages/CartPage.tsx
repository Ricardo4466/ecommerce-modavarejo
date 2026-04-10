import { motion } from 'framer-motion'
import { Lock, ShieldCheck, ShoppingBag, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'

import { CartLineItem } from '@/features/cart/components/CartLineItem'
import { useCart } from '@/features/cart/hooks/useCart'
import { useCartTotals } from '@/features/cart/hooks/useCartTotals'
import {
  Breadcrumb,
  Button,
  buttonStyles,
  EmptyState,
  Skeleton,
} from '@/ui'
import { PageIntro } from '@/components/PageIntro'
import { formatCurrencyFromCents } from '@/lib/formatCurrency'
import { cn } from '@/lib/cn'
import { ROUTES } from '@/lib/routes'

export function CartPage() {
  const { lines, removeItem, setQuantity, clear } = useCart()
  const { subtotalCents, isLoading: totalsLoading } = useCartTotals(lines)

  return (
    <div className="page cart-page">
      <Breadcrumb
        className="mb-6"
        items={[
          { label: 'Início', href: ROUTES.home },
          { label: 'Carrinho' },
        ]}
      />

      <PageIntro
        className="mb-8"
        title="Carrinho"
        titleClassName="page__title mb-2 text-3xl md:text-4xl"
        description="Revise os itens antes do checkout. Os valores são atualizados automaticamente."
        descriptionClassName="page__lead text-base"
      />

      {lines.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="Seu carrinho está vazio"
          description="Adicione produtos pelo catálogo e eles aparecerão aqui com quantidade e totais."
        >
          <Link to={ROUTES.home} className={buttonStyles({ variant: 'primary', size: 'lg' })}>
            Explorar catálogo
          </Link>
        </EmptyState>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,22rem)] lg:items-start">
          <div>
            <ul className="m-0 flex list-none flex-col gap-4 p-0">
              {lines.map((line) => (
                <CartLineItem
                  key={line.productId}
                  line={line}
                  onChangeQty={setQuantity}
                  onRemove={removeItem}
                />
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button type="button" variant="secondary" onClick={clear}>
                Limpar carrinho
              </Button>
            </div>
          </div>

          <aside className="lg:sticky lg:top-[calc(var(--header-height)+1rem)]">
            <div
              className={cn(
                'rounded-2xl border border-border/80 bg-card p-5 shadow-md',
                'transition-shadow duration-300 ease-in-out',
              )}
            >
              <h2 className="text-sm font-extrabold uppercase tracking-label text-muted-foreground">
                Resumo do pedido
              </h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="font-semibold tabular-nums text-text-h">
                    {totalsLoading ? (
                      <Skeleton className="ml-auto h-5 w-24 rounded-md" />
                    ) : (
                      formatCurrencyFromCents(subtotalCents)
                    )}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Frete estimado</dt>
                  <dd className="text-xs font-medium text-muted-foreground">No checkout</dd>
                </div>
              </dl>
              <p className="mt-4 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
                Impostos e frete final serão calculados na próxima etapa. Ambiente seguro para
                pagamento.
              </p>
              <motion.div className="mt-6" whileTap={{ scale: 0.99 }}>
                <Link
                  to={ROUTES.checkout}
                  className={buttonStyles({
                    variant: 'primary',
                    size: 'lg',
                    className:
                      'w-full min-h-12 shadow-glow transition-all duration-300 ease-in-out',
                  })}
                >
                  Ir para checkout
                </Link>
              </motion.div>
              <ul className="mt-6 flex list-none flex-col gap-3 p-0 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <ShieldCheck
                    className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                    strokeWidth={2}
                    aria-hidden
                  />
                  <span>Compra protegida e dados cifrados na finalização.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Truck className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={2} aria-hidden />
                  <span>Prazo e transportadoras exibidos após o endereço.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Lock className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={2} aria-hidden />
                  <span>Checkout em conformidade com boas práticas de PCI.</span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}

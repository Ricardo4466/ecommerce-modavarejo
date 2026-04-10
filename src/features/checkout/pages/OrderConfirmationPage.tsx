import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CheckCircle2, Package } from 'lucide-react'

import { Breadcrumb, ErrorState, Skeleton, buttonStyles } from '@/ui'
import { formatCurrencyFromCents } from '@/lib/formatCurrency'
import { httpGet, isHttpError } from '@/lib/http/client'
import { ROUTES } from '@/lib/routes'
import type { Order } from '@/types/order'
import { paymentMethodLabel } from '@/types/order'

export function OrderConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!orderId) {
      setLoading(false)
      setError('Pedido inválido.')
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    void httpGet<Order>(`/api/orders/${encodeURIComponent(orderId)}`)
      .then((o) => {
        if (!cancelled) setOrder(o)
      })
      .catch((e) => {
        if (!cancelled) {
          if (isHttpError(e) && e.status === 404) {
            setError('Pedido não encontrado. Ele pode ter sido criado antes de reiniciar a API.')
          } else {
            setError('Não foi possível carregar o pedido.')
          }
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [orderId])

  const shortId = order ? `${order.id.slice(0, 8)}…` : ''

  return (
    <div className="page order-confirmation mx-auto w-full max-w-3xl pb-12 pt-6 md:pb-16 md:pt-8">
      <Breadcrumb
        className="mb-6"
        items={[
          { label: 'Início', href: ROUTES.home },
          { label: 'Pedido confirmado' },
        ]}
      />

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-2/3 max-w-md rounded-lg" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
      ) : error ? (
        <ErrorState title="Não foi possível exibir o pedido" description={error}>
          <Link to={ROUTES.home} className={buttonStyles({ variant: 'primary' })}>
            Voltar ao catálogo
          </Link>
        </ErrorState>
      ) : order ? (
        <>
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-success">
                <CheckCircle2 className="h-8 w-8 shrink-0" strokeWidth={2} aria-hidden />
                <h1 className="page__title text-3xl md:text-4xl">Pedido confirmado</h1>
              </div>
              <p className="page__lead muted max-w-xl">
                Obrigado pela compra. Guarde o número do pedido para acompanhamento.
              </p>
            </div>
            <div className="rounded-xl border border-border/80 bg-card px-4 py-3 text-sm shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-label text-muted-foreground">
                Número do pedido
              </p>
              <p className="mt-1 font-mono text-sm font-medium text-text-h" title={order.id}>
                {shortId}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {new Date(order.createdAt).toLocaleString('pt-BR', {
                  dateStyle: 'long',
                  timeStyle: 'short',
                })}
              </p>
            </div>
          </div>

          <section className="mb-8 rounded-2xl border border-border/80 bg-card p-5 shadow-sm md:p-7">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-text-h">
              <Package className="h-5 w-5 text-primary" strokeWidth={2} aria-hidden />
              Itens
            </h2>
            <ul className="mt-4 flex list-none flex-col gap-3 border-b border-border/80 p-0 pb-4 text-sm">
              {order.lines.map((line) => (
                <li key={`${line.productId}-${line.quantity}`} className="flex justify-between gap-4">
                  <span className="min-w-0">
                    <span className="font-medium text-text-h">{line.name}</span>
                    <span className="ml-2 text-muted-foreground">×{line.quantity}</span>
                  </span>
                  <span className="shrink-0 tabular-nums text-text-h">
                    {formatCurrencyFromCents(line.unitPriceCents * line.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between text-base font-semibold">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="tabular-nums text-text-h">
                {formatCurrencyFromCents(order.subtotalCents)}
              </span>
            </div>
          </section>

          <section className="mb-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/80 bg-muted/15 p-5 text-sm">
              <p className="text-xs font-semibold uppercase tracking-label text-muted-foreground">
                Entrega
              </p>
              <p className="mt-2 whitespace-pre-line text-text-h">
                {order.delivery.cep && <span>CEP {order.delivery.cep}</span>}
                {order.delivery.city ? (
                  <>
                    {order.delivery.cep ? '\n' : ''}
                    {order.delivery.city}
                  </>
                ) : null}
                {order.delivery.address ? (
                  <>
                    {'\n'}
                    {order.delivery.address}
                  </>
                ) : null}
              </p>
            </div>
            <div className="rounded-2xl border border-border/80 bg-muted/15 p-5 text-sm">
              <p className="text-xs font-semibold uppercase tracking-label text-muted-foreground">
                Pagamento
              </p>
              <p className="mt-2 font-medium text-text-h">
                {paymentMethodLabel(order.paymentMethod)}
              </p>
            </div>
          </section>

          <div className="flex flex-wrap gap-3">
            <Link to={ROUTES.home} className={buttonStyles({ variant: 'primary', size: 'lg' })}>
              Continuar comprando
            </Link>
            <Link to={ROUTES.cart} className={buttonStyles({ variant: 'secondary', size: 'lg' })}>
              Ver carrinho
            </Link>
          </div>
        </>
      ) : null}
    </div>
  )
}

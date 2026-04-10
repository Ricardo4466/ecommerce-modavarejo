import { type FormEvent, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BadgeCheck, CreditCard, MapPin } from 'lucide-react'

import { useCart } from '@/features/cart/hooks/useCart'
import { useCartTotals } from '@/features/cart/hooks/useCartTotals'
import { productService } from '@/features/products/services/product.service'
import {
  Breadcrumb,
  Button,
  Input,
  Select,
  Skeleton,
  buttonStyles,
} from '@/ui'
import { formatCurrencyFromCents } from '@/lib/formatCurrency'
import { httpPostJson, isHttpError } from '@/lib/http/client'
import { ROUTES } from '@/lib/routes'
import type { Order } from '@/types/order'
import {
  getDeliveryFieldErrors,
  getPaymentFieldErrors,
  mergeCheckoutFieldErrors,
  type CheckoutFieldErrors,
} from '@/features/checkout/lib/checkout-validation'

export function CheckoutPage() {
  const navigate = useNavigate()
  const { lines, clear } = useCart()
  const { subtotalCents, isLoading: totalsLoading } = useCartTotals(lines)

  const [cep, setCep] = useState('')
  const [city, setCity] = useState('')
  const [address, setAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pix' | 'boleto'>('card')
  const [cardName, setCardName] = useState('')
  const [installments, setInstallments] = useState('1x sem juros')
  const [submitting, setSubmitting] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<CheckoutFieldErrors>({})

  function clearFieldError<K extends keyof CheckoutFieldErrors>(key: K) {
    setFieldErrors((prev) => {
      if (prev[key] == null) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  const uniqueIds = useMemo(() => [...new Set(lines.map((l) => l.productId))], [lines])
  const uniqueIdsKey = uniqueIds.join(',')
  const [nameById, setNameById] = useState<Record<string, string>>({})

  useEffect(() => {
    if (uniqueIds.length === 0) {
      setNameById({})
      return
    }

    let cancelled = false

    Promise.all(
      uniqueIds.map((id) =>
        productService
          .getById(id)
          .then((p) => [id, p?.name ?? 'Produto'] as const)
          .catch(() => [id, 'Produto'] as const),
      ),
    ).then((rows) => {
      if (!cancelled) setNameById(Object.fromEntries(rows))
    })

    return () => {
      cancelled = true
    }
  }, [uniqueIdsKey])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setApiError(null)

    const deliveryErr = getDeliveryFieldErrors(cep, city, address)
    const paymentErr = getPaymentFieldErrors(paymentMethod, cardName, installments)
    const merged = mergeCheckoutFieldErrors(deliveryErr, paymentErr)
    if (Object.keys(merged).length > 0) {
      setFieldErrors(merged)
      return
    }
    setFieldErrors({})

    setSubmitting(true)
    try {
      const order = await httpPostJson<
        {
          lines: { productId: string; quantity: number }[]
          delivery: { cep: string; city: string; address: string }
          paymentMethod: 'card' | 'pix' | 'boleto'
        },
        Order
      >('/api/orders', {
        lines: lines.map((l) => ({ productId: l.productId, quantity: l.quantity })),
        delivery: { cep, city, address },
        paymentMethod,
      })
      clear()
      navigate(ROUTES.order(order.id), { replace: true })
    } catch (err) {
      setFieldErrors({})
      if (isHttpError(err)) {
        setApiError(err.message)
      } else {
        setApiError('Não foi possível finalizar o pedido. Tente novamente.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page checkout-page">
      <Breadcrumb
        className="mb-6"
        items={[
          { label: 'Início', href: ROUTES.home },
          { label: 'Carrinho', href: ROUTES.cart },
          { label: 'Checkout' },
        ]}
      />

      <header className="mb-8">
        <h1 className="page__title mb-2 text-3xl md:text-4xl">Checkout</h1>
        <p className="page__lead muted max-w-2xl">
          Preencha entrega e pagamento. O pedido é registrado na API (memória) e o carrinho é
          esvaziado ao concluir — integração com gateway real pode ser plugada depois.
        </p>
      </header>

      {lines.length === 0 ? (
        <div className="rounded-2xl border border-border/80 bg-card p-8 text-center shadow-sm">
          <p className="font-semibold text-text-h">Seu carrinho está vazio</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Adicione produtos antes de finalizar a compra.
          </p>
          <Link
            to={ROUTES.home}
            className={buttonStyles({
              variant: 'primary',
              className: 'mt-6 inline-flex min-h-11',
            })}
          >
            Ver catálogo
          </Link>
        </div>
      ) : (
        <form
          className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,20rem)] lg:items-start"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="space-y-10">
            <CheckoutStepper />

            {apiError ? (
              <div
                role="alert"
                className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
              >
                {apiError}
              </div>
            ) : null}

            <section className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm md:p-7">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-text-h">
                <MapPin className="h-5 w-5 text-primary" strokeWidth={2} aria-hidden />
                Entrega
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Endereço para cálculo de frete e nota fiscal (demonstração).
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Input
                  label="CEP"
                  placeholder="00000-000"
                  autoComplete="postal-code"
                  value={cep}
                  error={fieldErrors.cep}
                  onChange={(e) => {
                    setCep(e.target.value)
                    clearFieldError('cep')
                  }}
                />
                <Input
                  label="Cidade"
                  placeholder="São Paulo"
                  autoComplete="address-level2"
                  value={city}
                  error={fieldErrors.city}
                  onChange={(e) => {
                    setCity(e.target.value)
                    clearFieldError('city')
                  }}
                />
                <Input
                  className="sm:col-span-2"
                  label="Endereço"
                  placeholder="Rua, número, complemento"
                  autoComplete="street-address"
                  value={address}
                  error={fieldErrors.address}
                  onChange={(e) => {
                    setAddress(e.target.value)
                    clearFieldError('address')
                  }}
                />
              </div>
            </section>

            <section className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm md:p-7">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-text-h">
                <CreditCard className="h-5 w-5 text-primary" strokeWidth={2} aria-hidden />
                Pagamento
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Dados de cartão abaixo são só para preenchimento de interface; o envio real usa só a
                forma escolhida nesta demo.
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Select
                  label="Forma de pagamento"
                  value={paymentMethod}
                  onChange={(e) => {
                    const v = e.target.value as 'card' | 'pix' | 'boleto'
                    setPaymentMethod(v)
                    setFieldErrors((prev) => {
                      const next = { ...prev }
                      delete next.cardName
                      delete next.installments
                      return next
                    })
                  }}
                  options={[
                    { value: 'card', label: 'Cartão de crédito' },
                    { value: 'pix', label: 'Pix' },
                    { value: 'boleto', label: 'Boleto' },
                  ]}
                />
                {paymentMethod === 'card' ? (
                  <>
                    <Input
                      label="Nome no cartão"
                      placeholder="Como impresso no cartão"
                      value={cardName}
                      error={fieldErrors.cardName}
                      onChange={(e) => {
                        setCardName(e.target.value)
                        clearFieldError('cardName')
                      }}
                      autoComplete="cc-name"
                    />
                    <Input
                      className="sm:col-span-2"
                      label="Parcelas"
                      placeholder="1x sem juros"
                      value={installments}
                      error={fieldErrors.installments}
                      onChange={(e) => {
                        setInstallments(e.target.value)
                        clearFieldError('installments')
                      }}
                    />
                  </>
                ) : null}
              </div>
            </section>

            <div className="flex flex-wrap gap-3">
              <Button
                type="submit"
                size="lg"
                className="min-h-12 min-w-[12rem] shadow-glow"
                disabled={submitting}
              >
                {submitting ? 'Finalizando…' : 'Finalizar pedido'}
              </Button>
              <Link
                to={ROUTES.cart}
                className={buttonStyles({
                  variant: 'secondary',
                  size: 'lg',
                  className: 'min-h-12',
                })}
              >
                Voltar ao carrinho
              </Link>
            </div>
          </div>

          <aside className="lg:sticky lg:top-[calc(var(--header-height)+1rem)]">
            <div className="rounded-2xl border border-border/80 bg-muted/20 p-5 shadow-sm md:p-6">
              <h2 className="text-sm font-extrabold uppercase tracking-label text-muted-foreground">
                Resumo
              </h2>
              <ul className="mt-4 flex list-none flex-col gap-3 border-b border-border/80 p-0 pb-4 text-sm">
                {lines.map((line) => (
                  <li key={line.productId} className="flex justify-between gap-2">
                    <span className="min-w-0 truncate text-text-h">
                      {nameById[line.productId] ?? 'Produto'}
                    </span>
                    <span className="shrink-0 tabular-nums text-muted-foreground">
                      ×{line.quantity}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold tabular-nums text-text-h">
                  {totalsLoading ? (
                    <Skeleton className="h-5 w-24 rounded-md" />
                  ) : (
                    formatCurrencyFromCents(subtotalCents)
                  )}
                </span>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                Total após frete na confirmação do pedido. Valores calculados no servidor a partir do
                catálogo atual.
              </p>
              <div className="mt-5 flex items-start gap-2 rounded-xl border border-success/25 bg-success/10 p-3 text-xs text-foreground">
                <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" strokeWidth={2} />
                <span>Sessão segura · Ambiente preparado para certificação e gateway real.</span>
              </div>
            </div>
          </aside>
        </form>
      )}
    </div>
  )
}

function CheckoutStepper() {
  const steps = [
    { n: 1, label: 'Entrega', active: true },
    { n: 2, label: 'Pagamento', active: true },
    { n: 3, label: 'Confirmação', active: false },
  ]
  return (
    <ol
      className="m-0 flex list-none flex-nowrap items-center gap-3 p-0 sm:gap-4 min-w-0 overflow-x-auto overflow-y-hidden pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      aria-label="Etapas do checkout"
    >
      {steps.map((s) => (
        <li
          key={s.n}
          className="flex shrink-0 items-center gap-2 rounded-full border border-border/80 bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground shadow-sm sm:text-sm"
        >
          <span
            className={
              s.active
                ? 'flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[0.65rem] text-primary-foreground'
                : 'flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[0.65rem]'
            }
          >
            {s.n}
          </span>
          {s.label}
        </li>
      ))}
    </ol>
  )
}

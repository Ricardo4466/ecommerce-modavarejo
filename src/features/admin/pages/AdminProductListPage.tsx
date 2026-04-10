import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Plus, Trash2 } from 'lucide-react'

import { formatCurrencyFromCents } from '@/lib/formatCurrency'
import { httpDelete, httpGet } from '@/lib/http/client'
import { ROUTES } from '@/lib/routes'
import { Breadcrumb, Button, ErrorState, buttonStyles } from '@/ui'
import type { Product } from '@/types'

export function AdminProductListPage() {
  const [items, setItems] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(() => {
    setLoading(true)
    setError(null)
    void httpGet<{ items: Product[] }>('/api/products')
      .then((r) => {
        setItems(r.items)
        setLoading(false)
      })
      .catch(() => {
        setError('Não foi possível carregar o catálogo. Confira se a API está rodando.')
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    load()
  }, [load])

  function handleDelete(p: Product) {
    if (!window.confirm(`Remover "${p.name}" do catálogo?`)) return
    void httpDelete(`/api/product/${encodeURIComponent(p.id)}`)
      .then(() => load())
      .catch(() => {
        window.alert('Não foi possível remover o produto.')
      })
  }

  return (
    <div className="page admin-products mx-auto w-full max-w-5xl pb-12 pt-6 md:pb-16 md:pt-8">
      <Breadcrumb
        className="mb-6"
        items={[
          { label: 'Início', href: ROUTES.home },
          { label: 'Admin · produtos' },
        ]}
      />

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page__title text-2xl font-bold tracking-tight text-text-h md:text-3xl">
            Cadastro de produtos
          </h1>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Lista em memória na API de demonstração: alterações somem ao reiniciar o servidor.
          </p>
        </div>
        <Link
          to={ROUTES.adminNew}
          className={buttonStyles({
            variant: 'primary',
            size: 'md',
            className: 'min-h-11 w-full justify-center sm:w-auto',
          })}
        >
          <Plus className="h-4 w-4" strokeWidth={2} aria-hidden />
          Novo produto
        </Link>
      </div>

      {error ? (
        <ErrorState
          className="mt-4"
          title="Erro ao carregar"
          description={error}
        />
      ) : null}

      {loading ? (
        <p className="text-sm text-muted-foreground" aria-live="polite">
          Carregando…
        </p>
      ) : !error ? (
        <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="border-b border-border/80 bg-muted/30">
              <tr>
                <th className="px-4 py-3 font-semibold text-text-h">Nome</th>
                <th className="hidden px-4 py-3 font-semibold text-text-h sm:table-cell">Marca</th>
                <th className="hidden px-4 py-3 font-semibold text-text-h md:table-cell">Categoria</th>
                <th className="px-4 py-3 text-right font-semibold text-text-h">Preço</th>
                <th className="px-4 py-3 text-right font-semibold text-text-h">Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-3">
                    <span className="font-medium text-text-h">{p.name}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground sm:hidden">
                      {p.brand}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">{p.brand}</td>
                  <td className="hidden px-4 py-3 capitalize text-muted-foreground md:table-cell">
                    {p.category}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-text-h">
                    {formatCurrencyFromCents(p.priceCents)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={ROUTES.adminEdit(p.id)}
                        className={buttonStyles({
                          variant: 'secondary',
                          size: 'sm',
                          className: 'inline-flex gap-1',
                        })}
                      >
                        <Pencil className="h-3.5 w-3.5" aria-hidden />
                        Editar
                      </Link>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="gap-1 text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(p)}
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden />
                        Excluir
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">
              Nenhum produto. Cadastre o primeiro item.
            </p>
          ) : null}
        </div>
      ) : null}

      <p className="mt-8 text-center text-sm text-muted-foreground">
        <Link to={ROUTES.home} className="font-medium text-primary underline-offset-4 hover:underline">
          Voltar ao catálogo
        </Link>
      </p>
    </div>
  )
}

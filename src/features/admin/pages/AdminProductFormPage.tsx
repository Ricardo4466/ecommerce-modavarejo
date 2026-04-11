import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'

import { ProductCard } from '@/components/ProductCard'
import { brlInputToCents, centsToBrlInput } from '@/features/admin/lib/price-input'
import { PLP_CATEGORY_OPTIONS } from '@/features/products/constants'
import { httpGet, httpPostJson, httpPutJson } from '@/lib/http/client'
import { ROUTES } from '@/lib/routes'
import { slugify } from '@/lib/slugify'
import { cn } from '@/lib/cn'
import { Breadcrumb, Button, Input, Select, buttonStyles } from '@/ui'
import type { Product, ProductCategory, ProductCondition } from '@/types'
import { productCategoryLabel } from '@/lib/product-labels'

const CONDITION_OPTIONS: { value: ProductCondition; label: string }[] = [
  { value: 'novo', label: 'Novo' },
  { value: 'usado', label: 'Usado' },
  { value: 'excelente', label: 'Excelente estado' },
]

const textareaClass =
  'flex min-h-[120px] w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text-h placeholder:text-muted-foreground shadow-xs transition-[color,background-color,border-color,box-shadow] duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'

type SpecRow = { label: string; value: string }

type FormState = {
  name: string
  slug: string
  description: string
  longDescription: string
  priceInput: string
  compareAtPriceInput: string
  category: ProductCategory
  condition: ProductCondition
  brand: string
  imageUrl: string
  galleryText: string
  stock: string
  rating: string
  reviewCount: string
  specs: SpecRow[]
}

function emptyForm(): FormState {
  return {
    name: '',
    slug: '',
    description: '',
    longDescription: '',
    priceInput: '',
    compareAtPriceInput: '',
    category: 'masculino',
    condition: 'novo',
    brand: '',
    imageUrl: '',
    galleryText: '',
    stock: '0',
    rating: '4.5',
    reviewCount: '0',
    specs: [{ label: 'Tamanho', value: '' }],
  }
}

function formToPreviewProduct(form: FormState, previewId?: string): Product {
  const priceCents = brlInputToCents(form.priceInput)
  const compareRaw = form.compareAtPriceInput.trim()
  const compareAtPriceCents =
    compareRaw.length > 0 ? brlInputToCents(compareRaw) : undefined
  const slug =
    form.slug.trim() || (form.name.trim() ? slugify(form.name) : 'preview')
  const brandSlug = slugify(form.brand.trim()) || 'marca'
  const specs = form.specs
    .map((s) => ({ label: s.label.trim(), value: s.value.trim() }))
    .filter((s) => s.label || s.value)

  const galleryLines = form.galleryText
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)

  return {
    id: previewId ?? 'preview',
    slug,
    name: form.name.trim() || 'Nome do produto',
    description: form.description.trim(),
    ...(form.longDescription.trim()
      ? { longDescription: form.longDescription.trim() }
      : {}),
    priceCents: Number.isFinite(priceCents) ? priceCents : 0,
    ...(compareAtPriceCents != null &&
    Number.isFinite(compareAtPriceCents) &&
    compareAtPriceCents > 0
      ? { compareAtPriceCents }
      : {}),
    category: form.category,
    condition: form.condition,
    brand: form.brand.trim() || 'Marca',
    brandSlug,
    imageUrl: form.imageUrl.trim(),
    galleryUrls: galleryLines.length > 0 ? galleryLines : undefined,
    stock: Math.max(0, parseInt(form.stock, 10) || 0),
    rating: Math.min(5, Math.max(0, parseFloat(form.rating.replace(',', '.')) || 0)),
    reviewCount: Math.max(0, parseInt(form.reviewCount, 10) || 0),
    specifications: specs.length > 0 ? specs : [{ label: '—', value: '—' }],
  }
}

function productToForm(p: Product): FormState {
  return {
    name: p.name,
    slug: p.slug,
    description: p.description,
    longDescription: p.longDescription ?? '',
    priceInput: centsToBrlInput(p.priceCents),
    compareAtPriceInput:
      p.compareAtPriceCents != null ? centsToBrlInput(p.compareAtPriceCents) : '',
    category: p.category,
    condition: p.condition,
    brand: p.brand,
    imageUrl: p.imageUrl,
    galleryText: (p.galleryUrls ?? []).join('\n'),
    stock: String(p.stock),
    rating: String(p.rating),
    reviewCount: String(p.reviewCount),
    specs:
      p.specifications.length > 0
        ? p.specifications.map((s) => ({ label: s.label, value: s.value }))
        : [{ label: 'Tamanho', value: '' }],
  }
}

type AdminProductFormProps = {
  mode: 'new' | 'edit'
  productId?: string
}

function AdminProductForm({ mode, productId }: AdminProductFormProps) {
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>(emptyForm)
  const [loading, setLoading] = useState(mode === 'edit')
  const [loadError, setLoadError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (mode !== 'edit' || !productId) return

    let cancelled = false
    setLoading(true)
    setLoadError(null)

    void httpGet<Product>(`/api/product/${encodeURIComponent(productId)}`)
      .then((p) => {
        if (!cancelled) setForm(productToForm(p))
      })
      .catch(() => {
        if (!cancelled) setLoadError('Produto não encontrado ou API indisponível.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [mode, productId])

  const previewProduct = useMemo(
    () => formToPreviewProduct(form, mode === 'edit' ? productId : undefined),
    [form, mode, productId],
  )

  const syncSlugFromName = useCallback(() => {
    if (mode !== 'new') return
    setForm((f) => {
      if (f.slug.trim() !== '') return f
      const next = slugify(f.name)
      return { ...f, slug: next }
    })
  }, [mode])

  function updateSpec(i: number, field: keyof SpecRow, value: string) {
    setForm((f) => {
      const specs = f.specs.map((row, j) => (j === i ? { ...row, [field]: value } : row))
      return { ...f, specs }
    })
  }

  function addSpecRow() {
    setForm((f) => ({ ...f, specs: [...f.specs, { label: '', value: '' }] }))
  }

  function removeSpecRow(i: number) {
    setForm((f) => ({
      ...f,
      specs: f.specs.length > 1 ? f.specs.filter((_, j) => j !== i) : f.specs,
    }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitError(null)
    setSaving(true)

    const priceCents = brlInputToCents(form.priceInput)
    const specifications = form.specs
      .map((s) => ({
        label: s.label.trim(),
        value: s.value.trim(),
      }))
      .filter((s) => s.label || s.value)

    const galleryUrls = form.galleryText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)

    const compareAtRaw = form.compareAtPriceInput.trim()
    const compareAtPriceCents =
      compareAtRaw.length > 0 ? brlInputToCents(compareAtRaw) : undefined

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      ...(form.longDescription.trim()
        ? { longDescription: form.longDescription.trim() }
        : {}),
      priceCents,
      ...(compareAtPriceCents != null &&
      Number.isFinite(compareAtPriceCents) &&
      compareAtPriceCents > 0
        ? { compareAtPriceCents }
        : {}),
      category: form.category,
      condition: form.condition,
      brand: form.brand.trim(),
      slug: form.slug.trim() || undefined,
      imageUrl: form.imageUrl.trim(),
      galleryUrls: galleryUrls.length ? galleryUrls : undefined,
      stock: Math.max(0, parseInt(form.stock, 10) || 0),
      rating: Math.min(5, Math.max(0, parseFloat(form.rating.replace(',', '.')) || 0)),
      reviewCount: Math.max(0, parseInt(form.reviewCount, 10) || 0),
      specifications: specifications.length ? specifications : [{ label: '—', value: '—' }],
    }

    try {
      if (mode === 'new') {
        await httpPostJson<typeof payload, Product>('/api/products', payload)
      } else if (productId) {
        await httpPutJson<typeof payload, Product>(`/api/product/${encodeURIComponent(productId)}`, payload)
      }
      navigate(ROUTES.admin)
    } catch {
      setSubmitError('Não foi possível salvar. Verifique os dados e a API.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="page mx-auto w-full max-w-3xl pb-12 pt-6 md:pb-16 md:pt-8">
        <p className="text-sm text-muted-foreground">Carregando…</p>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="page mx-auto w-full max-w-3xl pb-12 pt-6 md:pb-16 md:pt-8">
        <p className="text-sm text-destructive">{loadError}</p>
        <Link to={ROUTES.admin} className={cn(buttonStyles({ variant: 'secondary', className: 'mt-4' }))}>
          Voltar ao admin
        </Link>
      </div>
    )
  }

  return (
    <div className="page admin-form mx-auto w-full max-w-6xl pb-12 pt-6 md:pb-16 md:pt-8">
      <Breadcrumb
        className="mb-6"
        items={[
          { label: 'Início', href: ROUTES.home },
          { label: 'Admin', href: ROUTES.admin },
          { label: mode === 'new' ? 'Novo produto' : 'Editar produto' },
        ]}
      />

      <h1 className="page__title mb-6 text-2xl font-bold tracking-tight text-text-h md:text-3xl">
        {mode === 'new' ? 'Novo produto' : 'Editar produto'}
      </h1>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(17rem,22rem)] lg:items-start lg:gap-10 xl:gap-12">
      <form onSubmit={handleSubmit} className="flex min-w-0 flex-col gap-6">
        {submitError ? (
          <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {submitError}
          </p>
        ) : null}

        <Input
          label="Nome"
          required
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          onBlur={syncSlugFromName}
        />

        <Input
          label="Slug (URL)"
          hint="Deixe em branco no cadastro novo para gerar automaticamente a partir do nome."
          value={form.slug}
          onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
        />

        <div className="flex flex-col gap-1.5 min-w-0">
          <label htmlFor="admin-desc" className="text-xs font-medium text-muted-foreground">
            Descrição
          </label>
          <textarea
            id="admin-desc"
            required
            className={textareaClass}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={4}
          />
        </div>

        <div className="flex flex-col gap-1.5 min-w-0">
          <label htmlFor="admin-long-desc" className="text-xs font-medium text-muted-foreground">
            Descrição detalhada (opcional)
          </label>
          <textarea
            id="admin-long-desc"
            className={textareaClass}
            value={form.longDescription}
            onChange={(e) => setForm((f) => ({ ...f, longDescription: e.target.value }))}
            rows={6}
            placeholder="Texto longo para a PDP e SEO…"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Input
            label="Preço (R$)"
            required
            inputMode="decimal"
            placeholder="79,90"
            value={form.priceInput}
            onChange={(e) => setForm((f) => ({ ...f, priceInput: e.target.value }))}
          />
          <Input
            label="Preço “De” / referência (opcional)"
            inputMode="decimal"
            placeholder="99,90"
            value={form.compareAtPriceInput}
            onChange={(e) => setForm((f) => ({ ...f, compareAtPriceInput: e.target.value }))}
          />
          <Input
            label="Estoque (unidades)"
            inputMode="numeric"
            value={form.stock}
            onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Categoria"
            value={form.category}
            onChange={(e) =>
              setForm((f) => ({ ...f, category: e.target.value as ProductCategory }))
            }
            options={PLP_CATEGORY_OPTIONS.filter((o) => o.value !== '')}
          />
          <Select
            label="Condição"
            value={form.condition}
            onChange={(e) =>
              setForm((f) => ({ ...f, condition: e.target.value as ProductCondition }))
            }
            options={CONDITION_OPTIONS}
          />
        </div>

        <Input
          label="Marca"
          required
          value={form.brand}
          onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
        />

        <Input
          label="URL da imagem principal"
          type="url"
          placeholder="https://…"
          value={form.imageUrl}
          onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
        />
        <p className="-mt-2 text-xs text-muted-foreground">
          Opcional. Em branco, a vitrine e a página do produto mostram &quot;Sem foto&quot;.
        </p>

        <div className="flex flex-col gap-1.5 min-w-0">
          <label htmlFor="admin-gallery" className="text-xs font-medium text-muted-foreground">
            URLs da galeria (uma por linha)
          </label>
          <textarea
            id="admin-gallery"
            className={textareaClass}
            value={form.galleryText}
            onChange={(e) => setForm((f) => ({ ...f, galleryText: e.target.value }))}
            rows={3}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Nota (0–5)"
            inputMode="decimal"
            value={form.rating}
            onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value }))}
          />
          <Input
            label="Nº de avaliações"
            inputMode="numeric"
            value={form.reviewCount}
            onChange={(e) => setForm((f) => ({ ...f, reviewCount: e.target.value }))}
          />
        </div>

        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">Especificações</p>
          <div className="flex flex-col gap-3">
            {form.specs.map((row, i) => (
              <div key={i} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
                <Input
                  label={i === 0 ? 'Rótulo' : undefined}
                  value={row.label}
                  onChange={(e) => updateSpec(i, 'label', e.target.value)}
                />
                <Input
                  label={i === 0 ? 'Valor' : undefined}
                  value={row.value}
                  onChange={(e) => updateSpec(i, 'value', e.target.value)}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="shrink-0"
                  onClick={() => removeSpecRow(i)}
                >
                  Remover
                </Button>
              </div>
            ))}
          </div>
          <Button type="button" variant="secondary" size="sm" className="mt-3" onClick={addSpecRow}>
            Adicionar linha
          </Button>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button type="submit" variant="primary" disabled={saving} className="min-h-11 min-w-[8rem]">
            {saving ? 'Salvando…' : 'Salvar'}
          </Button>
          <Link
            to={ROUTES.admin}
            className={buttonStyles({ variant: 'secondary', size: 'md', className: 'min-h-11' })}
          >
            Cancelar
          </Link>
        </div>
      </form>

      <aside className="flex min-w-0 flex-col gap-4 lg:sticky lg:top-[calc(var(--header-height)+1rem)]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-label text-muted-foreground">
            Pré-visualização no catálogo
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {mode === 'new'
              ? 'O card atualiza em tempo real conforme você preenche o formulário ao lado.'
              : 'Veja como as alterações ficarão na vitrine antes de salvar.'}
          </p>
          <p className="mt-2 text-[0.7rem] text-muted-foreground">
            Categoria:{' '}
            <span className="font-medium text-foreground">
              {productCategoryLabel(previewProduct.category)}
            </span>
          </p>
        </div>
        <ProductCard product={previewProduct} preview className="w-full max-w-md lg:max-w-none" />
      </aside>
      </div>
    </div>
  )
}

export function AdminProductNewPage() {
  return <AdminProductForm mode="new" />
}

export function AdminProductEditPage() {
  const { id } = useParams<{ id: string }>()
  if (!id) {
    return <Navigate to={ROUTES.admin} replace />
  }
  return <AdminProductForm mode="edit" productId={id} />
}

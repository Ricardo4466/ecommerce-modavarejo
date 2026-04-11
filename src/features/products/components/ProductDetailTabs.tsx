import { useId, useState } from 'react'

import { cn } from '@/lib/cn'
import type { Product } from '@/types'
import { ProductSpecifications } from '@/features/products/components/ProductSpecifications'

const RETURNS_COPY = `Você pode solicitar troca ou devolução em até 7 dias corridos após o recebimento, conforme o Código de Defesa do Consumidor, desde que o produto esteja sem sinais de uso, com etiquetas e embalagem original quando aplicável. Em caso de defeito, abra um chamado pelo canal de atendimento informando o número do pedido.`

type TabId = 'description' | 'specs' | 'returns'

type Props = {
  product: Product
}

export function ProductDetailTabs({ product }: Props) {
  const baseId = useId()
  const [tab, setTab] = useState<TabId>('description')

  const descriptionText = product.longDescription?.trim() || product.description
  const tabs: { id: TabId; label: string }[] = [
    { id: 'description', label: 'Descrição' },
    { id: 'specs', label: 'Especificações' },
    { id: 'returns', label: 'Trocas e devoluções' },
  ]

  return (
    <section
      className="rounded-2xl border border-border bg-muted/20 p-5 md:p-8"
      aria-label="Detalhes do produto"
    >
      <div
        role="tablist"
        aria-label="Seções do produto"
        className="flex flex-wrap gap-2 border-b border-border pb-3"
      >
        {tabs.map((t) => {
          const selected = tab === t.id
          const panelId = `${baseId}-panel-${t.id}`
          const tabId = `${baseId}-tab-${t.id}`
          return (
            <button
              key={t.id}
              id={tabId}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={panelId}
              tabIndex={selected ? 0 : -1}
              className={cn(
                'cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                selected
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-text-h',
              )}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          )
        })}
      </div>

      <div className="pt-5 md:pt-6">
        {tab === 'description' ? (
          <div
            id={`${baseId}-panel-description`}
            role="tabpanel"
            aria-labelledby={`${baseId}-tab-description`}
            className="max-w-none text-base leading-relaxed text-text md:text-lg"
          >
            <p className="m-0 whitespace-pre-wrap">{descriptionText}</p>
          </div>
        ) : null}

        {tab === 'specs' ? (
          <div
            id={`${baseId}-panel-specs`}
            role="tabpanel"
            aria-labelledby={`${baseId}-tab-specs`}
          >
            <ProductSpecifications specifications={product.specifications} embedded />
          </div>
        ) : null}

        {tab === 'returns' ? (
          <div
            id={`${baseId}-panel-returns`}
            role="tabpanel"
            aria-labelledby={`${baseId}-tab-returns`}
            className="text-sm leading-relaxed text-text md:text-base"
          >
            <p className="m-0 whitespace-pre-wrap">{RETURNS_COPY}</p>
          </div>
        ) : null}
      </div>
    </section>
  )
}

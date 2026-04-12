import { useEffect, useState } from 'react'

import { getCookieConsent } from '@/lib/cookie-consent'
import { acceptOptionalCookies, rejectOptionalCookies } from '@/lib/cookie-consent-actions'

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(getCookieConsent() === null)
  }, [])

  function accept() {
    acceptOptionalCookies()
    setVisible(false)
  }

  function reject() {
    rejectOptionalCookies()
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[55] border-t border-border bg-card/95 p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] backdrop-blur-md md:p-5 dark:shadow-[0_-8px_30px_rgba(0,0,0,0.35)]"
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-live="polite"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-8">
        <div className="min-w-0">
          <h2 id="cookie-consent-title" className="text-sm font-semibold text-text-h md:text-base">
            Cookies e privacidade
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground md:text-sm">
            Usamos armazenamento local para o carrinho e para sua escolha neste aviso (necessários).
            Se você aceitar, também guardamos favoritos, filtros do catálogo e tema da interface
            (opcionais). Ao aceitar, você concorda com esse uso conforme a legislação aplicável. Se
            recusar os opcionais, o site continua funcionando com dados mínimos. Consulte os termos
            do projeto ou da organização responsável para mais detalhes.
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-lg border border-border bg-secondary px-5 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary-200/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:hover:bg-secondary-800/80"
            onClick={reject}
          >
            Não aceitar
          </button>
          <button
            type="button"
            className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            onClick={accept}
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  )
}

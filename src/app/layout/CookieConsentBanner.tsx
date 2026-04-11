import { useEffect, useState } from 'react'

const STORAGE_KEY = 'ecommerce-modavarejo:cookie-consent'

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      setVisible(localStorage.getItem(STORAGE_KEY) !== 'accepted')
    } catch {
      setVisible(true)
    }
  }, [])

  function accept() {
    try {
      localStorage.setItem(STORAGE_KEY, 'accepted')
    } catch {
      /* ignore quota / private mode */
    }
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
            Usamos cookies e dados locais (como o carrinho e filtros) para melhorar sua experiência
            nesta vitrine. Ao continuar, você concorda com esse uso conforme a legislação aplicável.
            Consulte os termos do projeto ou da organização responsável para mais detalhes.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex min-h-11 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          onClick={accept}
        >
          Aceitar
        </button>
      </div>
    </div>
  )
}

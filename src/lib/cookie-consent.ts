/** Escolha armazenada em `localStorage` (chave {@link COOKIE_CONSENT_STORAGE_KEY}). */
export type CookieConsentChoice = 'accepted' | 'rejected'

export const COOKIE_CONSENT_STORAGE_KEY = 'ecommerce-modavarejo:cookie-consent'

/** Chaves de dados não essenciais (favoritos, filtros PLP, tema). O carrinho não entra aqui. */
export const OPTIONAL_LOCAL_STORAGE_KEYS = [
  'ecommerce-modavarejo:favorites',
  'ecommerce-modavarejo:plp-filters',
  'theme-preference',
] as const

export function getCookieConsent(): CookieConsentChoice | null {
  try {
    const v = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY)
    if (v === 'accepted' || v === 'rejected') return v
    return null
  } catch {
    return null
  }
}

/** Só com aceite explícito persistimos favoritos, filtros do catálogo e preferência de tema. */
export function allowsOptionalCookies(): boolean {
  return getCookieConsent() === 'accepted'
}

export function removeOptionalPersistedKeys(): void {
  try {
    for (const key of OPTIONAL_LOCAL_STORAGE_KEYS) {
      localStorage.removeItem(key)
    }
  } catch {
    /* ignore */
  }
}

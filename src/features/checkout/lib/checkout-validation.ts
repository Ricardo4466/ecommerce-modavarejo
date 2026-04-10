export type CheckoutDeliveryField = 'cep' | 'city' | 'address'
export type CheckoutPaymentField = 'cardName' | 'installments'

export type CheckoutFieldErrors = Partial<
  Record<CheckoutDeliveryField | CheckoutPaymentField, string>
>

/** Espelha a regra do servidor: CEP com 8 dígitos OU (cidade ≥2 e endereço ≥5). */
export function getDeliveryFieldErrors(
  cep: string,
  city: string,
  address: string,
): Partial<Record<CheckoutDeliveryField, string>> {
  const digits = cep.replace(/\D/g, '')
  const c = city.trim()
  const a = address.trim()

  if (digits.length >= 8) return {}
  if (c.length >= 2 && a.length >= 5) return {}

  const out: Partial<Record<CheckoutDeliveryField, string>> = {}

  if (digits.length < 8) {
    out.cep =
      'Informe um CEP com 8 dígitos ou preencha cidade e endereço nos campos abaixo.'
  }
  if (c.length < 2) {
    out.city = 'Informe a cidade (mínimo 2 caracteres).'
  }
  if (a.length < 5) {
    out.address = 'Informe o endereço (mínimo 5 caracteres).'
  }

  return out
}

export function getPaymentFieldErrors(
  method: 'card' | 'pix' | 'boleto',
  cardName: string,
  installments: string,
): Partial<Record<CheckoutPaymentField, string>> {
  if (method !== 'card') return {}

  const out: Partial<Record<CheckoutPaymentField, string>> = {}
  if (cardName.trim().length < 3) {
    out.cardName = 'Informe o nome como impresso no cartão (mínimo 3 caracteres).'
  }
  if (installments.trim().length < 1) {
    out.installments = 'Informe ou selecione o número de parcelas.'
  }
  return out
}

export function mergeCheckoutFieldErrors(
  delivery: Partial<Record<CheckoutDeliveryField, string>>,
  payment: Partial<Record<CheckoutPaymentField, string>>,
): CheckoutFieldErrors {
  return { ...delivery, ...payment }
}

/** Linha persistida no carrinho (sem duplicar dados do produto). */
export type CartLine = {
  productId: string
  quantity: number
}

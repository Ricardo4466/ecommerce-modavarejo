import { expect, test } from '@playwright/test'

test.describe('Jornada de compra (demo)', () => {
  test('catálogo → PDP → adicionar ao carrinho → página do carrinho', async ({ page }) => {
    await page.goto('/')

    // Primeiro item na ordenação padrão (A–Z, pt-BR): Bermuda linho misto
    const pdpLink = page.locator('a[href="/produto/bermuda-linho-m"]')
    await expect(pdpLink).toBeVisible({ timeout: 10_000 })

    await pdpLink.click()

    await expect(page).toHaveURL(/\/produto\/bermuda-linho-m/)
    await expect(
      page.getByRole('heading', { level: 1, name: /Bermuda linho misto/i }),
    ).toBeVisible({ timeout: 10_000 })

    await page
      .locator('#conteudo-principal')
      .getByRole('button', { name: /Adicionar ao carrinho/i })
      .click()

    await expect(page.getByRole('heading', { name: /^Carrinho$/ })).toBeVisible()
    await page.getByRole('link', { name: /^Ver carrinho$/i }).click()

    await expect(page).toHaveURL(/\/carrinho/)

    await expect(page.getByText(/Bermuda linho misto/i).first()).toBeVisible()
  })

  test('checkout → finalizar pedido → confirmação', async ({ page }) => {
    await page.goto('/')

    const pdpLink = page.locator('a[href="/produto/bermuda-linho-m"]')
    await expect(pdpLink).toBeVisible({ timeout: 10_000 })
    await pdpLink.click()

    await expect(page).toHaveURL(/\/produto\/bermuda-linho-m/)
    await expect(
      page.getByRole('heading', { level: 1, name: /Bermuda linho misto/i }),
    ).toBeVisible({ timeout: 10_000 })
    await page
      .locator('#conteudo-principal')
      .getByRole('button', { name: /Adicionar ao carrinho/i })
      .click()

    await expect(page.getByRole('heading', { name: /^Carrinho$/ })).toBeVisible()
    await page.getByRole('link', { name: /^Ver carrinho$/i }).click()
    await expect(page).toHaveURL(/\/carrinho/)

    await page.getByRole('link', { name: /Ir para checkout/i }).click()

    await expect(page).toHaveURL(/\/checkout/)

    await page.getByLabel(/CEP/i).fill('01310100')
    await page.getByLabel(/^Cidade$/i).fill('São Paulo')
    await page.getByLabel(/Endereço/i).fill('Av. Paulista, 1000')
    await page.getByLabel(/Nome no cartão/i).fill('Maria Silva')

    await page.getByRole('button', { name: /^Finalizar pedido$/i }).click()

    await expect(page).toHaveURL(/\/pedido\/[0-9a-f-]{36}/i, { timeout: 15_000 })
    await expect(page.getByRole('heading', { name: /Pedido confirmado/i })).toBeVisible()
  })
})

import { test, expect, type Page } from '@playwright/test'

/**
 * E2E do fluxo comercial: Conversion -> Registrar Receita -> Revenue Event -> Attribution -> Dashboard.
 *
 * Notas de ambiente (sem mocks, dados reais):
 * - Requer PostgreSQL com migration 0005 aplicada y servidor dev em :3000 (playwright.config.ts).
 * - Cada test registra usuario/org unica para nao depender de seeds.
 * - Requer navegador instalado: npx playwright install chromium
 */

const uniqueTag = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

async function signupAndCreateOrg(page: Page, tag: string) {
  await page.goto('/register')
  await page.fill('input[name="name"]', `Usuario ${tag}`)
  await page.fill('input[name="email"]', `${tag}@rev.e2e`)
  await page.fill('input[name="password"]', 'Password123!')
  await page.click('button[type="submit"]')
  await page.waitForURL('/organizations/new')
  await page.fill('input[name="name"]', `Org ${tag}`)
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL(/\/dashboard/)
}

async function createCustomer(page: Page, tag: string, name: string) {
  await page.goto('/customers/new')
  await page.fill('input[name="name"]', name)
  await page.fill('input[name="email"]', `cliente-${tag}@e2e.test`)
  await page.click('button[type="submit"]')
  await page.waitForURL(/\/customers\/[^/]+$/)
  return page.url().split('/').filter(Boolean).pop()!
}

async function createConversion(
  page: Page,
  customerId: string,
  attributionType: string,
  amount: string
) {
  await page.goto('/conversions/new')
  await page.selectOption('#cv-customer', customerId)
  await page.selectOption('#cv-attribution', attributionType)
  await page.fill('#cv-amount', amount)
  await page.click('button[type="submit"]')
  await page.waitForURL(/\/conversions\/[^/]+$/)
  return page.url().split('/').filter(Boolean).pop()!
}

test('conversion -> registrar receita -> revenue event -> dashboard (atribuicao sem recuperacao)', async ({
  page,
}) => {
  const tag = uniqueTag()
  await signupAndCreateOrg(page, tag)

  // 1. Cliente
  const customerId = await createCustomer(page, tag, `Cliente ${tag}`)

  // 2. Conversion direct_conversion: registrada, NAO recuperada pela regra de atribucion
  const conversionId = await createConversion(page, customerId, 'direct_conversion', '1500')

  // 3. Detalle de conversion -> accion 'Registrar Receita'
  await page.goto(`/conversions/${conversionId}`)
  await expect(page.locator('h1')).toContainText('Detalhes da Convers\u00E3o')
  await page.getByRole('link', { name: 'Registrar Receita', exact: true }).click()

  // 4. /revenue/new?conversionId=<id>: conversion precargada e bloqueada
  await expect(page).toHaveURL(/\/revenue\/new\?conversionId=./)
  await expect(page.locator('#rv-conversion')).toBeDisabled()
  await expect(page.locator('#rv-customer')).toHaveValue(customerId)
  await expect(page.locator('#rv-amount')).toHaveValue('1500')
  await expect(page.locator('body')).toContainText(
    'ser\u00E1 contabilizada como receita registrada, sem atribu\u00E7\u00E3o.'
  )

  // 5. Guardar -> detalle do revenue event
  await page.click('button[type="submit"]')
  await page.waitForURL(/\/revenue\/[^/]+$/)
  const revenueId = page.url().split('/').filter(Boolean).pop()!
  await expect(page.locator('body')).toContainText(/1\.500,00/)

  // 6. A conversion mostra a receita vinculada
  await page.goto(`/conversions/${conversionId}`)
  await expect(page.locator('body')).toContainText('Receitas Vinculadas')
  await expect(page.locator('body')).toContainText(/1\.500,00/)

  // 7. Dashboard: registrada = 1.500, recuperada = 0 (direct_conversion nao e evidencia)
  await page.goto('/dashboard')
  await expect(page.locator('body')).toContainText('Receita Registrada (30 dias)')
  await expect(page.locator('body')).toContainText(/1\.500,00/)
  await expect(page.locator('body')).toContainText('Receita Recuperada (30 dias)')
  await expect(page.locator('body')).toContainText(/0,00/)

  expect(revenueId).toBeTruthy()
})

test('isolamento multi-tenant: conversion/revenue de outra org sao inaccesibles', async ({ browser }) => {
  const contextA = await browser.newContext()
  const pageA = await contextA.newPage()
  const tagA = `orga-${uniqueTag()}`
  await signupAndCreateOrg(pageA, tagA)
  const customerA = await createCustomer(pageA, tagA, `Cliente A ${tagA}`)
  const conversionA = await createConversion(pageA, customerA, 'follow_up_conversion', '2500')

  // Receita vinculada a la conversion A
  await pageA.goto(`/conversions/${conversionA}`)
  await pageA.getByRole('link', { name: 'Registrar Receita', exact: true }).click()
  await pageA.click('button[type="submit"]')
  await pageA.waitForURL(/\/revenue\/[^/]+$/)
  const revenueA = pageA.url().split('/').filter(Boolean).pop()!

  const contextB = await browser.newContext()
  const pageB = await contextB.newPage()
  const tagB = `orgb-${uniqueTag()}`
  await signupAndCreateOrg(pageB, tagB)
  // Org B con cliente propio para que el formulario de receita se renderice completo
  await createCustomer(pageB, tagB, `Cliente B ${tagB}`)

  // URL direta a conversion de outra org -> 404 (sem fuga de dados)
  await pageB.goto(`/conversions/${conversionA}`)
  await expect(pageB.locator('body')).toContainText(/no encontrado|not found|404/i)

  // URL direta a revenue de outra org -> 404
  await pageB.goto(`/revenue/${revenueA}`)
  await expect(pageB.locator('body')).toContainText(/no encontrado|not found|404/i)

  // conversionId de outra org em /revenue/new nao se pre-selecciona nem filtra dados
  await pageB.goto(`/revenue/new?conversionId=${conversionA}`)
  await expect(pageB.locator('#rv-conversion')).toBeEnabled()
  await expect(pageB.locator('#rv-conversion')).toHaveValue('')
  await expect(pageB.locator('#rv-amount')).toHaveValue('')
  await expect(pageB.locator('body')).not.toContainText(`Cliente A ${tagA}`)

  await contextA.close()
  await contextB.close()
})

import { test, expect } from '@playwright/test';

test.describe('Fluxos de domínios críticos (requer Auth/Org state na sessão)', () => {
  // Nota de arquitetura: para estes testes rodarem com sucesso verde no Playwright,
  // precisaria de setup (seed) no bd real ou fixtures com "beforeEach" injetando um token/cookie.
  
  test('Dashboard Analytics view', async ({ page }) => {
    await page.goto('/dashboard');
    // Em um sistema real e BD populado, teremos os cartões de Revenue e Clientes
    await expect(page.locator('h1')).toContainText('Dashboard');
  });

  test('Leads e Funil: criar e transitar', async ({ page }) => {
    await page.goto('/leads');
    await page.click('text=Novo lead');
    await page.fill('input[name="name"]', 'Empresa Teste SA');
    await page.fill('input[name="email"]', 'contato@teste.com');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/leads\/.+/);
    await expect(page.locator('h1')).toContainText('Empresa Teste SA');
  });

  test('Services e Professionals', async ({ page }) => {
    await page.goto('/services/new');
    await page.fill('input[name="name"]', 'Consultoria Básica');
    await page.fill('input[name="durationMinutes"]', '60');
    await page.fill('input[name="price"]', '150');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/services\/.+/);

    await page.goto('/professionals/new');
    await page.fill('input[name="name"]', 'Carlos Expert');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/professionals\/.+/);
  });

  test('Appointments (Requer pre-requisitos)', async ({ page }) => {
    await page.goto('/appointments/new');
    // Valida que abre a pagina de novo appt ou tela de pre-requisitos
    const content = await page.textContent('body');
    expect(content?.includes('Novo Agendamento') || content?.includes('Pré-requisitos de Agendamento')).toBeTruthy();
  });

  test('Acesso restrito cross-tenant (via URL direta)', async ({ page }) => {
    // Simulando id inexistente/vetado para tenant ativo
    const response = await page.goto('/customers/99999999-9999-9999-9999-999999999999');
    // Devido ao isolamento, não achará o cliente
    await expect(page.locator('body')).toContainText(/não encontrado|unauthorized|not found/i);
  });
});
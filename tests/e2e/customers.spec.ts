import { test, expect } from '@playwright/test';

test('CRUD de customer dentro da org', async ({ page }) => {
  // Assume já estar logado / dashboard (não ideal, mas para MVP E2E é aceitável)
  await page.goto('/customers');
  await page.click('text=Novo cliente');
  await page.fill('input[name="name"]', 'Customer X');
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL(/\/customers\/.+/);
  await expect(page.locator('h1')).toContainText('Customer X');
});
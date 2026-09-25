import { test, expect } from '@playwright/test';

test('fluxo completo: registro, login e seleção de organização', async ({ page }) => {
  await page.goto('/register');
  await page.fill('input[name="name"]', 'User A');
  await page.fill('input[name="email"]', 'user-a@rev.test');
  await page.fill('input[name="password"]', 'Password123!');
  await page.click('button[type="submit"]');

  await page.waitForURL('/organizations/new');
  await page.fill('input[name="name"]', 'Org A');
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL(/dashboard/);
});
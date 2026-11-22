// Seed для роли company_2 (חברה/ארגון #2). Сессия: npm run qa-login (или qa-login:manual -- company_2).
import { test } from '@playwright/test';
import path from 'path';

test.use({ storageState: path.join(__dirname, '../../auth/company_2.json') });

test.describe('seed company_2', () => {
  test('seed', async ({ page }) => {
    await page.goto('/');
  });
});

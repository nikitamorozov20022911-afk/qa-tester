// Seed для роли company_6 (חברה/ארגון #6). Сессия: npm run qa-login (или qa-login:manual -- company_6).
import { test } from '@playwright/test';
import path from 'path';

test.use({ storageState: path.join(__dirname, '../../auth/company_6.json') });

test.describe('seed company_6', () => {
  test('seed', async ({ page }) => {
    await page.goto('/');
  });
});

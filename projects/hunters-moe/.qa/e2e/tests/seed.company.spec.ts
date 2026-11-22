// Seed для роли company (חברה/ארגון). Сессия: npm run qa-login (или qa-login:manual -- company).
import { test } from '@playwright/test';
import path from 'path';

test.use({ storageState: path.join(__dirname, '../../auth/company.json') });

test.describe('seed company', () => {
  test('seed', async ({ page }) => {
    await page.goto('/');
  });
});

// Seed для роли admin (Admin). Сессия: npm run qa-login (или qa-login:manual -- admin).
import { test } from '@playwright/test';
import path from 'path';

test.use({ storageState: path.join(__dirname, '../../auth/admin.json') });

test.describe('seed admin', () => {
  test('seed', async ({ page }) => {
    await page.goto('/');
  });
});

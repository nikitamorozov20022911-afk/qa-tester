// Стартовая точка для агентов Playwright под ролью "premium" (сессия из qa-login:manual -- premium).
import { test } from '@playwright/test';
import path from 'path';

test.use({ storageState: path.resolve(__dirname, '../../auth/premium.json') });

test.describe('seed premium', () => {
  test('seed', async ({ page }) => {
    await page.goto('/');
  });
});

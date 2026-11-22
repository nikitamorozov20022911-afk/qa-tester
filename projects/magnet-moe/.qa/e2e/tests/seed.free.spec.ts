// Стартовая точка для агентов Playwright под ролью "free" (сессия из qa-login:manual -- free).
import { test } from '@playwright/test';
import path from 'path';

test.use({ storageState: path.resolve(__dirname, '../../auth/free-r13.json') });

test.describe('seed free', () => {
  test('seed', async ({ page }) => {
    await page.goto('/');
  });
});

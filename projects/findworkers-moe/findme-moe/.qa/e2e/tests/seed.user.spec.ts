// Стартовая точка для агентов Playwright под ролью user (зарегистрированный пользователь).
import { test } from '@playwright/test';

test.use({ storageState: '../auth/user.json' });

test.describe('seed user', () => {
  test('seed', async ({ page }) => {
    await page.goto('/');
  });
});

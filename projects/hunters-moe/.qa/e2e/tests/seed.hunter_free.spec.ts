// Seed для роли hunter_free (הד האנטר (FREE)). Сессия: npm run qa-login (или qa-login:manual -- hunter_free).
import { test } from '@playwright/test';
import path from 'path';

test.use({ storageState: path.join(__dirname, '../../auth/hunter_free.json') });

test.describe('seed hunter_free', () => {
  test('seed', async ({ page }) => {
    await page.goto('/');
  });
});

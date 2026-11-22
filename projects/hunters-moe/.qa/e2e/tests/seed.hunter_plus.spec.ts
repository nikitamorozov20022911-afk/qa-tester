// Seed для роли hunter_plus (הד האנטר (PLUS)). Сессия: npm run qa-login (или qa-login:manual -- hunter_plus).
import { test } from '@playwright/test';
import path from 'path';

test.use({ storageState: path.join(__dirname, '../../auth/hunter_plus.json') });

test.describe('seed hunter_plus', () => {
  test('seed', async ({ page }) => {
    await page.goto('/');
  });
});

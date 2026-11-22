// Seed для роли hunter_free_2 (הד האנטר (FREE) #2). Сессия: npm run qa-login (или qa-login:manual -- hunter_free_2).
import { test } from '@playwright/test';
import path from 'path';

test.use({ storageState: path.join(__dirname, '../../auth/hunter_free_2.json') });

test.describe('seed hunter_free_2', () => {
  test('seed', async ({ page }) => {
    await page.goto('/');
  });
});

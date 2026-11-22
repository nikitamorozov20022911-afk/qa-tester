// Seed для роли talent_2 (טאלנט (FREE) #2). Сессия: npm run qa-login (или qa-login:manual -- talent_2).
import { test } from '@playwright/test';
import path from 'path';

test.use({ storageState: path.join(__dirname, '../../auth/talent_2.json') });

test.describe('seed talent_2', () => {
  test('seed', async ({ page }) => {
    await page.goto('/');
  });
});

// Seed для роли talent (טאלנט (FREE)). Сессия: npm run qa-login (или qa-login:manual -- talent).
import { test } from '@playwright/test';
import path from 'path';

test.use({ storageState: path.join(__dirname, '../../auth/talent.json') });

test.describe('seed talent', () => {
  test('seed', async ({ page }) => {
    await page.goto('/');
  });
});

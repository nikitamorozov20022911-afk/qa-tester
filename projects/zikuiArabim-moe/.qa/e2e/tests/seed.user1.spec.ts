// Стартовая точка для агентов Playwright под ролью user1 (вход по телефону + OTP, сессия из .qa/auth/user1.json).
import { test } from '@playwright/test';
import * as path from 'path';

test.use({ storageState: path.resolve(__dirname, '../../auth/user1.json') });

test.describe('seed user1', () => {
  test('seed', async ({ page }) => {
    await page.goto('/home');
  });
});

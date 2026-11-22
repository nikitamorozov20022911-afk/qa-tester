// Стартовая точка для агентов Playwright под ролью user2 (вход по телефону + OTP, сессия из .qa/auth/user2.json).
import { test } from '@playwright/test';
import * as path from 'path';

test.use({ storageState: path.resolve(__dirname, '../../auth/user2.json') });

test.describe('seed user2', () => {
  test('seed', async ({ page }) => {
    await page.goto('/home');
  });
});

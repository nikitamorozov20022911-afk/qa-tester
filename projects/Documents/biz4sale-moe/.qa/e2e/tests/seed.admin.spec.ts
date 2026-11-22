// qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0
// Стартовая точка для агентов Playwright под ролью admin (сессия из qa-login:manual).
import { test } from '@playwright/test';

test.use({ storageState: '../auth/admin.json' });

test.describe('seed admin', () => {
  test('seed', async ({ page }) => {
    await page.goto('/');
  });
});

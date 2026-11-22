// qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0
// Стартовая точка для агентов Playwright: Admin (он же техник и обычный пользователь) на app.techory.ai.
import { test } from '@playwright/test';

test.use({ storageState: '../auth/admin.json' });

test.describe('seed admin', () => {
  test('seed', async ({ page }) => {
    await page.goto('/dashboard');
  });
});

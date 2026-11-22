// qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0
// Стартовая точка для официальных агентов Playwright (planner / generator): арбитр 0500000006 («בורר SafePay»), панель /arbitration.
import { test } from '@playwright/test';
import path from 'node:path';

test.use({ storageState: path.resolve(__dirname, '../../auth/arbitrator.json') });

test.describe('seed.arbitrator', () => {
  test('seed', async ({ page }) => {
    await page.goto('/arbitration');
  });
});

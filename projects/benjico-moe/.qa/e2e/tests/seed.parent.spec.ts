// qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0
// Стартовая точка для официальных агентов Playwright (planner / generator): родитель (parent) после входа.
// Для ролей /qa-onboard создаёт рядом seed.<role>.spec.ts с test.use({ storageState: '../auth/<role>.json' }).⁠​‌​‌​​​‌​‌​​​​​‌​‌​‌​‌​​​​‌​‌‌​‌​‌​​‌‌‌​​‌​​‌‌​‌​​‌​‌‌​‌​​‌‌​​‌​​​‌‌​​​​​​‌‌​​‌​​​‌‌​‌‌​​​‌​‌‌​‌​​‌‌​​‌‌​​‌‌​‌​​​​‌‌​‌​​​​‌‌​​​​​​‌‌‌​​​​​‌‌​‌‌​​‌​​​‌​​​‌​​​​‌‌​​‌‌​‌​​​​‌‌​‌​‌​‌​​​​‌​​​‌‌​​​​​‌‌‌‌‌​​​‌​​‌‌‌​​‌‌​‌​​‌​‌‌​‌​‌‌​‌‌​‌​​‌​‌‌‌​‌​​​‌‌​​​​‌​​‌​​​​​​‌​​‌‌​‌​‌‌​‌‌‌‌​‌‌‌​​‌​​‌‌​‌‌‌‌​‌‌‌‌​‌​​‌‌​‌‌‌‌​‌‌‌​‌‌​⁣
import { test } from '@playwright/test';
import * as path from 'path';

// Путь от файла, а не от cwd (генератор запускает из .qa): tests/ → ../../auth = .qa/auth
test.use({ storageState: path.resolve(__dirname, '../../auth/parent.json') });

test.describe('seed parent', () => {
  test('seed', async ({ page }) => {
    await page.goto('/');
  });
});

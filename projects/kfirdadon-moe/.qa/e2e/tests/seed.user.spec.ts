// qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0
// Seed для роли user.
// Для ролей /qa-onboard создаёт рядом seed.<role>.spec.ts с test.use({ storageState: '../auth/<role>.json' }).⁠​‌​‌​​​‌​‌​​​​​‌​‌​‌​‌​​​​‌​‌‌​‌​‌​​‌‌‌​​‌​​‌‌​‌​​‌​‌‌​‌​​‌‌​​‌​​​‌‌​​​​​​‌‌​​‌​​​‌‌​‌‌​​​‌​‌‌​‌​​‌‌​​‌‌​​‌‌​‌​​​​‌‌​‌​​​​‌‌​​​​​​‌‌‌​​​​​‌‌​‌‌​​‌​​​‌​​​‌​​​​‌‌​​‌‌​‌​​​​‌‌​‌​‌​‌​​​​‌​​​‌‌​​​​​‌‌‌‌‌​​​‌​​‌‌‌​​‌‌​‌​​‌​‌‌​‌​‌‌​‌‌​‌​​‌​‌‌‌​‌​​​‌‌​​​​‌​​‌​​​​​​‌​​‌‌​‌​‌‌​‌‌‌‌​‌‌‌​​‌​​‌‌​‌‌‌‌​‌‌‌‌​‌​​‌‌​‌‌‌‌​‌‌‌​‌‌​⁣
import { test } from '@playwright/test';

test.use({ storageState: '../auth/user.json' });

test.describe('seed user', () => {
  test('seed', async ({ page }) => {
    await page.goto('/');
  });
});

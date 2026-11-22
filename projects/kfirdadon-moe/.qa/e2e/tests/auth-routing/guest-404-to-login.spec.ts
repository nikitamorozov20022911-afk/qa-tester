// qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0
// spec: specs/auth-routing.md
// seed: tests/seed.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Гость на защищённой странице', () => {
  test('гость на несуществующем пути → /login, from = /no-such-page @desktop @prod-safe #01649c9c8c436e2d1a46f007', async ({ page }) => {
    // Открыть /no-such-page
    await page.goto('/no-such-page');

    await page.waitForURL((u) => u.pathname === '/login');
    await expect(page.getByRole('heading', { level: 1, name: 'התחברות' })).toBeVisible();
    await expect(page.getByText('המסך לא נמצא')).toHaveCount(0);
    expect(await page.evaluate(() => history.state?.usr?.from)).toBe('/no-such-page');
  });
});

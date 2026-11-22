// qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0
// spec: specs/auth-routing.md
// seed: tests/seed.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Гость на защищённой странице', () => {
  test('гость на защищённых страницах → /login, from = путь + query, без #hash @desktop @prod-safe #01649c9c8c436e2d1a46f007', async ({ page }) => {
    const cases: Array<[string, string]> = [
      ['/settings/users', '/settings/users'],
      ['/admin/businesses', '/admin/businesses'],
      ['/admin/providers', '/admin/providers'],
      ['/simulations', '/simulations'],
      ['/candidates?x=1#h', '/candidates?x=1'],
    ];

    for (const [open, expectedFrom] of cases) {
      // Открыть защищённый путь как гость
      await page.goto(open);

      // Дождаться /login; прочитать history.state.usr.from
      await page.waitForURL((u) => u.pathname === '/login');
      await expect(page.getByRole('heading', { level: 1, name: 'התחברות' })).toBeVisible();
      await expect(page.getByRole('textbox', { name: 'כתובת מייל' })).toBeVisible();
      await expect(page.getByRole('textbox', { name: 'סיסמה', exact: true })).toBeVisible();
      await expect(page.getByRole('button', { name: 'התחברות', exact: true })).toBeVisible();

      expect(await page.evaluate(() => history.state?.usr?.from)).toBe(expectedFrom);
    }
  });
});

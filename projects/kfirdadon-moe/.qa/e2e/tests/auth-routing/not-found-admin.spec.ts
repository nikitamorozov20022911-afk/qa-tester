// qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0
// spec: specs/auth-routing.md
// seed: tests/seed.admin.spec.ts
import { test, expect } from '@playwright/test';

test.use({ storageState: '../auth/admin.json' });

test.describe('Страница 404 под ролью', () => {
  test('admin: 404 — один h1 «המסך לא נמצא», RTL, «חזרה למסך הבית» → /admin/businesses @desktop @prod-safe #01649c9c8c436e2d1a46f007', async ({ page }) => {
    // Открыть /no-such-page
    await page.goto('/no-such-page');

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('המסך לא נמצא');
    expect(await h1.evaluate((el) => getComputedStyle(el).direction)).toBe('rtl');

    const home = page.getByRole('link', { name: 'חזרה למסך הבית' });
    await expect(home).toHaveAttribute('href', '/admin/businesses');
    await home.click();

    await page.waitForURL((u) => u.pathname === '/admin/businesses');
    await expect(page.getByRole('heading', { level: 1, name: 'בתי העסק' })).toBeVisible();
  });
});

// spec: specs/home.md
// seed: tests/seed.provider.spec.ts

import { test, expect } from '@playwright/test';
import path from 'node:path';

test.use({ storageState: path.resolve(__dirname, '../../../auth/provider.json') });

test.describe('מסך הבית — יתרה בדולרים לפי שער יציג', () => {
  test('אין שער — אין שורת דולרים, היתרה בשקלים מוצגת @iphone @prod-safe (#ed59d3)', async ({ page }) => {
    // 1-2. Block the exchange-rate edge function before opening /wallet
    await page.route('**/functions/v1/exchange-rate', (route) => route.abort());

    await page.goto('/wallet');

    // 3. Wait for the balance label and the ILS amount
    await expect(page.getByText('היתרה שלך')).toBeVisible();
    await expect(page.getByLabel(/^₪[\d,]+(\.\d+)?$/).first()).toBeVisible();

    // Expected: no USD line, no error, screen not empty
    await expect(page.getByText(/≈\s*\$/)).toHaveCount(0);
    await expect(page.getByText(/שער יציג/)).toHaveCount(0);
    await expect(page.getByText(/שגיאה/)).toHaveCount(0);
    await expect(page.getByText('שמור בנאמנות')).toBeVisible();
  });
});

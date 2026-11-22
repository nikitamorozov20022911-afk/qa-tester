// spec: .qa/e2e/specs/payment-window-cardcom.md
// seed: tests/seed.hunter_free_2.spec.ts
import { test, expect } from '@playwright/test';
import path from 'path';

test.use({ storageState: path.join(__dirname, '../../auth/hunter_free_2.json') });

test.describe('Payment window — close button and keyboard (#cca841)', () => {
  test('Back arrow «חזרה» on the payment step returns to plan selection', { tag: ['@desktop', '@prod-safe', '@payment-window'] }, async ({ page }) => {
    // 1. Open the payment window (as in 1.1).
    await page.goto('/profile?tab=subscription');
    await page.getByRole('button', { name: 'בחירת חבילה' }).first().click();
    await page.getByRole('radio', { name: /PLUS/ }).click();
    await page.getByRole('button', { name: 'המשך עם החבילה שנבחרה' }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('heading', { name: 'תשלום', exact: true })).toBeVisible();

    // 2. Click the button «חזרה» in the dialog header.
    await dialog.getByRole('button', { name: 'חזרה' }).click();

    // Expected: dialog still open on the plan step; payment heading is gone
    await expect(dialog).toHaveCount(1);
    await expect(dialog.getByRole('heading', { name: 'בחירת חבילה', exact: true })).toBeVisible();
    await expect(dialog.getByRole('radio', { name: /PLUS/ })).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'המשך עם החבילה שנבחרה' })).toBeVisible();
    await expect(dialog.getByRole('heading', { name: 'תשלום', exact: true })).toHaveCount(0);

    // 3. Close the window with «סגירה».
    await dialog.getByRole('button', { name: 'סגירה' }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });
});

// spec: .qa/e2e/specs/payment-window-cardcom.md
// seed: tests/seed.hunter_free_2.spec.ts
import { test, expect, type Page } from '@playwright/test';
import path from 'path';

test.use({ storageState: path.join(__dirname, '../../auth/hunter_free_2.json') });

async function openPaymentWindow(page: Page) {
  await page.goto('/profile?tab=subscription');
  await page.getByRole('button', { name: 'בחירת חבילה' }).first().click();
  await page.getByRole('radio', { name: /PLUS/ }).click();
  await page.getByRole('button', { name: 'המשך עם החבילה שנבחרה' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('heading', { name: 'תשלום', exact: true })).toBeVisible();
  return dialog;
}

test.describe('Payment window — close button and keyboard (#cca841)', () => {
  test('Escape with focus in the coupon field still closes the payment window', { tag: ['@desktop', '@prod-safe', '@payment-window'] }, async ({ page }) => {
    // 1. Open the payment window (as in 1.1).
    await openPaymentWindow(page);

    // 2. Click the coupon input #coupon (do not type); expect it focused; press Escape.
    await page.locator('#coupon').click();
    await expect(page.locator('#coupon')).toBeFocused();
    await page.keyboard.press('Escape');

    // Expected: no dialog left.
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });
});

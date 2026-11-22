// spec: .qa/e2e/specs/payment-window-cardcom.md
// seed: tests/seed.hunter_free_2.spec.ts
import { test, expect } from '@playwright/test';
import path from 'path';

test.use({ storageState: path.join(__dirname, '../../auth/hunter_free_2.json') });

test.describe('Payment window — close button and keyboard (#cca841)', () => {
  test('Close button «סגירה» on the payment step closes the whole window in one click', { tag: ['@desktop', '@prod-safe', '@payment-window'] }, async ({ page }) => {
    // 1. Open the payment window as in 1.1 (steps 1–3); wait for heading «תשלום».
    await page.goto('/profile?tab=subscription');
    await page.getByRole('button', { name: 'בחירת חבילה' }).first().click();
    await page.getByRole('radio', { name: /PLUS/ }).click();
    await page.getByRole('button', { name: 'המשך עם החבילה שנבחרה' }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('heading', { name: 'תשלום', exact: true })).toBeVisible();

    // 2. Read the button with accessible name «סגירה» inside the dialog; click it once.
    const closeButton = dialog.getByRole('button', { name: 'סגירה' });
    await expect(closeButton).toBeVisible();
    const box = await closeButton.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(24);
    expect(box!.height).toBeGreaterThanOrEqual(24);

    await closeButton.click();

    // Expected: no dialog is left (not a return to «בחירת חבילה»)
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });
});

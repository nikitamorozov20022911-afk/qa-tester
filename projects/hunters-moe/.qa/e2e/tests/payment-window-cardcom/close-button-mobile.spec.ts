// spec: .qa/e2e/specs/payment-window-cardcom.md
// seed: tests/seed.hunter_free_2.spec.ts
import { test, expect } from '@playwright/test';
import path from 'path';

test.use({ storageState: path.join(__dirname, '../../auth/hunter_free_2.json') });

test.describe('Payment window — close button and keyboard (#cca841)', () => {
  test('iPhone 375×812: close button visible in the payment header, not overlapping «תשלום», tap closes', { tag: ['@iphone', '@prod-safe', '@payment-window'] }, async ({ page }) => {
    // 1. Open the payment window as in 1.1 (steps 1–3); do not scroll after the «תשלום» step opens.
    await page.goto('/profile?tab=subscription');
    await page.getByRole('button', { name: 'בחירת חבילה' }).first().click();
    await page.getByRole('radio', { name: /PLUS/ }).click();
    await page.getByRole('button', { name: 'המשך עם החבילה שנבחרה' }).click();

    const dialog = page.getByRole('dialog');
    const heading = dialog.getByRole('heading', { name: 'תשלום', exact: true });
    const closeButton = dialog.getByRole('button', { name: 'סגירה' });
    await expect(heading).toBeVisible();

    // 2. Measure the bounding boxes of «סגירה» and «תשלום»; tap «סגירה».
    await expect(closeButton).toBeInViewport();
    const closeBox = await closeButton.boundingBox();
    const headingBox = await heading.boundingBox();
    expect(closeBox).not.toBeNull();
    expect(headingBox).not.toBeNull();
    expect(closeBox!.width).toBeGreaterThanOrEqual(24);
    expect(closeBox!.height).toBeGreaterThanOrEqual(24);

    // The two boxes do not intersect
    const intersect =
      closeBox!.x < headingBox!.x + headingBox!.width &&
      closeBox!.x + closeBox!.width > headingBox!.x &&
      closeBox!.y < headingBox!.y + headingBox!.height &&
      closeBox!.y + closeBox!.height > headingBox!.y;
    expect(intersect).toBe(false);

    await closeButton.tap();

    // Expected: no dialog is left
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });
});

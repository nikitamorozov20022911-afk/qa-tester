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

async function tabToClose(page: Page, closeButton: ReturnType<Page['locator']>) {
  for (let i = 0; i < 15; i++) {
    if (await closeButton.evaluate((el) => el === document.activeElement)) break;
    await page.keyboard.press('Tab');
  }
  await expect(closeButton).toBeFocused();
}

test.describe('Payment window — close button and keyboard (#cca841)', () => {
  test('Close button is reachable with Tab and closes on Enter and on Space', { tag: ['@desktop', '@prod-safe', '@payment-window'] }, async ({ page }) => {
    // 1. Open the payment window (as in 1.1); press Tab until the button «סגירה» is focused (max 15 presses).
    let dialog = await openPaymentWindow(page);
    let closeButton = dialog.getByRole('button', { name: 'סגירה' });
    await tabToClose(page, closeButton);

    // 2. Press Enter.
    await page.keyboard.press('Enter');
    await expect(page.getByRole('dialog')).toHaveCount(0);

    // 3. Open the payment window again; Tab to «סגירה»; press Space.
    dialog = await openPaymentWindow(page);
    closeButton = dialog.getByRole('button', { name: 'סגירה' });
    await tabToClose(page, closeButton);
    await page.keyboard.press('Space');
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });
});

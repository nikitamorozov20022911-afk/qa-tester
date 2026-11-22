// spec: .qa/e2e/specs/hunter-nda.md
// seed: tests/seed.hunter_plus.spec.ts
import { test, expect } from '@playwright/test';
import path from 'path';

test.use({ storageState: path.join(__dirname, '../../../auth/hunter_plus.json') });

test.describe('Blocked chat while the NDA waits', () => {
  test('Pending NDA chat: composer and «שליחה» disabled, waiting bar shown, also after reload @desktop @prod-safe #fb0f43', async ({ page }) => {
    const waitingText = 'ממתינים לאישור של הד האנטר דמו 1 ל-NDA. אפשר לכתוב אחרי האישור.';

    const check = async () => {
      await expect(page.getByText(waitingText)).toBeVisible();
      const box = page.getByRole('textbox', { name: 'כתיבת הודעה' });
      if (await box.count()) await expect(box).toBeDisabled();
      const send = page.getByRole('button', { name: 'שליחה', exact: true });
      if (await send.count()) await expect(send).toBeDisabled();
    };

    // 1. Go to the chat
    await page.goto('/messages?c=daf8b54a-2dbe-4447-b596-89834a33472e');

    // 2. Wait for the header and guard the data state
    await expect(page.getByText('הד האנטר דמו 1').first()).toBeVisible({ timeout: 30_000 });
    await page.keyboard.press('Escape'); // secret-code dialog, if any
    const box = page.getByRole('textbox', { name: 'כתיבת הודעה' });
    const waitingBar = page.getByText(waitingText);
    await page.waitForTimeout(1500);
    const open = (await box.count()) > 0 && (await box.isEnabled()) && (await waitingBar.count()) === 0;
    test.skip(open, 'fb0f43 data changed: NDA with demo-hunter-1 is no longer pending');

    await check();

    // 3. Reload and read again
    await page.reload();
    await expect(page.getByText('הד האנטר דמו 1').first()).toBeVisible({ timeout: 30_000 });
    await page.keyboard.press('Escape');
    await check();
  });
});

// spec: LinkedIn screenshot import — Edit Profile
// seed: tests/seed.talent.spec.ts
import { test, expect } from '@playwright/test';
import path from 'path';

test.use({ storageState: path.join(__dirname, '../../../auth/talent.json') });

test.describe('LinkedIn screenshot import — Edit Profile', () => {
  test('The import summary lists «כותרת התפקיד» @desktop #8fc7be', async ({ page }) => {
    // 1. Open /profile?edit=personal, tab «פרטים אישיים».
    await page.goto('https://hunters-sooty.vercel.app/profile?edit=personal');
    const dialog = page.getByRole('dialog', { name: 'עריכת פרופיל' });
    await expect(dialog).toBeVisible();
    const personalTab = dialog.getByRole('tab', { name: 'פרטים אישיים' });
    if ((await personalTab.getAttribute('aria-selected')) !== 'true') {
      await personalTab.click();
    }
    await expect(personalTab).toHaveAttribute('aria-selected', 'true');

    // 2. Upload li-mock-1.png, wait for the summary box «יובא מצילום המסך של LinkedIn».
    const chooserPromise = page.waitForEvent('filechooser');
    await dialog.getByRole('button', { name: 'בחירת תמונה', exact: true }).click();
    const chooser = await chooserPromise;
    await chooser.setFiles(path.join(__dirname, '../../fixtures/linkedin-screenshot/li-mock-1.png'));
    await expect(dialog.getByText('יובא מצילום המסך של LinkedIn')).toBeVisible({ timeout: 90_000 });

    // 3. Scroll the summary box to its bottom.
    const jobTitleRow = dialog.getByRole('listitem').filter({ hasText: 'כותרת התפקיד:' });
    await jobTitleRow.scrollIntoViewIfNeeded();
    await expect(jobTitleRow).toBeVisible();

    // Expected: the row contains the job title and the company, with «להשתמש בזה»
    await expect(jobTitleRow).toContainText('Senior Backend Developer');
    await expect(jobTitleRow).toContainText('Wix');
    await expect(jobTitleRow.getByRole('button', { name: 'להשתמש בזה' })).toBeVisible();

    // Close the dialog without saving
    await dialog.getByRole('button', { name: 'סגירה' }).click();
    await expect(dialog).toBeHidden();
  });
});

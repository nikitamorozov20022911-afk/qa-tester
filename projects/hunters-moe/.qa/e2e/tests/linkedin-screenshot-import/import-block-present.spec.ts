// spec: LinkedIn screenshot import — Edit Profile
// seed: tests/seed.talent.spec.ts
import { test, expect } from '@playwright/test';
import path from 'path';

test.use({ storageState: path.join(__dirname, '../../../auth/talent.json') });

test.describe('LinkedIn screenshot import — Edit Profile', () => {
  test('The screenshot-import block is on «פרטים אישיים» under the LinkedIn import @desktop @prod-safe #8fc7be', async ({ page }) => {
    // 1. Open /profile?edit=personal (talent session).
    await page.goto('https://hunters-sooty.vercel.app/profile?edit=personal');
    const dialog = page.getByRole('dialog', { name: 'עריכת פרופיל' });
    await expect(dialog).toBeVisible();

    // 2. If the tab «פרטים אישיים» is not active — click it.
    const personalTab = dialog.getByRole('tab', { name: 'פרטים אישיים' });
    if ((await personalTab.getAttribute('aria-selected')) !== 'true') {
      await personalTab.click();
    }
    await expect(personalTab).toHaveAttribute('aria-selected', 'true');

    // 3. Scroll to the heading «ייבוא מצילום מסך של LinkedIn», right under «ייבוא מקובץ PDF של LinkedIn».
    const pdfLabel = dialog.getByText('ייבוא מקובץ PDF של LinkedIn', { exact: true });
    const pdfButton = dialog.getByRole('button', { name: 'העלאת PDF מ-LinkedIn' });
    const screenshotHeading = dialog.getByText('ייבוא מצילום מסך של LinkedIn', { exact: true });
    await screenshotHeading.scrollIntoViewIfNeeded();

    await expect(pdfLabel).toBeVisible();
    await expect(pdfButton).toBeVisible();
    await expect(screenshotHeading).toBeVisible();

    // Heading is below the PDF import block
    const pdfBox = await pdfButton.boundingBox();
    const headingBox = await screenshotHeading.boundingBox();
    expect(headingBox!.y).toBeGreaterThan(pdfBox!.y);

    // Drop zone, button and hint
    await expect(dialog.getByText('הדביקו כאן צילום מסך (Ctrl+V) או גררו תמונה לכאן')).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'בחירת תמונה' })).toBeVisible();
    await expect(dialog.getByText('PNG, JPG או WebP, עד 5MB לתמונה, עד 4 תמונות בכל פעם')).toBeVisible();

    // Close the dialog without saving
    await dialog.getByRole('button', { name: 'סגירה' }).click();
    await expect(dialog).toBeHidden();
  });
});

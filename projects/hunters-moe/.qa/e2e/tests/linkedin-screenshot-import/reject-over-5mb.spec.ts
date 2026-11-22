// spec: LinkedIn screenshot import — invalid files
// seed: tests/seed.talent.spec.ts
import { test, expect } from '@playwright/test';
import path from 'path';

test.use({ storageState: path.join(__dirname, '../../../auth/talent.json') });

test.describe('LinkedIn screenshot import — invalid files', () => {
  test('A file over 5 MB is rejected with a clear message @desktop @prod-safe #8fc7be', async ({ page }) => {
    // 1. Open /profile?edit=personal, tab «פרטים אישיים».
    await page.goto('https://hunters-sooty.vercel.app/profile?edit=personal');
    const dialog = page.getByRole('dialog', { name: 'עריכת פרופיל' });
    await expect(dialog).toBeVisible();
    const personalTab = dialog.getByRole('tab', { name: 'פרטים אישיים' });
    if ((await personalTab.getAttribute('aria-selected')) !== 'true') {
      await personalTab.click();
    }
    await expect(personalTab).toHaveAttribute('aria-selected', 'true');

    const firstName = dialog.getByRole('textbox', { name: 'שם פרטי (שדה חובה)' });
    const firstNameBefore = await firstName.inputValue();

    // 2. Upload neg-big-6mb.png (6.1 MB).
    const fileChooserPromise = page.waitForEvent('filechooser');
    await dialog.getByRole('button', { name: 'בחירת תמונה' }).click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(path.join(__dirname, '../../fixtures/linkedin-screenshot/neg-big-6mb.png'));

    // Expected: error toast starting with «התמונה גדולה מדי» and containing «5MB»
    await expect(page.getByText(/התמונה גדולה מדי.*5MB/)).toBeVisible();

    // No summary box, no field changes
    await expect(page.getByText('יובא מצילום המסך של LinkedIn')).toHaveCount(0);
    await expect(firstName).toHaveValue(firstNameBefore);

    // Close the dialog without saving
    await dialog.getByRole('button', { name: 'סגירה' }).click();
    await expect(dialog).toBeHidden();
  });
});

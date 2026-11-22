// spec: LinkedIn screenshot import — Edit Profile
// seed: tests/seed.talent.spec.ts
import { test, expect } from '@playwright/test';
import path from 'path';

test.use({ storageState: path.join(__dirname, '../../../auth/talent.json') });

test.describe('LinkedIn screenshot import — Edit Profile', () => {
  test('Import by «בחירת תמונה» fills «כמה מילים עליכם» and the LinkedIn link, shows a summary @desktop #8fc7be', async ({ page }) => {
    // 1. Open /profile?edit=personal, tab «פרטים אישיים».
    await page.goto('https://hunters-sooty.vercel.app/profile?edit=personal');
    const dialog = page.getByRole('dialog', { name: 'עריכת פרופיל' });
    await expect(dialog).toBeVisible();
    const personalTab = dialog.getByRole('tab', { name: 'פרטים אישיים' });
    if ((await personalTab.getAttribute('aria-selected')) !== 'true') {
      await personalTab.click();
    }
    await expect(personalTab).toHaveAttribute('aria-selected', 'true');

    // 2. Read the values of «כמה מילים עליכם» and the LinkedIn field before the import.
    const about = dialog.getByRole('textbox', { name: /כמה מילים עליכם/ });
    const linkedin = dialog.getByPlaceholder('https://linkedin.com/in/…');
    const aboutBefore = await about.inputValue();
    const linkedinBefore = await linkedin.inputValue();

    // 3. Upload li-mock-1.png through «בחירת תמונה».
    const chooserPromise = page.waitForEvent('filechooser');
    await dialog.getByRole('button', { name: 'בחירת תמונה', exact: true }).click();
    const chooser = await chooserPromise;
    await chooser.setFiles(path.join(__dirname, '../../fixtures/linkedin-screenshot/li-mock-1.png'));

    // 4. Wait for the summary box titled «יובא מצילום המסך של LinkedIn».
    await expect(dialog.getByText('יובא מצילום המסך של LinkedIn')).toBeVisible({ timeout: 90_000 });

    // Drop-zone button text changed
    await expect(dialog.getByRole('button', { name: 'בחירת תמונה נוספת' })).toBeVisible();

    // «כמה מילים עליכם»
    if (aboutBefore.trim() === '') {
      await expect(about).toHaveValue(/^Backend developer with 8 years of experience/);
    } else {
      await expect(about).toHaveValue(aboutBefore);
      await expect(dialog.getByRole('listitem').filter({ hasText: 'כמה מילים עליכם:' })).toBeVisible();
      await expect(dialog.getByRole('button', { name: 'להשתמש בזה' }).first()).toBeVisible();
    }

    // LinkedIn field
    if (linkedinBefore.trim() === '') {
      await expect(linkedin).toHaveValue(/linkedin\.com\/in\/dana-levi-qa0711/);
    } else {
      await expect(linkedin).toHaveValue(linkedinBefore);
    }

    // «כמה מילים עליכם» stays editable
    await expect(about).toBeEditable();

    // Do not save; close the dialog without saving
    await dialog.getByRole('button', { name: 'סגירה' }).click();
    await expect(dialog).toBeHidden();
  });
});

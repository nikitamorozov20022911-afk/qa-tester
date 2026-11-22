// spec: LinkedIn screenshot import — Edit Profile
// seed: tests/seed.talent.spec.ts
import { test, expect } from '@playwright/test';
import path from 'path';

test.use({ storageState: path.join(__dirname, '../../../auth/talent.json') });

test.describe('LinkedIn screenshot import — Edit Profile', () => {
  test('Filled fields are kept and the screenshot value is offered with «להשתמש בזה» @desktop #8fc7be', async ({ page }) => {
    // 1. Open /profile?edit=personal, tab «פרטים אישיים». Remember values of «שם פרטי», «שם משפחה», «כתובת».
    await page.goto('https://hunters-sooty.vercel.app/profile?edit=personal');
    const dialog = page.getByRole('dialog', { name: 'עריכת פרופיל' });
    await expect(dialog).toBeVisible();
    const personalTab = dialog.getByRole('tab', { name: 'פרטים אישיים' });
    if ((await personalTab.getAttribute('aria-selected')) !== 'true') {
      await personalTab.click();
    }
    await expect(personalTab).toHaveAttribute('aria-selected', 'true');

    const firstName = dialog.getByRole('textbox', { name: /שם פרטי/ });
    const lastName = dialog.getByRole('textbox', { name: /שם משפחה/ });
    const address = dialog.getByRole('textbox', { name: /כתובת/ });
    const firstNameBefore = await firstName.inputValue();
    const lastNameBefore = await lastName.inputValue();
    const addressBefore = await address.inputValue();
    expect(firstNameBefore.trim()).not.toBe('');
    expect(lastNameBefore.trim()).not.toBe('');
    expect(addressBefore.trim()).not.toBe('');

    // 2. Upload li-mock-1.png, wait for the summary box «יובא מצילום המסך של LinkedIn».
    const chooserPromise = page.waitForEvent('filechooser');
    await dialog.getByRole('button', { name: 'בחירת תמונה', exact: true }).click();
    const chooser = await chooserPromise;
    await chooser.setFiles(path.join(__dirname, '../../fixtures/linkedin-screenshot/li-mock-1.png'));
    await expect(dialog.getByText('יובא מצילום המסך של LinkedIn')).toBeVisible({ timeout: 90_000 });

    // 3. In the summary read the line «בשדות האלה השארנו את מה שמילאתם, ובצילום המסך כתוב אחרת:» and its rows.
    await expect(dialog.getByText('בשדות האלה השארנו את מה שמילאתם, ובצילום המסך כתוב אחרת:')).toBeVisible();
    const firstNameRow = dialog.getByRole('listitem').filter({ hasText: 'שם פרטי:' });
    const lastNameRow = dialog.getByRole('listitem').filter({ hasText: 'שם משפחה:' });
    const addressRow = dialog.getByRole('listitem').filter({ hasText: 'כתובת:' });
    await expect(firstNameRow).toContainText('Dana');
    await expect(lastNameRow).toContainText('Levi');
    await expect(addressRow).toContainText('Tel Aviv District, Israel');
    await expect(firstNameRow.getByRole('button', { name: 'להשתמש בזה' })).toBeVisible();
    await expect(lastNameRow.getByRole('button', { name: 'להשתמש בזה' })).toBeVisible();
    await expect(addressRow.getByRole('button', { name: 'להשתמש בזה' })).toBeVisible();

    // The filled fields keep their old values right after the import
    await expect(firstName).toHaveValue(firstNameBefore);
    await expect(lastName).toHaveValue(lastNameBefore);
    await expect(address).toHaveValue(addressBefore);

    // 4. Click «להשתמש בזה» next to the row «שם פרטי:».
    await firstNameRow.getByRole('button', { name: 'להשתמש בזה' }).click();
    await expect(firstName).toHaveValue('Dana');
    await expect(lastName).toHaveValue(lastNameBefore);
    await expect(address).toHaveValue(addressBefore);

    // Do not save; close the dialog
    await dialog.getByRole('button', { name: 'סגירה' }).click();
    await expect(dialog).toBeHidden();
  });
});

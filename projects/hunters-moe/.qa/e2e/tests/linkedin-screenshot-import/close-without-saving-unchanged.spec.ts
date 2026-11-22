// spec: LinkedIn screenshot import — Edit Profile
// seed: tests/seed.talent.spec.ts
import { test, expect, Page } from '@playwright/test';
import path from 'path';

test.use({ storageState: path.join(__dirname, '../../../auth/talent.json') });

async function readValues(page: Page) {
  const dialog = page.getByRole('dialog', { name: 'עריכת פרופיל' });
  await expect(dialog).toBeVisible();
  const personalTab = dialog.getByRole('tab', { name: 'פרטים אישיים' });
  const experienceTab = dialog.getByRole('tab', { name: 'ניסיון מקצועי' });
  const firstName = await dialog.getByRole('textbox', { name: 'שם פרטי (שדה חובה)' }).inputValue();
  const lastName = await dialog.getByRole('textbox', { name: 'שם משפחה (שדה חובה)' }).inputValue();
  const about = await dialog.getByRole('textbox', { name: 'כמה מילים עליכם (שדה חובה)' }).inputValue();
  const linkedin = await dialog.getByRole('textbox', { name: 'פרופיל LinkedIn', exact: true }).inputValue();
  const address = await dialog.getByRole('textbox', { name: 'כתובת', exact: true }).inputValue();
  await experienceTab.click();
  const headline = dialog.locator('#headline');
  await expect(headline).toBeVisible();
  const headlineValue = await headline.inputValue();
  const experienceText = await dialog.getByRole('heading', { name: 'ניסיון תעסוקתי' }).locator('..').innerText();
  const educationText = await dialog.getByRole('heading', { name: 'השכלה' }).locator('..').innerText();
  await personalTab.click();
  await expect(personalTab).toHaveAttribute('aria-selected', 'true');
  return { firstName, lastName, about, linkedin, address, headlineValue, experienceText, educationText };
}

test.describe('LinkedIn screenshot import — Edit Profile', () => {
  test('Closing the dialog without saving leaves every field unchanged @desktop #8fc7be', async ({ page }) => {
    // 1. Open /profile?edit=personal. Remember the values.
    await page.goto('https://hunters-sooty.vercel.app/profile?edit=personal');
    const dialog = page.getByRole('dialog', { name: 'עריכת פרופיל' });
    const before = await readValues(page);

    // 2. Back on «פרטים אישיים»: upload li-mock-1.png, wait for the summary box; click «להשתמש בזה» next to «שם פרטי:».
    const chooserPromise = page.waitForEvent('filechooser');
    await dialog.getByRole('button', { name: 'בחירת תמונה', exact: true }).click();
    const chooser = await chooserPromise;
    await chooser.setFiles(path.join(__dirname, '../../fixtures/linkedin-screenshot/li-mock-1.png'));
    await expect(dialog.getByText('יובא מצילום המסך של LinkedIn')).toBeVisible({ timeout: 90_000 });
    await dialog.getByRole('button', { name: 'להשתמש בזה' }).first().click();

    // 3. Close the dialog with «סגירה» (no save).
    page.on('dialog', (d) => d.accept());
    await dialog.getByRole('button', { name: 'סגירה' }).click();
    await expect(dialog).toBeHidden();

    // 4. Reload /profile?edit=personal; read the same values again.
    await page.goto('https://hunters-sooty.vercel.app/profile?edit=personal');
    const after = await readValues(page);

    expect(after).toEqual(before);
    expect(after.firstName).not.toBe('Dana');
    expect(after.experienceText).not.toMatch(/Wix|Check Point/);
    expect(after.educationText).not.toContain('Tel Aviv University');
  });
});

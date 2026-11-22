// spec: LinkedIn screenshot import — Edit Profile
// seed: tests/seed.talent.spec.ts
import { test, expect } from '@playwright/test';
import path from 'path';

test.use({ storageState: path.join(__dirname, '../../../auth/talent.json') });

test.describe('LinkedIn screenshot import — Edit Profile', () => {
  test('A filled «כותרת התפקיד» is kept and the screenshot headline is offered with «להשתמש בזה» @desktop #8fc7be', async ({ page }) => {
    // 1. Open /profile?edit=personal; open tab «ניסיון מקצועי»; remember the value of «כותרת התפקיד».
    await page.goto('https://hunters-sooty.vercel.app/profile?edit=personal');
    const dialog = page.getByRole('dialog', { name: 'עריכת פרופיל' });
    await expect(dialog).toBeVisible();
    const personalTab = dialog.getByRole('tab', { name: 'פרטים אישיים' });
    const experienceTab = dialog.getByRole('tab', { name: 'ניסיון מקצועי' });
    await experienceTab.click();
    const headline = dialog.locator('#headline');
    await expect(headline).toBeVisible();
    const remembered = await headline.inputValue();
    expect(remembered).not.toBe('');

    // 2. Back on «פרטים אישיים»: upload li-mock-1.png, wait for the summary box.
    await personalTab.click();
    await expect(personalTab).toHaveAttribute('aria-selected', 'true');
    const chooserPromise = page.waitForEvent('filechooser');
    await dialog.getByRole('button', { name: 'בחירת תמונה', exact: true }).click();
    const chooser = await chooserPromise;
    await chooser.setFiles(path.join(__dirname, '../../fixtures/linkedin-screenshot/li-mock-1.png'));
    await expect(dialog.getByText('יובא מצילום המסך של LinkedIn')).toBeVisible({ timeout: 90_000 });

    // 3. Open «ניסיון מקצועי».
    await experienceTab.click();
    await expect(headline).toBeVisible();

    // Field still holds the remembered value; suggestion row is shown under it
    await expect(headline).toHaveValue(remembered);
    const useButton = dialog.getByRole('button', { name: 'להשתמש בזה' });
    await expect(dialog.getByText('בצילום המסך של LinkedIn:').locator('..')).toContainText('Senior Backend Developer');
    await expect(useButton).toBeVisible();

    // 4. Click «להשתמש בזה» in the row under «כותרת התפקיד».
    await useButton.click();
    await expect(headline).toHaveValue(/Senior Backend Developer/);

    // Close the dialog without saving
    await dialog.getByRole('button', { name: 'סגירה' }).click();
    await expect(dialog).toBeHidden();
  });
});

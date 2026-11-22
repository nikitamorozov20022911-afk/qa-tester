import path from 'path';
import { test, expect } from '@playwright/test';

test.use({ storageState: path.join(__dirname, '../../../auth/talent.json') });

test.describe('Talent Edit Profile — saved onboarding data (existing talent, read-only)', () => {
  test('Edit Profile shows saved expertise, desired roles and languages @desktop @prod-safe #ca2463', async ({ page }) => {
    // Open /profile?edit=details
    await page.goto('/profile?edit=details');

    // Tab "פרטים אישיים" (click only if not active)
    const tab = page.getByRole('tab', { name: 'פרטים אישיים' });
    await expect(tab).toBeVisible();
    if ((await tab.getAttribute('aria-selected')) !== 'true') {
      await tab.click();
    }

    // Hidden inputs exist with non-empty values
    for (const name of ['expertise', 'desired_roles', 'languages']) {
      const input = page.locator(`input[name="${name}"]`).first();
      await expect(input).toBeAttached();
      await expect(input).not.toHaveValue('');
    }

    // Each field shows at least one chip (chip remove buttons are labelled "✕ <name>")
    const dialog = page.getByRole('dialog', { name: 'עריכת פרופיל' });
    await expect(dialog.getByRole('button', { name: 'טכנולוגיה, מוצר, דאטה ומערכות מידע' }).first()).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'מפתח/ת Backend' }).first()).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'עברית' }).first()).toBeVisible();
  });
});

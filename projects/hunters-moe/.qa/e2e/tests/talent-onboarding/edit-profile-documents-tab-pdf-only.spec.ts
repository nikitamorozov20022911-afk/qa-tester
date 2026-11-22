// spec: Talent CV upload — #1866b9 «Onboarding מועמד — שלב 4: העלאת CV»
// seed: tests/seed.talent.spec.ts
import path from 'path';
import { test, expect } from '@playwright/test';

test.use({ storageState: path.join(__dirname, '../../../auth/talent.json') });

test.describe('Talent CV upload — #1866b9 «Onboarding מועמד — שלב 4: העלאת CV»', () => {
  test('Edit Profile «מסמכים» tab: CV accepts PDF only @desktop @prod-safe #1866b9', async ({ page }) => {
    // Open /profile?edit=details
    await page.goto('/profile?edit=details');
    const dialog = page.getByRole('dialog');

    // In the «עריכת פרופיל» dialog click the tab «מסמכים»
    const tab = dialog.getByRole('tab', { name: 'מסמכים' });
    await tab.click();

    // Expect tab selected, CV label, and add button or .pdf file name
    await expect(tab).toHaveAttribute('aria-selected', 'true');
    await expect(dialog.getByText('קובץ קו״ח').first()).toBeVisible();
    await expect(
      dialog.getByText('הוספת קובץ').or(dialog.getByText(/\.pdf$/i)).first()
    ).toBeVisible();

    // Expect file input to accept PDF only
    await expect(dialog.locator('input[type=file]')).toHaveAttribute('accept', 'application/pdf');
  });
});

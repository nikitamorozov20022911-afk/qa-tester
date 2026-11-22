// spec: Texts for the right role
// seed: tests/seed.talent.spec.ts
import { test, expect } from '@playwright/test';
import path from 'path';

test.use({ storageState: path.join(__dirname, '../../../auth/talent.json') });

test.describe('Texts for the right role', () => {
  test('Talent profile tab has no headhunter term @desktop @prod-safe #7e0769', async ({ page }) => {
    // Open /profile and read the tab row and the page text
    await page.goto('/profile');

    // Tabs in order
    const tabsNav = page.getByRole('navigation').filter({
      has: page.getByRole('link', { name: 'המועמדויות שלי', exact: true }),
    });
    const tabs = tabsNav.getByRole('link');
    await expect(tabs).toHaveText(['החשבון שלי', 'המועמדויות שלי', 'המנוי שלי', 'הסכמים', 'חשבוניות']);

    // No tab «השת״פים שלי»
    await expect(page.getByRole('link', { name: /השת.{1,2}פים שלי/ })).toHaveCount(0);

    // Page text contains none of the forbidden term variants
    const text = await page.locator('body').innerText();
    expect(text).not.toContain('שת״פ');
    expect(text).not.toContain('שת"פ');
    expect(text).not.toContain('שת”פ');
  });
});

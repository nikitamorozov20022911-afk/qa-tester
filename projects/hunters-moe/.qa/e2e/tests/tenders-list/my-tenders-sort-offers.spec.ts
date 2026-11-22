// spec: .qa/e2e/specs/tenders-list.md
// seed: tests/seed.company_2.spec.ts
import { test, expect } from '@playwright/test';
import path from 'path';

test.use({ storageState: path.join(__dirname, '../../../auth/company_2.json') });

test.describe('«המכרזים שלי» — sort changes the order (#0d978b)', () => {
  test('«המכרזים שלי» — «הכי הרבה הצעות» sorts by number of offers, most first', async ({ page }) => {
    // 1. /tenders -> «המכרזים שלי»
    await page.goto('/tenders');
    await page.getByRole('link', { name: 'המכרזים שלי' }).click();
    await expect(page).toHaveURL(/mine=1/);

    // 2. «מיון לפי» -> «הכי הרבה הצעות»
    const sortButton = page.getByRole('button', { name: /מיון לפי/ });
    await sortButton.click();
    await page.getByRole('option', { name: 'הכי הרבה הצעות' }).click();

    // Expected: URL contains sort=offers; «מס' הצעות» non-increasing
    await expect(page).toHaveURL(/sort=offers/);
    await expect(sortButton).toContainText('הכי הרבה הצעות');

    const cards = page.locator('main li').filter({ has: page.locator('dl') });
    await expect(cards.first()).toBeVisible();
    await expect
      .poll(async () => {
        const values = await cards
          .locator('dl > div')
          .filter({ hasText: /מס׳ הצעות|מס' הצעות/ })
          .locator('dd')
          .allInnerTexts();
        const counts = values.map((v) => Number(v.trim())).filter((n) => !Number.isNaN(n));
        if (counts.length < 2) return 'not-enough-cards';
        return counts.every((v, i) => i === 0 || counts[i - 1] >= v) ? 'ok' : `bad order: ${counts.join(',')}`;
      })
      .toBe('ok');
  });
});

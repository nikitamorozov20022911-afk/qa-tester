// spec: .qa/e2e/specs/tenders-list.md
// seed: tests/seed.company_2.spec.ts
import { test, expect } from '@playwright/test';
import path from 'path';

test.use({ storageState: path.join(__dirname, '../../../auth/company_2.json') });

const toKey = (d: string) => {
  const [dd, mm, yyyy] = d.split('.');
  return Number(`${yyyy}${mm}${dd}`);
};

test.describe('«המכרזים שלי» — sort changes the order (#0d978b)', () => {
  test('«המכרזים שלי» — «תוקף קרוב» sorts by end date, closest first', async ({ page }) => {
    // 1. /tenders -> «המכרזים שלי»
    await page.goto('/tenders');
    await page.getByRole('link', { name: 'המכרזים שלי' }).click();
    await expect(page).toHaveURL(/mine=1/);

    // 2. «מיון לפי» -> «תוקף קרוב»
    const sortButton = page.getByRole('button', { name: /מיון לפי/ });
    await sortButton.click();
    await page.getByRole('option', { name: 'תוקף קרוב' }).click();

    // Expected: URL has mine=1 and sort=deadline; button shows «תוקף קרוב»
    await expect(page).toHaveURL(/mine=1/);
    await expect(page).toHaveURL(/sort=deadline/);
    await expect(sortButton).toContainText('תוקף קרוב');

    // Expected: «תאריך תוקף» non-decreasing
    const cards = page.locator('main li').filter({ has: page.locator('dl') });
    await expect(cards.first()).toBeVisible();
    await expect
      .poll(async () => {
        const values = await cards
          .locator('dl > div')
          .filter({ hasText: 'תאריך תוקף' })
          .locator('dd')
          .allInnerTexts();
        const dates = values.filter((v) => /\d{2}\.\d{2}\.\d{4}/.test(v)).map((v) => toKey(v.trim()));
        if (dates.length < 2) return 'not-enough-cards';
        return dates.every((v, i) => i === 0 || dates[i - 1] <= v) ? 'ok' : `bad order: ${dates.join(',')}`;
      })
      .toBe('ok');
  });
});

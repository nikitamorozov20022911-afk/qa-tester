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
  test('«המכרזים שלי» — «החדשים ביותר» sorts by creation date, newest first', async ({ page }) => {
    // 1. Open /tenders -> tab «המכרזים שלי» (URL ?mine=1)
    await page.goto('/tenders');
    await page.getByRole('link', { name: 'המכרזים שלי' }).click();
    await expect(page).toHaveURL(/mine=1/);
    await expect(page.getByRole('heading', { level: 1, name: 'המכרזים שלי' })).toBeVisible();

    // 2. «מיון לפי» -> «החדשים ביותר» (default)
    const sortButton = page.getByRole('button', { name: /מיון לפי/ });
    await sortButton.click();
    await page.getByRole('option', { name: 'החדשים ביותר' }).click();
    await expect(sortButton).toContainText('החדשים ביותר');

    // Expected: creation dates non-increasing (cards without a date are ignored)
    const cards = page.locator('main li').filter({ has: page.locator('dl') });
    await expect(cards.first()).toBeVisible();
    await expect
      .poll(async () => {
        const texts = await cards.allInnerTexts();
        const dates = texts
          .map((t) => t.match(/·\s*(\d{2}\.\d{2}\.\d{4})/)?.[1])
          .filter((d): d is string => !!d)
          .map(toKey);
        if (dates.length < 2) return 'not-enough-cards';
        return dates.every((v, i) => i === 0 || dates[i - 1] >= v) ? 'ok' : `bad order: ${dates.join(',')}`;
      })
      .toBe('ok');
  });
});

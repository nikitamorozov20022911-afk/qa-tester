// spec: .qa/e2e/specs/tenders-list.md
// seed: tests/seed.company_2.spec.ts
import { test, expect, Page } from '@playwright/test';
import path from 'path';

test.use({ storageState: path.join(__dirname, '../../../auth/company_2.json') });

const toKey = (d: string) => {
  const [dd, mm, yyyy] = d.split('.');
  return Number(`${yyyy}${mm}${dd}`);
};

async function expectDeadlineSorted(page: Page) {
  await expect(page.getByRole('heading', { level: 1, name: 'המכרזים שלי' })).toBeVisible();
  await expect(page.getByRole('button', { name: /מיון לפי/ })).toContainText('תוקף קרוב');
  const cards = page.locator('main li').filter({ has: page.locator('dl') });
  await expect(cards.first()).toBeVisible();
  await expect
    .poll(async () => {
      const values = await cards.locator('dl > div').filter({ hasText: 'תאריך תוקף' }).locator('dd').allInnerTexts();
      const dates = values.filter((v) => /\d{2}\.\d{2}\.\d{4}/.test(v)).map((v) => toKey(v.trim()));
      if (dates.length < 2) return 'not-enough-cards';
      return dates.every((v, i) => i === 0 || dates[i - 1] <= v) ? 'ok' : `bad order: ${dates.join(',')}`;
    })
    .toBe('ok');
}

test.describe('«המכרזים שלי» — sort changes the order (#0d978b)', () => {
  test('«המכרזים שלי» — sort kept after reload and on direct URL', async ({ page }) => {
    // 1. Open /tenders?mine=1&sort=deadline directly
    await page.goto('/tenders?mine=1&sort=deadline');
    await expectDeadlineSorted(page);

    // 2. Reload the page
    await page.reload();
    await expect(page).toHaveURL(/mine=1&sort=deadline|sort=deadline.*mine=1/);
    await expectDeadlineSorted(page);

    // 3. Open /tenders?mine=1&sort=offers directly
    await page.goto('/tenders?mine=1&sort=offers');
    await expect(page.getByRole('heading', { level: 1, name: 'המכרזים שלי' })).toBeVisible();
    await expect(page.getByRole('button', { name: /מיון לפי/ })).toContainText('הכי הרבה הצעות');
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

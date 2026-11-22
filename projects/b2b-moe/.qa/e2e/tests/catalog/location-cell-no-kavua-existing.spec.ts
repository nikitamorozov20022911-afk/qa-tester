// spec: specs/catalog.md §11.1
// seed: tests/seed.admin.spec.ts
import { test, expect, Page } from '@playwright/test';
import * as path from 'path';

test.use({ storageState: path.resolve(__dirname, '../../../auth/admin.json') });

const locButtons = (page: Page) => page.getByRole('button', { name: /^מיקום במחסן — / });
const rowOf = (page: Page, name: string) =>
  page.getByRole('button', { name, exact: true }).locator('xpath=ancestor::*[.//button[@aria-label="פעולות"]][1]');

test.describe('קטלוג — «מיקום במחסן» בלי «קבוע» (#10cc07dc)', () => {
  test('מוצרים עם מקום בעמוד הראשון — אין «קבוע» בעמודת «מיקום במחסן» #10cc07dc @desktop @prod-safe', async ({ page }) => {
    // 1. /catalog, wait for h1 «קטלוג וניהול» and table rows
    await page.goto('/catalog');
    await expect(page.getByRole('heading', { level: 1, name: 'קטלוג וניהול' })).toBeVisible();
    await expect(locButtons(page).first()).toBeVisible({ timeout: 20_000 });

    // 2. Collect all «מיקום במחסן — …» buttons with a place (text is not «ללא מיקום»)
    const collect = async () => {
      const all = await locButtons(page).all();
      const placed: { btn: typeof all[number]; text: string; title: string | null; aria: string }[] = [];
      for (const btn of all) {
        const text = (await btn.innerText()).trim();
        if (text.includes('ללא מיקום')) continue;
        placed.push({
          btn,
          text,
          title: await btn.getAttribute('title'),
          aria: (await btn.getAttribute('aria-label')) ?? '',
        });
      }
      return placed;
    };
    let placed = await collect();
    for (const q of ['נקסט אדג', 'פינלנדיה']) {
      if (placed.length) break;
      const search = page.getByRole('searchbox').or(page.getByPlaceholder(/חיפוש/)).first();
      await search.fill(q);
      await page.waitForTimeout(1000);
      placed = await collect();
    }
    test.skip(placed.length === 0, 'нет товаров с местом');

    // 3. For each: read innerText, title, aria-name
    for (const item of placed) {
      const aria = (await item.btn.getAttribute('aria-label')) ?? item.aria;
      expect(item.text).not.toContain('קבוע');
      expect(item.title ?? '').not.toContain('קבוע');
      expect(aria).not.toContain('קבוע');
      expect(item.text).toMatch(/[A-Z]+\d*-\d+/);

      const productName = aria.replace(/^מיקום במחסן — /, '');
      const row = rowOf(page, productName);
      if (await row.count()) {
        await expect(row.first().getByText('קבוע', { exact: true })).toHaveCount(0);
      }
    }
  });
});

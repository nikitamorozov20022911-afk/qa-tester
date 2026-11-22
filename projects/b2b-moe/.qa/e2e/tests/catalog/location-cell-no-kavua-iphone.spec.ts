// spec: specs/catalog.md §11.3
// seed: tests/seed.admin.spec.ts
import { test, expect, Page } from '@playwright/test';
import * as path from 'path';

test.use({ storageState: path.resolve(__dirname, '../../../auth/admin.json') });

const locButtons = (page: Page) => page.getByRole('button', { name: /^מיקום במחסן — / });

test.describe('קטלוג — «מיקום במחסן» בלי «קבוע» בטלפון (#10cc07dc)', () => {
  test('iPhone 375 — עמודת «מיקום במחסן» בלי «קבוע», טבלה נגללת בתוכה #10cc07dc @iphone @prod-safe', async ({ page }) => {
    // 1. /catalog
    await page.goto('/catalog');
    await expect(page.getByRole('heading', { level: 1, name: 'קטלוג וניהול' })).toBeVisible({ timeout: 30_000 });
    await expect(locButtons(page).first()).toBeAttached({ timeout: 30_000 });

    // 2. Buttons with a place (up to 5)
    const placed: { text: string; title: string | null; aria: string; idx: number }[] = [];
    const all = await locButtons(page).all();
    for (let i = 0; i < all.length && placed.length < 5; i++) {
      const text = (await all[i].innerText()).trim();
      if (text.includes('ללא מיקום')) continue;
      placed.push({ text, title: await all[i].getAttribute('title'), aria: (await all[i].getAttribute('aria-label')) ?? '', idx: i });
    }
    test.skip(placed.length === 0, 'нет товаров с местом на первой странице');

    await locButtons(page).nth(placed[0].idx).scrollIntoViewIfNeeded();

    // 3. No «קבוע» in text / title / aria-name
    for (const item of placed) {
      expect(item.text).not.toContain('קבוע');
      expect(item.title ?? '').not.toContain('קבוע');
      expect(item.aria).not.toContain('קבוע');
      expect(item.text).toMatch(/[A-Z]+\d*-\d+/);
    }

    // 4. Horizontal scroll only inside the table, not the document
    const { scrollWidth, innerWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
    }));
    expect(scrollWidth).toBeLessThanOrEqual(innerWidth + 1);
  });
});

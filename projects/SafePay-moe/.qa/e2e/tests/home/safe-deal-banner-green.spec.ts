// spec: specs/home.md
// seed: tests/seed.provider.spec.ts
import { test, expect } from '@playwright/test';
import * as path from 'path';

test.use({ storageState: path.resolve(__dirname, '../../../auth/provider.json') });

test.describe('מסך הבית — "פתיחת עסקה בטוחה" בירוק', () => {
  test('פס "פתיחת עסקה בטוחה" ירוק (#28784B) מתחת לכרטיס היתרה @iphone @prod-safe (#9a140d)', async ({ page }) => {
    // 1. /wallet, לחכות ל"היתרה שלך"
    await page.goto('/wallet');
    const balanceLabel = page.getByText('היתרה שלך').first();
    await expect(balanceLabel).toBeVisible();

    // 2. לקחת את הפס safe-deal-highlight (אם הרקע על אלמנט פנימי — הראשון עם background-color אטום)
    const banner = page.getByTestId('safe-deal-highlight');
    await expect(banner).toBeVisible();

    // 3. getComputedStyle(el).backgroundColor — לפס ולכרטיס היתרה
    const isOpaque = (c: string) => c !== 'transparent' && !/^rgba\(\s*\d+,\s*\d+,\s*\d+,\s*0\s*\)$/.test(c);
    const bannerBg = await banner.evaluate((el, src) => {
      const opaque = new Function('c', `return (${src})(c)`) as (c: string) => boolean;
      const nodes = [el, ...Array.from(el.querySelectorAll('*'))];
      for (const n of nodes) {
        const c = getComputedStyle(n).backgroundColor;
        if (opaque(c)) return c;
      }
      return getComputedStyle(el).backgroundColor;
    }, isOpaque.toString());

    const balanceBg = await balanceLabel.evaluate((el, src) => {
      const opaque = new Function('c', `return (${src})(c)`) as (c: string) => boolean;
      let n: Element | null = el;
      while (n) {
        const c = getComputedStyle(n).backgroundColor;
        if (opaque(c)) return c;
        n = n.parentElement;
      }
      return getComputedStyle(document.body).backgroundColor;
    }, isOpaque.toString());

    // הרקע של הפס rgb(40, 120, 75) (#28784B)
    expect(bannerBg).toBe('rgb(40, 120, 75)');
    // הרקע שונה מהרקע של כרטיס היתרה/הכותרת
    expect(bannerBg).not.toBe(balanceBg);

    // הפס עדיין בין כרטיס היתרה לפעולות המהירות, והטקסט נראה
    await expect(banner.getByText('פתיחת עסקה בטוחה')).toBeVisible();
    const balanceBox = await balanceLabel.boundingBox();
    const bannerBox = await banner.boundingBox();
    const quickBox = await page.getByText('טעינת כסף').first().boundingBox();
    expect(balanceBox && bannerBox && quickBox).toBeTruthy();
    expect(bannerBox!.y).toBeGreaterThanOrEqual(balanceBox!.y);
    expect(bannerBox!.y + bannerBox!.height).toBeLessThanOrEqual(quickBox!.y);
  });
});

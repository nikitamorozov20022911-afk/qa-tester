// spec: .qa/e2e/specs/submit-panel.md
// seed: tests/seed.hunter_free_2.spec.ts
import { test, expect } from '@playwright/test';
import path from 'path';

test.use({ storageState: path.join(__dirname, '../../auth/hunter_free_2.json') });

test.describe('Job panel — headhunter on a foreign job', () => {
  test('Job side panel: heading «הגשת מועמד/ת» and search «חיפוש מועמד/ת»', { tag: ['@desktop', '@prod-safe'] }, async ({ page }) => {
    // 1. Find a foreign job (J-148, fallback: first foreign job in /collaborations); wait for the dialog «פרטי המשרה».
    const dialog = page.getByRole('dialog');
    await page.goto('/collaborations/fedc4b3d-3de6-414e-9821-af96a34469ae');
    let opened = await dialog.getByRole('heading', { name: 'פרטי המשרה' }).waitFor({ timeout: 15000 }).then(() => true, () => false);

    if (!opened) {
      await page.goto('/collaborations');
      const cards = page.getByRole('article');
      await cards.first().waitFor({ timeout: 15000 }).catch(() => {});
      const count = await cards.count();
      for (let i = 0; i < count && !opened; i++) {
        await cards.nth(i).click();
        await dialog.getByRole('heading', { name: 'פרטי המשרה' }).waitFor({ timeout: 10000 }).catch(() => {});
        if (await dialog.getByRole('searchbox').count() > 0) {
          opened = true;
        } else {
          await page.keyboard.press('Escape');
          await expect(dialog).toHaveCount(0);
        }
      }
    }
    test.skip(!opened, '8ad3b0: no foreign active job on the stand (J-148 deleted, /collaborations has none) — publish a job as demo-company-1 and rerun');

    // 2. Read the side-block heading and the search field.
    await expect(dialog.getByRole('heading', { level: 3, name: 'הגשת מועמד/ת' })).toBeVisible();
    await expect(dialog.getByRole('heading', { name: 'הגשת מועמד', exact: true })).toHaveCount(0);

    const search = dialog.getByRole('searchbox');
    await expect(search).toHaveAttribute('placeholder', 'חיפוש מועמד/ת');
    await expect(search).toHaveAttribute('aria-label', 'חיפוש מועמד/ת');
  });
});

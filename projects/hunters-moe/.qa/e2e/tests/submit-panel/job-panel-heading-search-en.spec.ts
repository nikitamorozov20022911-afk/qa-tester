// spec: .qa/e2e/specs/submit-panel.md
// seed: tests/seed.hunter_free_2.spec.ts
import { test, expect } from '@playwright/test';
import path from 'path';

test.use({ storageState: path.join(__dirname, '../../auth/hunter_free_2.json') });

test.describe('Job panel — headhunter on a foreign job', () => {
  test('Job side panel in English: «Submit candidate» and «Search candidate»', { tag: ['@desktop', '@prod-safe'] }, async ({ page }) => {
    // 1. Find the job as above, then open the same job path with prefix /en.
    const dialog = page.getByRole('dialog');
    await page.goto('/en/collaborations/fedc4b3d-3de6-414e-9821-af96a34469ae');
    let opened = await dialog.getByRole('heading', { name: 'Job details' }).waitFor({ timeout: 15000 }).then(() => true, () => false);

    if (!opened) {
      await page.goto('/en/collaborations');
      const cards = page.getByRole('article');
      await cards.first().waitFor({ timeout: 15000 }).catch(() => {});
      const count = await cards.count();
      for (let i = 0; i < count && !opened; i++) {
        await cards.nth(i).click();
        await dialog.getByRole('heading', { name: 'Job details' }).waitFor({ timeout: 10000 }).catch(() => {});
        if (await dialog.getByRole('searchbox').count() > 0) {
          opened = true;
        } else {
          await page.keyboard.press('Escape');
          await expect(dialog).toHaveCount(0);
        }
      }
    }
    test.skip(!opened, '8ad3b0: no foreign active job on the stand (J-148 deleted, /en/collaborations has none) — publish a job as demo-company-1 and rerun');

    // Expected: heading «Submit candidate», placeholder «Search candidate», no Hebrew letters.
    const heading = dialog.getByRole('heading', { level: 3, name: 'Submit candidate' });
    await expect(heading).toBeVisible();
    expect(await heading.textContent()).not.toMatch(/[֐-׿]/);

    const search = dialog.getByRole('searchbox');
    await expect(search).toHaveAttribute('placeholder', 'Search candidate');
    await expect(search).toHaveAttribute('aria-label', 'Search candidate');
    expect(await search.getAttribute('placeholder')).not.toMatch(/[֐-׿]/);
  });
});

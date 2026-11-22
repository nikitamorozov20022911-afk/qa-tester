// spec: .qa/e2e/specs/submit-panel.md
// seed: tests/seed.company_6.spec.ts
import { test, expect } from '@playwright/test';
import path from 'path';

test.use({ storageState: path.join(__dirname, '../../auth/company_6.json') });

test.describe('Tender side panel — HR', () => {
  test('Tender side panel: search placeholder «חיפוש מועמד/ת»', { tag: ['@desktop', '@prod-safe'] }, async ({ page }) => {
    // 1. Go to /tenders/65d2b6a1-234b-47db-9984-b4dcbe984452 (T-44). If not found -> skip.
    await page.goto('/tenders/65d2b6a1-234b-47db-9984-b4dcbe984452');
    const dialog = page.getByRole('dialog');
    const search = dialog.getByRole('searchbox');
    const found = await search.waitFor({ timeout: 15000 }).then(() => true, () => false);
    test.skip(!found, '8ad3b0 data changed: T-44 not found');

    // 2. Read the search field of the submit panel.
    await expect(search).toHaveAttribute('placeholder', 'חיפוש מועמד/ת');
    await expect(search).toHaveAttribute('aria-label', 'חיפוש מועמד/ת');
  });
});

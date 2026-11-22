// spec: .qa/e2e/specs/candidate-badge.md
// seed: tests/seed.hunter_plus.spec.ts
import { test, expect } from '@playwright/test';
import path from 'path';

test.use({ storageState: path.join(__dirname, '../../auth/hunter_plus.json') });

test.describe("Headhunter's own candidate page (#416558)", () => {
  test('/my-candidates/<id> shows the badge «מועמד/ת», no masculine-only «מועמד»', { tag: ['@desktop', '@prod-safe'] }, async ({ page }) => {
    // 1. Go to /my-candidates/3342cb1e-2c63-4959-ba77-db9437b4569f («רון QA2810y»).
    await page.goto('/my-candidates/3342cb1e-2c63-4959-ba77-db9437b4569f');

    // Data guard: page not found / no candidate header
    const heading = page.getByRole('heading', { name: 'רון QA2810y', level: 1 });
    const notFound = page.getByText('אופס, הדף לא נמצא');

    // 2. Wait for the candidate heading «רון QA2810y».
    await expect(heading.or(notFound).first()).toBeVisible();
    test.skip(await notFound.isVisible(), '416558 data changed: 3342cb1e-2c63-4959-ba77-db9437b4569f not found');
    await expect(heading).toBeVisible();

    // Expected: «מועמד/ת» (exact) is visible in the header
    await expect(page.getByText('מועמד/ת', { exact: true })).toBeVisible();

    // Expected: no element with exact text «מועמד»
    await expect(page.getByText('מועמד', { exact: true })).toHaveCount(0);
  });
});

// spec: .qa/e2e/specs/candidate-badge.md
// seed: tests/seed.company.spec.ts
import { test, expect } from '@playwright/test';
import path from 'path';

test.use({ storageState: path.join(__dirname, '../../auth/company.json') });

const APPLICATION_ID = '8f88518a-a6fc-4b25-a8f6-8a824868262a';
const TITLE = 'QA-AUTO 1020 E1 Bravo';

test.describe("Owner's full-profile submission page (#f2c5ce)", () => {
  test("Owner's full-profile page shows the badge «מועמד/ת» and neutral candidate labels", { tag: ['@desktop', '@prod-safe'] }, async ({ page }) => {
    const cases = [
      { prefix: '', badge: 'מועמד/ת' },
      { prefix: '/en', badge: 'Candidate' },
      { prefix: '/ru', badge: 'Кандидат' },
      { prefix: '/ar', badge: 'مرشح' },
    ];

    for (const { prefix, badge } of cases) {
      // 1-2. Go to /applications/<id> (he, then /en, /ru, /ar) and read the badge.
      await page.goto(`${prefix}/applications/${APPLICATION_ID}`);

      // Data guard: page not found / no submission header
      const heading = page.getByRole('heading', { name: TITLE, level: 1 });
      const notFound = page.getByText('אופס, הדף לא נמצא');
      await expect(heading.or(notFound).first()).toBeVisible();
      test.skip(await notFound.isVisible(), `f2c5ce data changed: ${APPLICATION_ID} not found`);
      await expect(heading).toBeVisible();

      // Expected: localized badge visible (exact)
      await expect(page.getByText(badge, { exact: true }).first()).toBeVisible();

      // Expected: no masculine-only «מועמד»
      await expect(page.getByText('מועמד', { exact: true })).toHaveCount(0);
    }
  });
});

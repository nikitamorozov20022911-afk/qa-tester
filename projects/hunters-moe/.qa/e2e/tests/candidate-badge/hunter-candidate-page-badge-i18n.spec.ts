// spec: .qa/e2e/specs/candidate-badge.md
// seed: tests/seed.hunter_plus.spec.ts
import { test, expect } from '@playwright/test';
import path from 'path';

test.use({ storageState: path.join(__dirname, '../../auth/hunter_plus.json') });

const CANDIDATE_ID = '3342cb1e-2c63-4959-ba77-db9437b4569f';

test.describe("Headhunter's own candidate page (#416558)", () => {
  test('Badge in en/ru/ar stays «Candidate» / «Кандидат» / «مرشح»', { tag: ['@desktop', '@prod-safe'] }, async ({ page }) => {
    const cases = [
      { prefix: '/en', badge: 'Candidate' },
      { prefix: '/ru', badge: 'Кандидат' },
      { prefix: '/ar', badge: 'مرشح' },
    ];

    for (const { prefix, badge } of cases) {
      // 1. For each of /en, /ru, /ar: go to <prefix>/my-candidates/<id>; wait for the candidate heading.
      await page.goto(`${prefix}/my-candidates/${CANDIDATE_ID}`);

      // Data guard: page not found / no candidate header
      const heading = page.getByRole('heading', { name: 'רון QA2810y', level: 1 });
      const notFound = page.getByText('אופס, הדף לא נמצא');
      await expect(heading.or(notFound).first()).toBeVisible();
      test.skip(await notFound.isVisible(), `416558 data changed: ${CANDIDATE_ID} not found`);
      await expect(heading).toBeVisible();

      // Expected: localized badge visible (exact)
      await expect(page.getByText(badge, { exact: true })).toBeVisible();

      // Expected: no Hebrew masculine-only «מועמד» on the page
      await expect(page.getByText('מועמד', { exact: true })).toHaveCount(0);
    }
  });
});

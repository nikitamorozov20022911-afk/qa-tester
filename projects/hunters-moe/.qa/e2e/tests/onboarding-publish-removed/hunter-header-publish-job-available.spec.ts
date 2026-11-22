// spec: specs/plan.md
// seed: tests/seed.hunter_plus.spec.ts

import path from 'path';
import { test, expect } from '@playwright/test';

test.use({ storageState: path.join(__dirname, '../../../auth/hunter_plus.json') });

test.describe('Job publishing stays in normal navigation (existing approved hunter, read-only)', () => {
  test('Header «+ פרסום» leads to the job publish form @desktop @prod-safe #9a6101 #9a6103', async ({ page }) => {
    // 1. Open /collaborations
    await page.goto('/collaborations');

    const publishButton = page.getByRole('button', { name: '+ פרסום' });
    await expect(publishButton).toBeVisible();

    // 2. Click «+ פרסום» in the header
    await publishButton.click();

    const jobItem = page.getByRole('menuitem', { name: /פרסום משרה/ });
    await expect(jobItem).toBeVisible();

    // 3. Click «פרסום משרה» in the menu
    await jobItem.click();

    await expect(page).toHaveURL(/\/publish\/job/);
    await expect(page).not.toHaveURL(/\/onboarding/);
    await expect(page.getByRole('heading', { level: 1, name: 'פרסום משרה' })).toBeVisible();
    await expect(page.getByText('שלב 1 מתוך 2')).toBeVisible();
  });
});

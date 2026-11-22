// spec: .qa/e2e/specs/submit-candidate.md
// seed: tests/seed.hunter_plus.spec.ts
import { test, expect } from '@playwright/test';
import path from 'path';
import { norm } from '../_helpers/i18n';

test.use({ storageState: path.join(__dirname, '../../../auth/hunter_plus.json') });

test.describe('Submit window — neutral candidate wording (#f2c5ce)', () => {
  test('Headhunter submit window on a job, anonymous: neutral wording, nothing submitted', { tag: ['@desktop', '@prod-safe'] }, async ({ page }) => {
    // 1. Open job J-148; if not found -> skip.
    await page.goto('/collaborations/fedc4b3d-3de6-414e-9821-af96a34469ae');
    const existingBtn = page.getByRole('button', { name: 'מועמד/ת קיים/ת' });
    const found = await existingBtn.waitFor({ timeout: 15000 }).then(() => true, () => false);
    test.skip(!found, 'f2c5ce data changed: J-148 not found');

    // 2. Click «מועמד/ת קיים/ת»; search «QA-AUTO»; click «הגשה» on the first row.
    await existingBtn.click();
    const picker = page.getByRole('dialog', { name: 'מועמד/ת קיים/ת' });
    await picker.getByRole('searchbox', { name: 'חיפוש מועמד/ת' }).fill('QA-AUTO');
    const firstRow = picker.getByRole('listitem').first();
    const hasRow = await firstRow.waitFor({ timeout: 5000 }).then(() => true, () => false);
    test.skip(!hasRow, 'f2c5ce: no unsubmitted QA-AUTO candidate for this job');
    await firstRow.getByRole('button').click();

    // 3. Step 1: choose anonymous profile and no NDA; «המשך». Read step 2.
    const submit = page.getByRole('dialog').filter({ has: page.getByRole('heading', { name: 'האם להגיש פרופיל מלא או אנונימי?' }) });
    await expect(submit).toBeVisible();
    await submit.getByText('פרופיל אנונימי', { exact: true }).click();
    await submit.getByText('אין צורך ב-NDA', { exact: true }).click();
    await submit.getByRole('button', { name: 'המשך' }).click();

    const step2 = page.getByRole('dialog').filter({ has: page.getByRole('heading', { name: /^הגשת מועמד\/ת:/ }) });
    await expect(step2.getByRole('heading', { name: /^הגשת מועמד\/ת: / })).toBeVisible();
    await expect(step2.getByRole('heading', { name: 'סטטוס מועמד/ת' })).toBeVisible();
    await expect(step2.getByRole('textbox', { name: 'תקציר המועמד/ת' })).toBeVisible();
    // innerText excludes textbox values (AI-generated text varies)
    const text = norm(await step2.innerText());
    expect(text).toContain('הגשת מועמד/ת:');
    expect(text).toContain('הגשה דיסקרטית');
    expect(text).toContain('ללא הפרטים האישיים של המועמד/ת');
    expect(text).toContain('תקציר המועמד/ת');
    expect(text).toContain('סטטוס מועמד/ת');
    expect(text).not.toMatch(/המועמד(?!\/ת)/);
    expect(text).not.toMatch(/הגשת מועמד(?!\/ת)/);
    expect(text).not.toMatch(/סטטוס מועמד(?!\/ת)/);

    // 4. Close the window without «סיום והגשה» (never pressed)
    await page.keyboard.press('Escape');
    await expect(step2).toHaveCount(0);
  });
});

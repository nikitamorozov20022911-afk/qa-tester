// spec: .qa/e2e/specs/submit-candidate.md
// seed: tests/seed.company_6.spec.ts
import { test, expect } from '@playwright/test';
import path from 'path';
import { norm } from '../_helpers/i18n';

test.use({ storageState: path.join(__dirname, '../../auth/company_6.json') });

test.describe('Submit window — neutral candidate wording (#f2c5ce)', () => {
  test('HR tender submit window, full profile: all candidate strings are neutral', { tag: ['@desktop', '@prod-safe'] }, async ({ page }) => {
    // 1. Go to /tenders/65d2b6a1-234b-47db-9984-b4dcbe984452 (T-44); if not found -> skip.
    await page.goto('/tenders/65d2b6a1-234b-47db-9984-b4dcbe984452');
    const panel = page.getByRole('dialog', { name: 'פרטי המכרז' });
    const row = panel.getByRole('button', { name: 'הגשת מיכל לוי למכרז' });
    const found = await row.waitFor({ timeout: 15000 }).then(() => true, () => false);
    test.skip(!found, 'f2c5ce data changed: T-44 not found');

    // 2. Click «הגשה» of the first candidate (מיכל לוי). Step 1: read the option cards; choose full profile; «המשך».
    await row.click();
    const submit = page.getByRole('dialog').filter({ has: page.getByRole('heading', { name: 'האם להגיש פרופיל מלא או אנונימי?' }) });
    await expect(submit).toBeVisible();
    const step1 = norm(await submit.innerText());
    expect(step1).toContain('המועמד/ת');
    expect(step1).not.toMatch(/המועמד(?!\/ת)/);
    await submit.getByText('פרופיל מלא', { exact: true }).click();
    await submit.getByRole('button', { name: 'המשך' }).click();

    // 3. Step 2: read the dialog; close without submitting.
    const step2 = page.getByRole('dialog').filter({ has: page.getByRole('heading', { name: /^הגשת מועמד\/ת:/ }) });
    await expect(step2.getByRole('heading', { name: /^הגשת מועמד\/ת: / })).toBeVisible();
    await expect(step2.getByRole('heading', { name: 'סטטוס מועמד/ת' })).toBeVisible();
    await expect(step2.getByRole('textbox', { name: 'תקציר המועמד/ת' })).toBeVisible();
    // innerText excludes textbox values (AI-generated text is user data)
    const text = norm(await step2.innerText());
    expect(text).toContain('הגשת מועמד/ת:');
    expect(text).toContain('תקציר המועמד/ת');
    expect(text).toContain('סטטוס מועמד/ת');
    expect(text).not.toMatch(/המועמד(?!\/ת)/);
    expect(text).not.toMatch(/הגשת מועמד(?!\/ת)/);
    expect(text).not.toMatch(/סטטוס מועמד(?!\/ת)/);

    // Close without the final «סיום והגשה» (never pressed)
    await page.keyboard.press('Escape');
    await expect(step2).toHaveCount(0);
    await expect(submit).toHaveCount(0);
  });
});

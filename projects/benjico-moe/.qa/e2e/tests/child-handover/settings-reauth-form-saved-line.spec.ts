// spec: specs/child-handover.md
// seed: tests/seed.parent.spec.ts
import { test, expect, Page } from '@playwright/test';
import * as path from 'path';

test.use({ storageState: path.resolve(__dirname, '../../../auth/parent.json') });

const visible = (page: Page, text: string | RegExp) => page.getByText(text, { exact: typeof text === 'string' }).filter({ visible: true });

async function expectReauthDialog(page: Page, intro: string) {
  await expect(visible(page, 'אימות זהות').first()).toBeVisible();
  await expect(visible(page, intro).first()).toBeVisible();
  await expect(page.locator('input[type=password]').filter({ visible: true })).toHaveCount(1);
  await expect(visible(page, 'סיסמה').first()).toBeVisible();
  await expect(visible(page, 'שכחתי סיסמה').first()).toBeVisible();
  await expect(page.getByRole('button', { name: 'אישור', exact: true }).filter({ visible: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'ביטול', exact: true }).filter({ visible: true })).toBeVisible();
  await expect(visible(page, 'מה שכבר מילאתם בטופס נשמר').first()).toBeVisible();
}

test.describe('Режим родителя: контроль данных и окна «אימות זהות» над формами (#a1f2c1, #ee2f5b)', () => {
  test('7.2 /settings: окна «אימות זהות» смены email и пароля — строка «מה שכבר מילאתם בטופס נשמר» и «שכחתי סיסמה» на месте (без ввода) @desktop @prod-safe #ee2f5b', async ({ page }) => {
    // 1. Открыть /settings
    await page.goto('/settings');
    const emailValue = page.getByText('אימייל (שם משתמש)', { exact: true }).filter({ visible: true }).first().locator('xpath=following-sibling::*[1]');
    await expect(emailValue).toBeVisible();
    const emailBefore = await emailValue.innerText();

    // 2. В строке «אימייל (שם משתמש)» нажать «שינוי»
    await page.getByRole('button', { name: 'שינוי אימייל (שם משתמש)' }).filter({ visible: true }).click();
    await expectReauthDialog(page, 'כדי לשנות את האימייל, הזינו שוב את סיסמת החשבון.');

    // 3. Ничего не вводить; «ביטול»
    await page.getByRole('button', { name: 'ביטול', exact: true }).filter({ visible: true }).click();
    await expect(visible(page, 'אימות זהות')).toHaveCount(0);
    await expect(page).toHaveURL(/\/settings(?:[?#]|$)/);
    await expect(emailValue).toHaveText(emailBefore);

    // 4. В строке «סיסמה» нажать «שינוי»; проверить окно как в шаге 2; «ביטול»
    await page.getByRole('button', { name: 'שינוי סיסמה' }).filter({ visible: true }).click();
    await expectReauthDialog(page, 'כדי לשנות את הסיסמה, הזינו שוב את סיסמת החשבון.');
    await page.getByRole('button', { name: 'ביטול', exact: true }).filter({ visible: true }).click();
    await expect(visible(page, 'אימות זהות')).toHaveCount(0);
    await expect(page).toHaveURL(/\/settings(?:[?#]|$)/);
    await expect(emailValue).toHaveText(emailBefore);
  });
});

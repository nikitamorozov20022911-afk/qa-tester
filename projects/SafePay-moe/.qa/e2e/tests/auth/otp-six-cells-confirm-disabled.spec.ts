// spec: .qa/e2e/specs/auth.md
// seed: .qa/e2e/tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('קוד אימות — 6 תאים ומילוי אוטומטי', () => {
  test('מסך "שלחנו לכם קוד אימות": 6 תאים, "אישור" מושבת עד קוד מלא @iphone @prod-safe (#005602)', async ({ page }) => {
    const phone = process.env.QA_USER_CLIENT2_PHONE;
    test.skip(!phone, 'QA_USER_CLIENT2_PHONE is not set in .qa/accounts.env');

    // 1. Гостем `/` → дождаться экрана входа (после заставки).
    await page.goto('/phone');
    const phoneInput = page.getByTestId('phone-input');
    await expect(phoneInput).toBeVisible();

    // 2. В поле телефона ввести тестовый номер → «שלחו לי קוד אימות».
    await phoneInput.fill(phone!);
    await page.getByText('שלחו לי קוד אימות').click();

    // 3. Дождаться экрана «שלחנו לכם קוד אימות».
    await expect(page).toHaveURL(/\/otp/);
    await expect(page.getByText('שלחנו לכם קוד אימות', { exact: true })).toBeVisible();

    // 4. Ввести 5 цифр «12345» (в поле кода, ячейки заполняются автоматически).
    const otpInput = page.getByTestId('otp-input');
    await otpInput.pressSequentially('12345');

    // 5. Проверить состояние «אישור». Не вводить 6-ю цифру и не нажимать «אישור».
    await expect(page.locator('[data-testid^="otp-box-"]')).toHaveCount(6);
    for (const [i, digit] of ['1', '2', '3', '4', '5'].entries()) {
      await expect(page.getByTestId(`otp-box-${i}`)).toHaveText(digit);
    }
    await expect(page.getByRole('button', { name: 'אישור', exact: true })).toBeDisabled();
  });
});

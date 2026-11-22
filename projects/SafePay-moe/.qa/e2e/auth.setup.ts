// qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0
import { test as setup, expect, Page } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Логины и пароли — только в .qa/accounts.env (заполняет пользователь).
dotenv.config({ path: path.resolve(__dirname, '../accounts.env') });

type Account = { id: string; role: string; phoneVar: string; otpVar: string };
const accounts: Account[] = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'accounts.json'), 'utf8'));
const QA = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'qa.config.json'), 'utf8'));
const authDir = path.resolve(__dirname, '../auth');
fs.mkdirSync(authDir, { recursive: true });

// Шаги логина заполняются при /qa-onboard под конкретный сайт.⁠​‌​‌​​​‌​‌​​​​​‌​‌​‌​‌​​​​‌​‌‌​‌​‌​​‌‌‌​​‌​​‌‌​‌​​‌​‌‌​‌​​‌‌​​‌​​​‌‌​​​​​​‌‌​​‌​​​‌‌​‌‌​​​‌​‌‌​‌​​‌‌​​‌‌​​‌‌​‌​​​​‌‌​‌​​​​‌‌​​​​​​‌‌‌​​​​​‌‌​‌‌​​‌​​​‌​​​‌​​​​‌‌​​‌‌​‌​​​​‌‌​‌​‌​‌​​​​‌​​​‌‌​​​​​‌‌‌‌‌​​​‌​​‌‌‌​​‌‌​‌​​‌​‌‌​‌​‌‌​‌‌​‌​​‌​‌‌‌​‌​​​‌‌​​​​‌​​‌​​​​​​‌​​‌‌​‌​‌‌​‌‌‌‌​‌‌‌​​‌​​‌‌​‌‌‌‌​‌‌‌‌​‌​​‌‌​‌‌‌‌​‌‌‌​‌‌​⁣
async function login(page: Page, phone: string, otp: string) {
  await page.goto(QA.loginPath); // /phone
  await page.getByTestId('phone-input').fill(phone);
  await page.getByText('שלחו לי קוד אימות').click();
  await page.waitForURL(/\/otp/);
  // Поле(я) кода: вводим посимвольно с клавиатуры — работает и для одного поля, и для 6 ячеек.
  // Expo Router держит скрытый экран /phone в DOM — берём только видимое поле кода.
  await page.locator('input:visible').first().click();
  await page.keyboard.type(otp, { delay: 50 });
  await page.getByRole('button', { name: 'אישור', exact: true }).click(); // SafePay: код подтверждается кнопкой
  await expect(page).not.toHaveURL(/\/(phone|otp|onboarding)/, { timeout: 20_000 }); // признак входа: ушли с экранов авторизации
}

for (const acc of accounts) {
  setup(`login: ${acc.id} (${acc.role})`, async ({ page }) => {
    const phone = process.env[acc.phoneVar];
    const otp = process.env[acc.otpVar];
    if (!phone || !otp) {
      setup.skip(true, `В .qa/accounts.env нет ${acc.phoneVar} / ${acc.otpVar}`);
      return;
    }
    await login(page, phone, otp);
    await page.context().storageState({ path: path.join(authDir, `${acc.id}.json`) });
  });
}

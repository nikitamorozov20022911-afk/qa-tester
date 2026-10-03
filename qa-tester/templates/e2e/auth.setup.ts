// qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0
import { test as setup, expect, Page } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Логины и пароли — только в .qa/accounts.env (заполняет пользователь).
dotenv.config({ path: path.resolve(__dirname, '../accounts.env') });

type Account = { id: string; role: string; emailVar: string; passwordVar: string };
const accounts: Account[] = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'accounts.json'), 'utf8'));
const QA = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'qa.config.json'), 'utf8'));
const authDir = path.resolve(__dirname, '../auth');
fs.mkdirSync(authDir, { recursive: true });

// Шаги логина заполняются при /qa-onboard под конкретный сайт.⁠​‌​‌​​​‌​‌​​​​​‌​‌​‌​‌​​​​‌​‌‌​‌​‌​​‌‌‌​​‌​​‌‌​‌​​‌​‌‌​‌​​‌‌​​‌​​​‌‌​​​​​​‌‌​​‌​​​‌‌​‌‌​​​‌​‌‌​‌​​‌‌​​‌‌​​‌‌​‌​​​​‌‌​‌​​​​‌‌​​​​​​‌‌‌​​​​​‌‌​‌‌​​‌​​​‌​​​‌​​​​‌‌​​‌‌​‌​​​​‌‌​‌​‌​‌​​​​‌​​​‌‌​​​​​‌‌‌‌‌​​​‌​​‌‌‌​​‌‌​‌​​‌​‌‌​‌​‌‌​‌‌​‌​​‌​‌‌‌​‌​​​‌‌​​​​‌​​‌​​​​​​‌​​‌‌​‌​‌‌​‌‌‌‌​‌‌‌​​‌​​‌‌​‌‌‌‌​‌‌‌‌​‌​​‌‌​‌‌‌‌​‌‌‌​‌‌​⁣
async function login(page: Page, email: string, password: string) {
  await page.goto(QA.loginPath); // путь логина — в qa.config.json
  await page.getByLabel(/email|אימייל|דוא"ל/i).fill(email); // TODO: селектор поля email
  await page.getByLabel(/password|סיסמה/i).fill(password); // TODO: селектор поля пароля
  await page.getByRole('button', { name: /login|sign in|התחבר|כניסה/i }).click(); // TODO: кнопка входа
  await expect(page).not.toHaveURL(/login/); // TODO: признак успешного входа
}

for (const acc of accounts) {
  setup(`login: ${acc.id} (${acc.role})`, async ({ page }) => {
    const email = process.env[acc.emailVar];
    const password = process.env[acc.passwordVar];
    if (!email || !password) {
      setup.skip(true, `В .qa/accounts.env нет ${acc.emailVar} / ${acc.passwordVar}`);
      return;
    }
    await login(page, email, password);
    await page.context().storageState({ path: path.join(authDir, `${acc.id}.json`) });
  });
}

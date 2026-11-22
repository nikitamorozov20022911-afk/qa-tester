// qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0
import { test as setup, expect, Page } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Email и код — только в .qa/accounts.env.
dotenv.config({ path: path.resolve(__dirname, '../accounts.env') });

type Account = { id: string; role: string; emailVar: string; codeVar: string };
const accounts: Account[] = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'accounts.json'), 'utf8'));
const QA = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'qa.config.json'), 'utf8'));
const authDir = path.resolve(__dirname, '../auth');
fs.mkdirSync(authDir, { recursive: true });

// BabySit (Expo web + Supabase): /sign-in → email → «Send code» → /email-code → 6 цифр (автоотправка) → /home.
// Селекторы не зависят от языка интерфейса (he/en): тип поля, autocomplete, URL.
// Сервер «засыпает» — первый запрос после простоя может висеть, поэтому таймауты длинные.
async function login(page: Page, email: string, code: string) {
  await page.goto(QA.loginPath);
  const emailInput = page.locator('input[type="email"]');
  await emailInput.waitFor({ timeout: 60_000 });
  await emailInput.fill(email);
  await emailInput.press('Enter').catch(() => {});
  if (!/email-code/.test(page.url())) {
    await page.getByRole('button', { name: /send code|שליחת קוד|שלח קוד/i }).last().click().catch(() => {});
  }
  await page.waitForURL(/email-code/, { timeout: 60_000 });
  await page.locator('input[autocomplete="one-time-code"]').pressSequentially(code);
  await page.waitForURL(url => !/sign-in|email-code|welcome/.test(url.pathname), { timeout: 60_000 });
  await expect.poll(() => page.evaluate(() => Object.keys(localStorage).some(k => k.includes('auth-token')))).toBe(true);
}

for (const acc of accounts) {
  setup(`login: ${acc.id} (${acc.role})`, async ({ page }) => {
    setup.setTimeout(180_000);
    const email = process.env[acc.emailVar];
    const code = process.env[acc.codeVar];
    if (!email || !code) {
      setup.skip(true, `В .qa/accounts.env нет ${acc.emailVar} / ${acc.codeVar}`);
      return;
    }
    await login(page, email, code);
    await page.context().storageState({ path: path.join(authDir, `${acc.id}.json`) });
  });
}

// Ручная регистрация/вход без Enter в терминале: окно открывается на /phone,
// пользователь сам вводит номер и код; как только сайт ушёл с экранов авторизации —
// сессия сохраняется в .qa/auth/<id>.json и окно закрывается.
// Запуск: node manual-register.mjs <id>   (по умолчанию newuser)
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const cfg = JSON.parse(fs.readFileSync(path.join(here, 'qa.config.json'), 'utf8'));
const id = process.argv[2] || 'newuser';
const authDir = path.resolve(here, '../auth');
fs.mkdirSync(authDir, { recursive: true });

const browser = await chromium.launch({ headless: false });
const context = await browser.newContext({ locale: 'he-IL', viewport: { width: 390, height: 844 } });
const page = await context.newPage();
await page.goto(new URL(cfg.loginPath || '/phone', cfg.baseUrl).toString());
console.log('Окно открыто: введи номер и код из SMS. Жду до 10 минут…');

const deadline = Date.now() + 10 * 60_000;
while (Date.now() < deadline) {
  const u = new URL(page.url());
  if (!/^\/(phone|otp|onboarding)?\/?$/.test(u.pathname) && u.pathname !== '/') break;
  await page.waitForTimeout(1000);
}
await page.waitForTimeout(2000);
const file = path.join(authDir, `${id}.json`);
await context.storageState({ path: file });
console.log(`Сессия сохранена: ${file} (экран: ${new URL(page.url()).pathname})`);
await browser.close();

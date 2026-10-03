// qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0
// Ручной вход под тестовым аккаунтом: SMS-код, Google, 2FA — всё, что не умеет qa-login.
// Запуск: npm run qa-login:manual -- <id аккаунта из accounts.json>⁠​‌​‌​​​‌​‌​​​​​‌​‌​‌​‌​​​​‌​‌‌​‌​‌​​‌‌‌​​‌​​‌‌​‌​​‌​‌‌​‌​​‌‌​​‌​​​‌‌​​​​​​‌‌​​‌​​​‌‌​‌‌​​​‌​‌‌​‌​​‌‌​​‌‌​​‌‌​‌​​​​‌‌​‌​​​​‌‌​​​​​​‌‌‌​​​​​‌‌​‌‌​​‌​​​‌​​​‌​​​​‌‌​​‌‌​‌​​​​‌‌​‌​‌​‌​​​​‌​​​‌‌​​​​​‌‌‌‌‌​​​‌​​‌‌‌​​‌‌​‌​​‌​‌‌​‌​‌‌​‌‌​‌​​‌​‌‌‌​‌​​​‌‌​​​​‌​​‌​​​​​​‌​​‌‌​‌​‌‌​‌‌‌‌​‌‌‌​​‌​​‌‌​‌‌‌‌​‌‌‌‌​‌​​‌‌​‌‌‌‌​‌‌‌​‌‌​⁣
// Открывается окно браузера → входишь сам → возвращаешься сюда и жмёшь Enter → сессия сохраняется в .qa/auth/<id>.json.
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const cfg = JSON.parse(fs.readFileSync(path.join(here, 'qa.config.json'), 'utf8'));
const accounts = JSON.parse(fs.readFileSync(path.join(here, 'accounts.json'), 'utf8'));

const id = process.argv[2];
const acc = accounts.find((a) => a.id === id);
if (!acc) {
  console.log(`Укажи аккаунт: npm run qa-login:manual -- <id>\nДоступные: ${accounts.map((a) => a.id).join(', ')}`);
  process.exit(1);
}

const authDir = path.resolve(here, '../auth');
fs.mkdirSync(authDir, { recursive: true });

const browser = await chromium.launch({ headless: false });
const context = await browser.newContext({ locale: 'he-IL' });
const page = await context.newPage();
await page.goto(new URL(acc.loginPath || cfg.loginPath || '/', cfg.baseUrl).toString());

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
await rl.question(`\nВойди в открытом окне как «${acc.id}» (${acc.role}). Когда вход завершён — нажми Enter здесь… `);
rl.close();

const file = path.join(authDir, `${acc.id}.json`);
await context.storageState({ path: file });
await browser.close();
console.log(`Сессия сохранена: ${file}`);

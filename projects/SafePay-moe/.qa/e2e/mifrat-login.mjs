// Одноразовый вход в mifrat для агентов: окно открывается на доске, пользователь входит сам;
// как только видна доска (колонка «בבדיקות») — сессия сохраняется в .qa/auth/mifrat.json и окно закрывается.
// Дальше скрипты прикрепляют файлы к реджектам через setInputFiles, без ручной вставки.
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const ctx = JSON.parse(fs.readFileSync(path.join(here, 'qa.config.json'), 'utf8'));
const board = process.argv[2] || ctx.mifratBoard || 'https://mifrat.com/Project?id=69e115aa1b31563236cf6b60&tab=tasks';
const out = path.resolve(here, '../auth/mifrat.json');

const browser = await chromium.launch({ headless: false });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
await page.goto(board);
console.log('Окно открыто: войди в mifrat. Жду до 10 минут…');
const deadline = Date.now() + 10 * 60_000;
while (Date.now() < deadline) {
  const ok = await page.evaluate(() => document.body.innerText.includes('בבדיקות')).catch(() => false);
  if (ok) break;
  await page.waitForTimeout(1500);
}
await page.waitForTimeout(2000);
await context.storageState({ path: out });
console.log(`Сессия mifrat сохранена: ${out}`);
await browser.close();

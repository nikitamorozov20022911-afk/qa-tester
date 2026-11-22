// Ручной вход без терминала: окно браузера → входишь сам → сессия сохраняется в .qa/auth/<id>.json
// автоматически (каждые 3 с, пока есть токен). Закрой окно, когда закончишь.
// Запуск: node manual-login-auto.mjs <id> [путь, по умолчанию /sign-in]
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const cfg = JSON.parse(fs.readFileSync(path.join(here, 'qa.config.json'), 'utf8'));
const id = process.argv[2];
const start = process.argv[3] || cfg.loginPath || '/sign-in';
if (!id) { console.log('usage: node manual-login-auto.mjs <id> [path]'); process.exit(1); }
const file = path.resolve(here, '../auth', `${id}.json`);
fs.mkdirSync(path.dirname(file), { recursive: true });

const browser = await chromium.launch({ headless: false });
const context = await browser.newContext({ locale: 'he-IL', viewport: { width: 430, height: 900 } });
const page = await context.newPage();
await page.goto(new URL(start, cfg.baseUrl).toString());
console.log(`Окно открыто для «${id}». Сессия будет сохраняться автоматически.`);

let saved = false;
const tick = setInterval(async () => {
  try {
    const has = await page.evaluate(() => Object.keys(localStorage).some((k) => k.includes('auth-token')));
    if (has) {
      await context.storageState({ path: file });
      if (!saved) console.log(`Сессия сохранена: ${file} (${page.url()})`);
      saved = true;
    }
  } catch {}
}, 3000);

await new Promise((r) => { browser.on('disconnected', r); page.on('close', r); });
clearInterval(tick);
await browser.close().catch(() => {});
console.log(saved ? `Готово: ${file}` : 'Окно закрыто, вход не обнаружен — сессия не сохранена.');

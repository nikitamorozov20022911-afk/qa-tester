// Вход в NutriWingman (Expo web + Supabase): окно открывается, пользователь входит сам;
// как только в localStorage появляется sb-*-auth-token с access_token — сессия сохраняется в .qa/auth/<id>.json.
import { chromium } from '@playwright/test';
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const cfg = JSON.parse(fs.readFileSync(path.join(here, 'qa.config.json'), 'utf8'));
const id = process.argv[2]; if (!id) { console.log('usage: node login-supabase.mjs <id>'); process.exit(1); }
const out = path.resolve(here, `../auth/${id}.json`);
const launchOpts = { headless: false, args: ['--window-size=480,760'] };
// Playwright Chromium 1254 на этой машине не стартует (side-by-side) — запасной путь: установленный Google Chrome.
const browser = await chromium.launch(launchOpts).catch(() => chromium.launch({ ...launchOpts, channel: 'chrome' }));
const context = await browser.newContext({ locale: 'he-IL', viewport: null });
const page = await context.newPage();
await page.goto(cfg.baseUrl);
console.log(`Окно открыто для «${id}». Жду вход до 15 минут…`);
const deadline = Date.now() + 15 * 60_000;
while (Date.now() < deadline) {
  if (page.isClosed()) { console.log('Окно закрыто до входа'); process.exit(1); }
  const email = await page.evaluate(() => { for (const k of Object.keys(localStorage)) if (/^sb-.*-auth-token$/.test(k)) { try { const v = JSON.parse(localStorage[k]); if (v.access_token && v.user?.email && !v.user?.is_anonymous) return v.user.email; } catch {} } return null; }).catch(() => null);
  if (email) { await page.waitForTimeout(2500); await context.storageState({ path: out }); console.log(`Вход: ${email}. Сессия сохранена: ${out}`); await browser.close(); process.exit(0); }
  await page.waitForTimeout(1000);
}
console.log('Таймаут'); await browser.close(); process.exit(2);

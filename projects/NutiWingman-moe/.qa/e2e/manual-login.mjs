// qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0
// Ручной вход под тестовым аккаунтом: SMS-код, Google, 2FA — всё, что не умеет qa-login.
// Запуск: npm run qa-login:manual -- <id аккаунта из accounts.json>⁠​‌​‌​​​‌​‌​​​​​‌​‌​‌​‌​​​​‌​‌‌​‌​‌​​‌‌‌​​‌​​‌‌​‌​​‌​‌‌​‌​​‌‌​​‌​​​‌‌​​​​​​‌‌​​‌​​​‌‌​‌‌​​​‌​‌‌​‌​​‌‌​​‌‌​​‌‌​‌​​​​‌‌​‌​​​​‌‌​​​​​​‌‌‌​​​​​‌‌​‌‌​​‌​​​‌​​​‌​​​​‌‌​​‌‌​‌​​​​‌‌​‌​‌​‌​​​​‌​​​‌‌​​​​​‌‌‌‌‌​​​‌​​‌‌‌​​‌‌​‌​​‌​‌‌​‌​‌‌​‌‌​‌​​‌​‌‌‌​‌​​​‌‌​​​​‌​​‌​​​​​​‌​​‌‌​‌​‌‌​‌‌‌‌​‌‌‌​​‌​​‌‌​‌‌‌‌​‌‌‌‌​‌​​‌‌​‌‌‌‌​‌‌‌​‌‌​⁣
// Открывается окно браузера → входишь сам → вход замечается автоматически (или жмёшь Enter здесь — что раньше) → сессия сохраняется в .qa/auth/<id>.json.
// Признак входа: ушли со страницы входа и нет полей пароля/кода 3 секунды подряд. Свой признак — в accounts.json: "loggedInUrl" (часть адреса) или "loggedInSelector".
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';
import { fileURLToPath } from 'node:url';

if (process.versions.node.split('.')[0] !== '22') {
  console.error(`qa-tester: нужен Node 22, сейчас ${process.version}. Запусти так: ../bin/with-node22 npm run qa-login:manual -- <id> (или nvm use 22).`);
  process.exit(1);
}

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

const LOGIN_URL = /login|signin|sign-in|auth|otp|verify|register|signup|כניסה|התחברות/i;
const LOGIN_FIELDS = 'input[type=password], input[autocomplete="one-time-code"], input[name*=otp i], input[id*=otp i], input[name*=code i]';
const loginPath = acc.loginPath || cfg.loginPath || '/';

async function loggedIn() {
  const url = new URL(page.url());
  if (acc.loggedInUrl) return url.href.includes(acc.loggedInUrl);
  if (acc.loggedInSelector) return page.locator(acc.loggedInSelector).first().isVisible().catch(() => false);
  if (loginPath !== '/' && url.pathname.startsWith(loginPath)) return false;
  if (LOGIN_URL.test(url.pathname + url.hash)) return false;
  const fields = await page.locator(LOGIN_FIELDS).evaluateAll((els) => els.filter((e) => e.offsetParent !== null).length).catch(() => 1);
  return fields === 0;
}

// Ждём, пока на экране появится вход (поле пароля/кода или страница входа), затем — пока он не исчезнет на 3 с.
async function watchLogin(signal) {
  let sawLogin = false;
  let okSince = 0;
  while (!signal.aborted) {
    await new Promise((r) => setTimeout(r, 500));
    if (page.isClosed()) throw new Error('closed');
    const ok = await loggedIn().catch(() => false);
    if (!ok) { sawLogin = true; okSince = 0; continue; }
    if (!sawLogin && !acc.loggedInUrl && !acc.loggedInSelector) continue;
    okSince ||= Date.now();
    if (Date.now() - okSince >= 3000) return 'auto';
  }
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const stop = new AbortController();
const how = await Promise.race([
  rl.question(`\nВойди в открытом окне как «${acc.id}» (${acc.role}). Вход заметится сам — или нажми Enter здесь… `, { signal: stop.signal }).then(() => 'enter', () => new Promise(() => {})), // нет терминала (запуск агентом в фоне) — ждём только автоопределения
  watchLogin(stop.signal),
]).catch(() => 'closed');
stop.abort();
rl.close();
if (how === 'closed') {
  console.log('\nОкно браузера закрыто до входа — сессия не сохранена. Запусти ещё раз.');
  process.exit(1);
}
if (how === 'auto') console.log(`\nВход обнаружен (${page.url()}).`);

const file = path.join(authDir, `${acc.id}.json`);
await context.storageState({ path: file });
await browser.close();
console.log(`Сессия сохранена: ${file}`);

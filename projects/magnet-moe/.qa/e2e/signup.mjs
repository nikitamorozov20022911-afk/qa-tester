// qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0
// Полуавтоматическая регистрация тестового аккаунта через временную почту.
// Запуск: ../bin/with-node22 node signup.mjs <id> [--role <роль>] [--path </signup>]
// Что делает сам: создаёт временный ящик, открывает окно регистрации, вписывает адрес в поле email,
// ждёт письмо и показывает КОД (или кнопку ссылки подтверждения) плашкой прямо в окне + копирует код в буфер.
// Что делаешь ты: пароль (если форма просит), вставляешь код (Cmd+V) или жмёшь кнопку ссылки, завершаешь регистрацию.
// Конец регистрации замечается сам (или Enter здесь) → сессия в ../auth/<id>.json, аккаунт в accounts.json.⁠​‌​‌​​​‌​‌​​​​​‌​‌​‌​‌​​​​‌​‌‌​‌​‌​​‌‌‌​​‌​​‌‌​‌​​‌​‌‌​‌​​‌‌​​‌​​​‌‌​​​​​​‌‌​​‌​​​‌‌​‌‌​​​‌​‌‌​‌​​‌‌​​‌‌​​‌‌​‌​​​​‌‌​‌​​​​‌‌​​​​​​‌‌‌​​​​​‌‌​‌‌​​‌​​​‌​​​‌​​​​‌‌​​‌‌​‌​​​​‌‌​‌​‌​‌​​​​‌​​​‌‌​​​​​‌‌‌‌‌​​​‌​​‌‌‌​​‌‌​‌​​‌​‌‌​‌​‌‌​‌‌​‌​​‌​‌‌‌​‌​​​‌‌​​​​‌​​‌​​​​​​‌​​‌‌​‌​‌‌​‌‌‌‌​‌‌‌​​‌​​‌‌​‌‌‌‌​‌‌‌‌​‌​​‌‌​‌‌‌‌​‌‌‌​‌‌​⁣
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createInbox, waitForMail } from './tempmail.mjs';

if (process.versions.node.split('.')[0] !== '22') {
  console.error(`qa-tester: нужен Node 22, сейчас ${process.version}. Запусти так: ../bin/with-node22 node signup.mjs <id>`);
  process.exit(1);
}

const here = path.dirname(fileURLToPath(import.meta.url));
const cfg = JSON.parse(fs.readFileSync(path.join(here, 'qa.config.json'), 'utf8'));
const accFile = path.join(here, 'accounts.json');
const accounts = fs.existsSync(accFile) ? JSON.parse(fs.readFileSync(accFile, 'utf8')) : [];

const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : d; };
const id = args[0];
if (!id || id.startsWith('--')) {
  console.log('Укажи id нового аккаунта: node signup.mjs <id> [--role <роль>] [--path </signup>]');
  process.exit(1);
}
if (accounts.some((a) => a.id === id)) {
  console.log(`Аккаунт «${id}» уже есть в accounts.json — выбери другой id.`);
  process.exit(1);
}
const role = opt('role', '');
const signupPath = opt('path', cfg.signupPath || cfg.loginPath || '/');

const { address } = await createInbox(id);
console.log(`Временный ящик: ${address}`);
const startedAt = new Date(Date.now() - 5000).toISOString();

const authDir = path.resolve(here, '../auth');
fs.mkdirSync(authDir, { recursive: true });
const browser = await chromium.launch({ headless: process.env.QA_HEADLESS === '1' });
const context = await browser.newContext({ locale: 'he-IL' });
const page = await context.newPage();
await page.goto(new URL(signupPath, cfg.baseUrl).toString());

// Плашка поверх страницы (переживает переходы — ставится заново раз в секунду).
const banner = { lines: [`אימייל / Email: ${address}`, 'ממתין למייל… / Жду письмо…'], link: null };
async function drawBanner() {
  await page.evaluate((b) => {
    let el = document.getElementById('__qa_banner');
    if (!el) {
      el = document.createElement('div');
      el.id = '__qa_banner';
      el.style.cssText = 'position:fixed;top:8px;left:50%;transform:translateX(-50%);z-index:2147483647;background:#111;color:#fff;font:600 15px/1.5 system-ui,sans-serif;padding:10px 16px;border-radius:10px;box-shadow:0 4px 16px rgba(0,0,0,.4);direction:ltr;text-align:center;max-width:90vw';
      document.documentElement.appendChild(el);
    }
    const key = JSON.stringify(b);
    if (el.dataset.k === key) return;
    el.dataset.k = key;
    el.innerHTML = '';
    for (const l of b.lines) { const d = document.createElement('div'); d.textContent = l; el.appendChild(d); }
    if (b.link) {
      const a = document.createElement('a');
      a.href = b.link;
      a.textContent = 'לחץ לאישור / Подтвердить по ссылке из письма →';
      a.style.cssText = 'display:inline-block;margin-top:6px;padding:6px 12px;background:#2a7;color:#fff;border-radius:8px;text-decoration:none';
      el.appendChild(a);
    }
  }, banner).catch(() => {});
}

// Вписать адрес в поле email, как только оно появится (пароль, код и ссылку — не трогаем).
let emailFilled = false;
async function fillEmail() {
  if (emailFilled) return;
  const f = page.locator('input[type=email], input[name*=mail i], input[id*=mail i], input[autocomplete=email], input[placeholder*=mail i], input[placeholder*=אימייל], input[placeholder*="דוא"]').filter({ visible: true }).first();
  if ((await f.count().catch(() => 0)) && !(await f.inputValue().catch(() => 'x'))) {
    await f.fill(address).catch(() => {});
    emailFilled = true;
    console.log('Адрес вписан в поле email.');
  }
}

const tick = setInterval(() => { if (!page.isClosed()) { fillEmail(); drawBanner(); } }, 1000);

// Письмо: код/ссылка — плашкой в окне и в терминале; код — в буфер обмена.
waitForMail(address, { timeoutSec: 900, after: startedAt }).then((m) => {
  if (!m) { banner.lines = [`Email: ${address}`, 'המייל לא הגיע תוך 15 דקות / Письмо не пришло']; console.log('Письмо не пришло за 15 минут.'); return; }
  if (m.code) {
    try { execFileSync('pbcopy', { input: m.code }); } catch {}
    banner.lines = [`קוד מהמייל / Код: ${m.code}`, '(הועתק — Cmd+V / скопирован)', `Email: ${address}`];
  } else banner.lines = [`Email: ${address}`, `נושא / Тема: ${m.subject}`];
  banner.link = m.link;
  console.log(`\n=== ПИСЬМО: «${m.subject}» от ${m.from}\n=== КОД: ${m.code ?? '—'}\n=== ССЫЛКА: ${m.link ?? '—'}\n`);
}).catch((e) => console.log(`Почта: ${e.message}`));

// Конец регистрации: ушли со страниц входа/регистрации и нет полей пароля/кода/email 3 секунды подряд.
const AUTH_URL = /login|signin|sign-in|signup|sign-up|register|auth|otp|verify|כניסה|התחברות|הרשמה/i;
const AUTH_FIELDS = 'input[type=password], input[type=email], input[autocomplete="one-time-code"], input[name*=otp i], input[id*=otp i], input[name*=code i]';
async function done() {
  const u = new URL(page.url());
  if (signupPath !== '/' && u.pathname.startsWith(signupPath)) return false;
  if (AUTH_URL.test(u.pathname + u.hash)) return false;
  const n = await page.locator(AUTH_FIELDS).evaluateAll((els) => els.filter((e) => e.offsetParent !== null).length).catch(() => 1);
  return n === 0;
}
async function watch(signal) {
  let okSince = 0;
  while (!signal.aborted) {
    await new Promise((r) => setTimeout(r, 500));
    if (page.isClosed()) throw new Error('closed');
    if (!emailFilled || !(await done().catch(() => false))) { okSince = 0; continue; }
    okSince ||= Date.now();
    if (Date.now() - okSince >= 3000) return 'auto';
  }
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const stop = new AbortController();
const how = await Promise.race([
  rl.question('\nЗарегистрируйся в открытом окне (адрес уже вписан, код/ссылка появятся плашкой). Конец заметится сам — или нажми Enter… ', { signal: stop.signal }).then(() => 'enter', () => new Promise(() => {})),
  watch(stop.signal),
]).catch(() => 'closed');
stop.abort();
rl.close();
clearInterval(tick);
if (how === 'closed') {
  console.log('\nОкно закрыто до конца регистрации — сессия не сохранена. Ящик остаётся в auth/tempmail.json.');
  process.exit(1);
}
await page.evaluate(() => document.getElementById('__qa_banner')?.remove()).catch(() => {});
const file = path.join(authDir, `${id}.json`);
await context.storageState({ path: file });
await browser.close();
accounts.push({ id, role, email: address, tempmail: true, createdBy: 'qa-signup', created: new Date().toISOString().slice(0, 10) });
fs.writeFileSync(accFile, JSON.stringify(accounts, null, 2) + '\n');
console.log(`\nГотово: аккаунт «${id}» (${address}). Сессия: ${file}. Добавлен в accounts.json.`);
process.exit(0); // не ждать дальше почту

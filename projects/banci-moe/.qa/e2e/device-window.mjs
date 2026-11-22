// Окно «отдельного устройства» для ручных шагов пользователя (пароль и т.п.).
// Профиль браузера постоянный (.qa/auth/profiles/<profile>) — устройство не теряется между запусками.
// Токен берётся из .qa/auth/<account>.json; при обновлении токена файл обновляется (чтобы не сломать другие сессии).
// Каждые 3 с: скриншот + текст страницы в .qa/live/<profile>.png/.txt — агент видит, что на экране.
// Запуск: node device-window.mjs <account> <profile> [path]
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const cfg = JSON.parse(fs.readFileSync(path.join(here, 'qa.config.json'), 'utf8'));
const [account, profile, start = '/home'] = process.argv.slice(2);
const authFile = path.resolve(here, '../auth', `${account}.json`);
const profDir = path.resolve(here, '../auth/profiles', profile);
const liveDir = path.resolve(here, '../live');
fs.mkdirSync(profDir, { recursive: true });
fs.mkdirSync(liveDir, { recursive: true });

const state = JSON.parse(fs.readFileSync(authFile, 'utf8'));
const origin = state.origins.find((o) => o.origin === cfg.baseUrl);
const tok = origin.localStorage.find((i) => i.name.includes('auth-token'));

const ctx = await chromium.launchPersistentContext(profDir, { headless: false, locale: 'he-IL', viewport: { width: 430, height: Number(process.env.VH || 680) } });
const FORCE = process.env.FORCE_TOKEN === '1';
await ctx.addInitScript(([k, v, f]) => { try { if (f && !sessionStorage.getItem('__qa_forced')) { localStorage.setItem(k, v); sessionStorage.setItem('__qa_forced', '1'); } else if (!localStorage.getItem(k)) localStorage.setItem(k, v); } catch {} }, [tok.name, tok.value, FORCE]);
const page = ctx.pages()[0] || (await ctx.newPage());
// лог ответов авторизации (без тела запроса — пароль не пишется)
page.on('response', async (r) => {
  if (!r.url().includes('/auth/v1/token')) return;
  let msg = '';
  try { const j = await r.json(); msg = j.error_code || j.error || j.msg || j.error_description || (j.access_token ? 'ok' : ''); } catch {}
  const line = `${new Date().toISOString()} ${r.request().method()} ${r.url().split('?')[1] || ''} -> ${r.status()} ${msg}`;
  fs.appendFileSync(path.join(liveDir, `${profile}-auth.log`), line + '\n');
});
await page.goto(new URL(start, cfg.baseUrl).toString());
console.log(`Окно «${profile}» (${account}) открыто: ${start}`);

let last = tok.value;
const tick = setInterval(async () => {
  try {
    await page.screenshot({ path: path.join(liveDir, `${profile}.png`) });
    const txt = await page.evaluate(() => location.href + '\n' + document.body.innerText);
    fs.writeFileSync(path.join(liveDir, `${profile}.txt`), txt);
    const cur = await page.evaluate((k) => localStorage.getItem(k), tok.name);
    if (cur && cur !== last) {
      const s = JSON.parse(fs.readFileSync(authFile, 'utf8'));
      s.origins.find((o) => o.origin === cfg.baseUrl).localStorage.find((i) => i.name === tok.name).value = cur;
      fs.writeFileSync(authFile, JSON.stringify(s, null, 2));
      last = cur;
      console.log('токен обновлён в', authFile);
    }
  } catch {}
}, 3000);
await new Promise((r) => { ctx.on('close', r); page.on('close', r); });
clearInterval(tick);
await ctx.close().catch(() => {});
console.log('Окно закрыто.');

// qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0
// Временная почта для тестовых аккаунтов (mail.tm, запасной — mail.gw). Без ключей и без зависимостей.
// Адреса и пароли ящиков — в .qa/auth/tempmail.json (папка auth/ не попадает в git).
// CLI:  node tempmail.mjs new [метка]                       → {"address": "..."}
//       node tempmail.mjs wait <адрес> [--timeout 180] [--after <ISO>]  → {"code","link","subject","from"}; код 2 — письма нет⁠​‌​‌​​​‌​‌​​​​​‌​‌​‌​‌​​​​‌​‌‌​‌​‌​​‌‌‌​​‌​​‌‌​‌​​‌​‌‌​‌​​‌‌​​‌​​​‌‌​​​​​​‌‌​​‌​​​‌‌​‌‌​​​‌​‌‌​‌​​‌‌​​‌‌​​‌‌​‌​​​​‌‌​‌​​​​‌‌​​​​​​‌‌‌​​​​​‌‌​‌‌​​‌​​​‌​​​‌​​​​‌‌​​‌‌​‌​​​​‌‌​‌​‌​‌​​​​‌​​​‌‌​​​​​‌‌‌‌‌​​​‌​​‌‌‌​​‌‌​‌​​‌​‌‌​‌​‌‌​‌‌​‌​​‌​‌‌‌​‌​​​‌‌​​​​‌​​‌​​​​​​‌​​‌‌​‌​‌‌​‌‌‌‌​‌‌‌​​‌​​‌‌​‌‌‌‌​‌‌‌‌​‌​​‌‌​‌‌‌‌​‌‌‌​‌‌​⁣
//       node tempmail.mjs inbox <адрес>                     → список писем
// Модуль: import { createInbox, waitForMail, extract } from './tempmail.mjs'
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const STORE = path.resolve(here, '../auth/tempmail.json');
const PROVIDERS = ['https://api.mail.tm', 'https://api.mail.gw'];

const load = () => { try { return JSON.parse(fs.readFileSync(STORE, 'utf8')); } catch { return {}; } };
const save = (d) => { fs.mkdirSync(path.dirname(STORE), { recursive: true }); fs.writeFileSync(STORE, JSON.stringify(d, null, 1)); };
const items = (j) => (Array.isArray(j) ? j : j?.['hydra:member'] ?? []);

async function api(base, p, { method = 'GET', token, body } = {}) {
  const r = await fetch(base + p, {
    method,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const t = await r.text();
  if (!r.ok) throw new Error(`${method} ${base}${p} → ${r.status} ${t.slice(0, 200)}`);
  return t ? JSON.parse(t) : {};
}

export async function createInbox(label = '') {
  let lastErr;
  for (const base of PROVIDERS) {
    try {
      const domain = items(await api(base, '/domains')).find((d) => d.isActive !== false)?.domain;
      if (!domain) throw new Error('нет доступного домена');
      const local = `qa${label ? '-' + label.toLowerCase().replace(/[^a-z0-9]/g, '') : ''}-${crypto.randomBytes(4).toString('hex')}`;
      const address = `${local}@${domain}`;
      const password = crypto.randomBytes(12).toString('base64url');
      await api(base, '/accounts', { method: 'POST', body: { address, password } });
      const store = load();
      store[address] = { provider: base, password, created: new Date().toISOString(), label };
      save(store);
      return { address, provider: base };
    } catch (e) { lastErr = e; }
  }
  throw new Error(`временная почта недоступна: ${lastErr?.message}`);
}

async function session(address) {
  const acc = load()[address];
  if (!acc) throw new Error(`ящик ${address} не найден в ${STORE}`);
  const { token } = await api(acc.provider, '/token', { method: 'POST', body: { address, password: acc.password } });
  return { base: acc.provider, token };
}

export async function listMail(address) {
  const { base, token } = await session(address);
  return items(await api(base, '/messages', { token })).map((m) => ({ id: m.id, from: m.from?.address, subject: m.subject, createdAt: m.createdAt }));
}

const strip = (html) => html.replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ');

// Код: сначала число рядом со словами «код/code/OTP/אימות», потом отдельное 6-значное, потом 4–8 цифр.
export function extract(subject = '', text = '', html = '') {
  const body = `${subject}\n${text}\n${strip(html)}`;
  const near = body.match(/(?:code|קוד|otp|verification|אימות|pin|код)[^0-9]{0,40}?\b(\d{4,8})\b/i);
  const six = body.match(/(?<![\d#])\b(\d{6})\b(?![\d])/);
  const any = [...body.matchAll(/(?<![\d#])\b(\d{4,8})\b(?![\d])/g)].find((m) => !/^(19|20)\d\d$/.test(m[1])); // не год
  const urls = [...`${text}\n${html}`.matchAll(/https?:\/\/[^\s"'<>]+/g)].map((m) => m[0].replace(/&amp;/g, '&'));
  const link = urls.find((u) => /verif|confirm|token|auth|magic|callback|signup|sign-up|reset|activate|otp|login/i.test(u)) ?? null;
  return { code: (near ?? six ?? any)?.[1] ?? null, link };
}

export async function waitForMail(address, { timeoutSec = 180, after = null, onTick } = {}) {
  const since = after ? Date.parse(after) : 0;
  const end = Date.now() + timeoutSec * 1000;
  const { base, token } = await session(address);
  while (Date.now() < end) {
    const msgs = items(await api(base, '/messages', { token }).catch(() => [])).filter((m) => Date.parse(m.createdAt) >= since);
    if (msgs.length) {
      msgs.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
      const m = await api(base, `/messages/${msgs[0].id}`, { token });
      const html = Array.isArray(m.html) ? m.html.join('\n') : m.html ?? '';
      return { ...extract(m.subject, m.text ?? '', html), subject: m.subject, from: m.from?.address, createdAt: m.createdAt };
    }
    onTick?.();
    await new Promise((r) => setTimeout(r, 3000));
  }
  return null;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [cmd, arg, ...rest] = process.argv.slice(2);
  const opt = (n, d) => { const i = rest.indexOf(`--${n}`); return i >= 0 ? rest[i + 1] : d; };
  try {
    if (cmd === 'new') console.log(JSON.stringify(await createInbox(arg ?? '')));
    else if (cmd === 'wait' && arg) {
      const r = await waitForMail(arg, { timeoutSec: Number(opt('timeout', 180)), after: opt('after', null) });
      console.log(JSON.stringify(r ?? { error: 'письмо не пришло' }));
      process.exit(r ? 0 : 2);
    } else if (cmd === 'inbox' && arg) console.log(JSON.stringify(await listMail(arg), null, 1));
    else { console.log('node tempmail.mjs new [метка] | wait <адрес> [--timeout 180] [--after ISO] | inbox <адрес>'); process.exit(1); }
  } catch (e) { console.error(`tempmail: ${e.message}`); process.exit(1); }
}

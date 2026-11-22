// #3cc72778 helpers: one context at a time, rotate+save user1 session, clock substitution, reminders block reader
import { chromium } from 'playwright';
import fs from 'fs';
export const BASE = 'https://zichui-harabim.expo.app';
export const AUTH = new URL('../../auth/user1.json', import.meta.url).pathname;
export const SHOTS = new URL('../../screenshots/', import.meta.url).pathname;
const KEYRE = /^sb-.+-auth-token$/;

export async function open({ width = 390, height = 844, tz = 'Asia/Jerusalem', fakeAt = null } = {}) {
  const state = JSON.parse(fs.readFileSync(AUTH, 'utf8'));
  const tokItem = state.origins[0].localStorage.find((i) => KEYRE.test(i.name));
  const fileTok = JSON.parse(tokItem.value);
  let realExp = fileTok.expires_at;
  if (fakeAt) {
    if (realExp * 1000 < Date.now() + 10 * 60_000) throw new Error('token in file too old for fakeAt open; warm first');
    fileTok.expires_at = Math.floor(new Date(fakeAt).getTime() / 1000) + 3600;
    tokItem.value = JSON.stringify(fileTok);
  }
  const journeyOrig = state.origins[0].localStorage.find((i) => i.name === 'journey');
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ storageState: state, viewport: { width, height }, locale: 'he-IL', timezoneId: tz });
  if (fakeAt) await ctx.clock.setFixedTime(new Date(fakeAt));
  const page = await ctx.newPage();
  const log = { console: [], net: [], rpc: [] };
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') log.console.push(`${m.type()}: ${m.text().slice(0, 300)}`); });
  page.on('pageerror', (e) => log.console.push('pageerror: ' + e.message.slice(0, 300)));
  page.on('response', async (r) => {
    const u = r.url();
    if (!u.includes('supabase.co')) return;
    const path = u.replace(/^https:\/\/[^/]+/, '').slice(0, 160);
    if (r.status() >= 400) log.net.push(`${r.status()} ${r.request().method()} ${path}`);
    if (u.includes('/rpc/')) {
      let body = '';
      try { body = (await r.text()).slice(0, 400); } catch {}
      log.rpc.push({ t: new Date().toISOString(), status: r.status(), path, req: (r.request().postData() || '').slice(0, 300), body });
    }
  });
  let saved = false;
  async function save() {
    const ns = await ctx.storageState();
    const o = ns.origins.find((x) => x.origin.includes('zichui-harabim.expo.app'));
    if (!o) throw new Error('no origin in storage');
    const tok = o.localStorage.find((i) => KEYRE.test(i.name));
    if (!tok) throw new Error('no auth token in storage — NOT saving');
    const v = JSON.parse(tok.value);
    if (api.realExp && v.expires_at !== api.realExp) { v.expires_at = api.realExp; tok.value = JSON.stringify(v); }
    // restore a real-time expires_at so the file never carries a fake-clock value that looks valid
    o.localStorage = o.localStorage.filter((i) => i.name !== 'journey');
    if (journeyOrig) o.localStorage.push(journeyOrig);
    fs.writeFileSync(AUTH, JSON.stringify(ns, null, 2));
    saved = true;
    return { refresh: v.refresh_token?.slice(0, 6), exp: v.expires_at };
  }
  async function close() { const s = await save(); await browser.close(); return s; }
  const api = { browser, ctx, page, log, save, close, realExp };
  return api;
}

async function readExp(page) {
  return page.evaluate(() => {
    const k = Object.keys(localStorage).find((k) => /^sb-.+-auth-token$/.test(k));
    if (!k) return null;
    return JSON.parse(localStorage.getItem(k)).expires_at;
  });
}
async function setExp(page, exp) {
  await page.evaluate((exp) => {
    const k = Object.keys(localStorage).find((k) => /^sb-.+-auth-token$/.test(k));
    const v = JSON.parse(localStorage.getItem(k)); v.expires_at = exp; localStorage.setItem(k, JSON.stringify(v));
  }, exp);
}

// Open /home on REAL time, make sure token is alive for >= 15 min (force refresh otherwise)
export async function warm(page, s, path = '/profile') {
  await page.goto(BASE + path);
  for (let i = 0; i < 60; i++) {
    const e = await readExp(page);
    if (e && e * 1000 > Date.now()) break;
    await page.waitForTimeout(500);
  }
  if (/\/(phone|login|welcome)?$/.test(new URL(page.url()).pathname) && !page.url().includes('/home')) throw new Error('SESSION DEAD: url ' + page.url());
  const e = await readExp(page);
  if (!e || e * 1000 <= Date.now()) throw new Error('SESSION DEAD: no live token');
  if (e * 1000 - Date.now() < 15 * 60_000) {
    const resp = page.waitForResponse((r) => r.url().includes('/auth/v1/token') && r.request().method() === 'POST', { timeout: 30000 });
    await setExp(page, Math.floor(Date.now() / 1000) - 60);
    await page.reload();
    const r = await resp;
    if (!r.ok()) throw new Error('SESSION DEAD: refresh rejected ' + r.status());
    await page.waitForTimeout(1500);
  }
  if (s) s.realExp = await readExp(page);
}

// fixed fake time (absolute instant), keep session usable
export async function fake(page, isoInstant) {
  const d = new Date(isoInstant);
  await page.clock.setFixedTime(d);
  await setExp(page, Math.floor(d.getTime() / 1000) + 3600);
}
// before saving: put token expiry back to real-ish (so file reflects real token); app refresh will fix anyway
export async function realExpiry(page, realExp) { await setExp(page, realExp); }
export { readExp, setExp };

// Read «תזכורות מהירות» block: rows with lines, geometry of text and icon circle
export async function readReminders(page, timeout = 25000) {
  const title = page.getByText('תזכורות מהירות', { exact: true });
  await title.waitFor({ timeout });
  // wait for block content to settle (skeleton → rows)
  await page.waitForTimeout(3500);
  return page.evaluate(() => {
    const t = [...document.querySelectorAll('div,span')].find((e) => e.childElementCount === 0 && e.textContent.trim() === 'תזכורות מהירות');
    const block = t.parentElement.parentElement;
    const rows = [...block.children].slice(1);
    const out = rows.map((r) => {
      const rr = r.getBoundingClientRect();
      const lines = r.innerText.split('\n').map((s) => s.trim()).filter(Boolean);
      // icon circle: element with border-radius >= half its size, containing svg/img
      const cands = [...r.querySelectorAll('div')].filter((d) => {
        const b = d.getBoundingClientRect(); const cs = getComputedStyle(d);
        return b.width >= 24 && b.width <= 72 && Math.abs(b.width - b.height) < 2 && parseFloat(cs.borderTopLeftRadius) >= b.width / 2 - 1 && d.querySelector('svg,img');
      });
      const ic = cands[0];
      const ib = ic ? ic.getBoundingClientRect() : null;
      const textEls = [...r.querySelectorAll('div,span')].filter((e) => e.childElementCount === 0 && e.textContent.trim());
      const tb = textEls[0]?.getBoundingClientRect();
      let svgSig = null;
      if (ic) { const s = ic.querySelector('svg'); svgSig = s ? (s.innerHTML.length + ':' + (s.querySelector('path')?.getAttribute('d') || '').slice(0, 24)) : ic.querySelector('img')?.src?.slice(-40); }
      return {
        lines,
        row: { x: Math.round(rr.x), w: Math.round(rr.width), h: Math.round(rr.height), right: Math.round(rr.right) },
        icon: ib ? { x: Math.round(ib.x), w: Math.round(ib.width), right: Math.round(ib.right) } : null,
        textRight: tb ? Math.round(tb.right) : null,
        iconOnRight: ib && tb ? ib.x > tb.x : null,
        svgSig,
        overflow: r.scrollWidth > r.clientWidth + 1,
      };
    });
    return { blockText: block.innerText, rows: out, docOverflowX: document.documentElement.scrollWidth > innerWidth };
  });
}

export function tefillinRows(rem) { return rem.rows.filter((r) => r.lines[0] === 'הנחת תפילין'); }
export function rowsNamed(rem, name) { return rem.rows.filter((r) => r.lines[0] === name); }

// red outline helper around an element / rect
export async function mark(page, rect) {
  await page.evaluate((r) => {
    const d = document.createElement('div'); d.id = '__qa_mark';
    Object.assign(d.style, { position: 'fixed', left: r.x - 4 + 'px', top: r.y - 4 + 'px', width: r.w + 8 + 'px', height: r.h + 8 + 'px', border: '3px solid red', zIndex: 99999, pointerEvents: 'none' });
    document.body.appendChild(d);
  }, rect);
}
export async function unmark(page) { await page.evaluate(() => document.getElementById('__qa_mark')?.remove()); }
export async function shotBlock(page, path) {
  const el = page.getByText('תזכורות מהירות', { exact: true });
  await el.scrollIntoViewIfNeeded();
  await page.screenshot({ path });
}

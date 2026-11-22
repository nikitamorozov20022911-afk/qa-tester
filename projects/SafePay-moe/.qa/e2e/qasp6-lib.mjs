import { chromium } from 'playwright';
export const BASE = 'https://safepay.expo.app';
export const QA = '/Users/avielshnaider/SafePay-moe/.qa';
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export async function newBrowser() { return chromium.launch({ headless: true, channel: 'chrome' }); }
export async function ctx(browser, role, width, height = 860) {
  const c = await browser.newContext({ storageState: `${QA}/auth/${role}.json`, viewport: { width, height }, locale: 'he-IL' });
  const p = await c.newPage();
  p._console = []; p._req = [];
  p.on('console', (m) => { if (['error', 'warning'].includes(m.type())) p._console.push(`${m.type()}: ${m.text().slice(0, 250)}`); });
  p.on('pageerror', (e) => p._console.push('pageerror: ' + e.message.slice(0, 250)));
  p.on('request', (r) => { if (!['GET','OPTIONS'].includes(r.method())) p._req.push(`${r.method()} ${r.url().replace(/\?.*/, '')}`); });
  return { c, p };
}
export async function go(p, path, wait = 3500) { await p.goto(BASE + path, { waitUntil: 'domcontentloaded' }); await sleep(wait); }
export const txt = (p) => p.evaluate(() => document.body.innerText);
export async function shot(p, file, full = false) { await p.screenshot({ path: `${QA}/screenshots/${file}.png`, fullPage: full }); return `${QA}/screenshots/${file}.png`; }
export async function redBox(p, loc, file, full=false) {
  try { await loc.first().evaluate((el) => { el.scrollIntoView({ block: 'center' }); el.style.outline = '3px solid red'; el.style.outlineOffset = '2px'; }); } catch (e) { console.log('redbox fail', e.message.slice(0,80)); }
  const f = await shot(p, file, full);
  try { await loc.first().evaluate((el) => { el.style.outline = ''; }); } catch {}
  return f;
}
export async function overflow(p) { return p.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth, dir: getComputedStyle(document.body).direction })); }

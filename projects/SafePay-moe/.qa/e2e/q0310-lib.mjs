// helper for 03.10 run of 4 tickets (temporary)
import { chromium } from 'playwright';
export const BASE = 'https://safepay.expo.app';
export const QA = '/Users/avielshnaider/SafePay-moe/.qa';
export const SSD = QA + '/screenshots';
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export async function newBrowser() { return chromium.launch({ headless: true, channel: process.env.CH || 'chrome' }); }
export async function ctx(browser, role, width, height = 900) {
  const c = await browser.newContext({ storageState: `${QA}/auth/${role}.json`, viewport: { width, height }, locale: 'he-IL' });
  const p = await c.newPage();
  p._console = []; p._req = [];
  p.on('console', (m) => { if (['error', 'warning'].includes(m.type())) p._console.push(`${m.type()}: ${m.text().slice(0, 300)}`); });
  p.on('pageerror', (e) => p._console.push('pageerror: ' + e.message.slice(0, 300)));
  p.on('request', (r) => { if (!['GET','OPTIONS','HEAD'].includes(r.method())) p._req.push(`${r.method()} ${r.url().replace(/\?.*/, '')}`); });
  return { c, p };
}
export const txt = (p) => p.evaluate(() => document.body.innerText);
export async function shot(p, dir, name, full=false) { const f = `${SSD}/${dir}/${name}.png`; await p.screenshot({ path: f, fullPage: full }); return f; }
export async function redBox(p, locator, dir, name) {
  try { await locator.first().evaluate((el) => { el.scrollIntoView({ block: 'center' }); el.style.outline = '3px solid red'; el.style.outlineOffset = '2px'; }); } catch {}
  const f = await shot(p, dir, name);
  try { await locator.first().evaluate((el) => { el.style.outline = ''; }); } catch {}
  return f;
}
export async function go(p, path) { await p.goto(BASE + path, { waitUntil: 'domcontentloaded' }); await sleep(3500); }

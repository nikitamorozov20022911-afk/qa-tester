// helper for ticket #1846ecd8 manual QA run (temporary)
import { chromium } from 'playwright';
export const BASE = 'https://safepay.expo.app';
export const QA = '/Users/avielshnaider/SafePay-moe/.qa';
export const SS = QA + '/screenshots/1846ecd8';
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function ctx(browser, role, width, height = 900) {
  const c = await browser.newContext({
    storageState: `${QA}/auth/${role}.json`,
    viewport: { width, height },
    locale: 'he-IL',
  });
  const p = await c.newPage();
  p._console = [];
  p._req = [];
  p.on('console', (m) => { if (['error', 'warning'].includes(m.type())) p._console.push(`${m.type()}: ${m.text().slice(0, 300)}`); });
  p.on('pageerror', (e) => p._console.push('pageerror: ' + e.message.slice(0, 300)));
  p.on('request', (r) => { if (r.method() !== 'GET' && r.method() !== 'OPTIONS') p._req.push(`${r.method()} ${r.url().replace(/\?.*/, '')}`); });
  return { c, p };
}

export async function visText(p) {
  return p.evaluate(() => document.body.innerText);
}

export async function shot(p, name) {
  await p.screenshot({ path: `${SS}/${name}.png` });
  return `${SS}/${name}.png`;
}

export async function redBox(p, locator, name) {
  try {
    await locator.first().evaluate((el) => { el.scrollIntoView({ block: 'center' }); el.style.outline = '3px solid red'; el.style.outlineOffset = '2px'; });
  } catch {}
  const f = await shot(p, name);
  try { await locator.first().evaluate((el) => { el.style.outline = ''; }); } catch {}
  return f;
}

export function hhmm() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

// fill form; recipient assumed preselected unless pickProvider=true
export async function fillForm(p, { title, type = 'שיפוץ ובנייה', terms, amount, start, end }) {
  const tb = p.getByRole('textbox', { name: 'הקלד/י' });
  if (title !== undefined) await tb.nth(0).fill(title);
  if (type) {
    await p.getByRole('button', { name: /סוג העסקה/ }).click();
    await sleep(500);
    await p.getByText(type, { exact: true }).last().click();
    await sleep(300);
  }
  if (terms !== undefined) await tb.nth(1).fill(terms);
  if (amount !== undefined) await tb.nth(2).fill(String(amount));
  const dates = p.getByRole('textbox', { name: '00/00/0000' });
  if (start) { await dates.nth(0).click(); await dates.nth(0).pressSequentially(start.replace(/\//g, ''), { delay: 40 }); }
  if (end) { await dates.nth(1).click(); await dates.nth(1).pressSequentially(end.replace(/\//g, ''), { delay: 40 }); }
  await sleep(300);
}

export async function submitBtn(p) {
  return p.getByRole('button', { name: 'פתיחת עסקה בטוחה' }).last();
}

export async function newBrowser() {
  return chromium.launch({ headless: true, channel: process.env.CH || 'chrome' });
}

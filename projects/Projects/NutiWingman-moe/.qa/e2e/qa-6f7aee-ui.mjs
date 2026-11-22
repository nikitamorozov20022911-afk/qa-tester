// QA #6f7aee: open /home under saved session, screenshot, open day-line tooltip, dump text. Saves storageState back.
// usage: node qa-6f7aee-ui.mjs <account> [mode]
import { chromium } from 'playwright';
import fs from 'node:fs';
const acc = process.argv[2];
const mode = process.argv[3] || 'explore';
const OUT = '../research/shots/6f7aee';
const authFile = `../auth/${acc}.json`;
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ storageState: authFile, viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, locale: 'he-IL', timezoneId: 'Asia/Jerusalem' });
const page = await ctx.newPage();
const errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push(m.text().slice(0, 200)); });
const res = {};
try {
  await page.goto('https://nutriwingman.expo.app/home', { waitUntil: 'networkidle', timeout: 30000 });
  res.url = page.url();
  await page.screenshot({ path: `${OUT}/${acc}-home.png` });
  res.text = (await page.evaluate(() => document.body.innerText)).slice(0, 3000);
  // candidates for day line
  res.cands = await page.evaluate(() => [...document.querySelectorAll('[aria-label],[data-testid],[role=button]')].map(e => { const r = e.getBoundingClientRect(); return { tag: e.tagName, role: e.getAttribute('role'), al: e.getAttribute('aria-label'), tid: e.getAttribute('data-testid'), t: (e.innerText || '').slice(0, 60), x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }; }).filter(o => o.w > 0));
  if (mode !== 'explore') {
    const line = page.getByRole('button', { name: /קו היום/ });
    res.lineBox = await line.boundingBox();
    res.lineDot = await page.evaluate(() => { const b = [...document.querySelectorAll('[aria-label]')].find(e => /קו היום/.test(e.getAttribute('aria-label'))); return [...b.querySelectorAll('div')].map(d => { const r = d.getBoundingClientRect(); const cs = getComputedStyle(d); return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), bg: cs.backgroundColor, br: cs.borderRadius }; }).filter(o => o.w >= 20 && o.w <= 40 && o.h >= 20 && o.h <= 40 && o.bg !== 'rgba(0, 0, 0, 0)'); });
    const t0 = Date.now();
    await line.click();
    const tip = page.getByText(/מתוך/).first();
    try { await tip.waitFor({ timeout: 10000 }); res.tipMs = Date.now() - t0; } catch { res.tipErr = 'no "מתוך" within 10s'; }
    await page.screenshot({ path: `${OUT}/${acc}-tooltip.png` });
    res.afterText = (await page.evaluate(() => document.body.innerText)).slice(0, 4000);
    // bars inside the tooltip: elements containing 'מתוך'
    res.rows = await page.evaluate(() => [...document.querySelectorAll('div')].filter(d => /מתוך/.test(d.innerText || '') && d.children.length <= 3 && (d.innerText || '').length < 60).map(d => { const r = d.getBoundingClientRect(); return { t: d.innerText.replace(/\n/g, ' | '), x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), dir: getComputedStyle(d).direction }; }));
    const link = page.getByText('לפירוט היום');
    res.linkCount = await link.count();
    if (res.linkCount) { res.linkBox = await link.first().boundingBox(); }
  }
} catch (e) { res.err = String(e).slice(0, 500); }
res.errors = errors;
fs.writeFileSync(`${OUT}/${acc}-${mode}.json`, JSON.stringify(res, null, 1));
await ctx.storageState({ path: authFile });
await browser.close();
console.log('done', acc);

// QA #6f7aee T12: correct eaten share via meal card "לא אכלתי הכל?" and check tooltip without reload.
import { chromium } from 'playwright';
import fs from 'node:fs';
const acc = 'noa'; const OUT = '../research/shots/6f7aee'; const authFile = `../auth/${acc}.json`;
const step = process.argv[2] || 'open';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ storageState: authFile, viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, locale: 'he-IL', timezoneId: 'Asia/Jerusalem' });
const page = await ctx.newPage();
const res = { net: [] };
page.on('response', r => { const u = r.url(); if (/rpc|rest\/v1\/meals/.test(u) && r.request().method() !== 'GET') res.net.push(`${r.request().method()} ${r.status()} ${u.replace(/\?.*/, '')}`); });
const tip = async () => { await page.getByRole('button', { name: /קו היום/ }).click(); await page.getByText('לפירוט היום').waitFor({ timeout: 10000 }); return page.evaluate(() => { const l = [...document.querySelectorAll('div')].filter(d => (d.innerText || '').includes('לפירוט היום') && (d.innerText || '').includes('מתוך')); l.sort((a, c) => a.innerText.length - c.innerText.length); return l[0] && l[0].innerText; }); };
try {
  await page.goto('https://nutriwingman.expo.app/home', { waitUntil: 'networkidle', timeout: 30000 });
  await page.getByRole('button', { name: /קו היום/ }).waitFor({ timeout: 15000 });
  res.before = await tip();
  await page.keyboard.press('Escape'); await page.mouse.click(195, 100);
  await page.getByText('לפירוט היום').waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
  const btns = page.getByText('לא אכלתי הכל?');
  res.count = await btns.count();
  await btns.last().click();
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: `${OUT}/noa-t12-share-options.png` });
  res.opts = await page.evaluate(() => [...document.querySelectorAll('[role=button],button')].map(b => (b.innerText || b.getAttribute('aria-label') || '').trim()).filter(Boolean).slice(-15));
  const half = page.getByText(/^(חצי|50%|½)/).first();
  if (await half.count()) {
    await half.click(); res.clicked = await half.innerText().catch(() => 'half');
    const t1 = Date.now();
    const changed = await (async () => { await page.waitForLoadState('networkidle'); const tt = await tip(); return tt; })();
    res.afterFirstRead = changed; res.afterMs = Date.now() - t1;
    const ok = await page.waitForFunction(b => { const l = [...document.querySelectorAll('div')].filter(d => (d.innerText || '').includes('לפירוט היום') && (d.innerText || '').includes('מתוך')); l.sort((a, c) => a.innerText.length - c.innerText.length); return l[0] && l[0].innerText !== b; }, res.before, { timeout: 10000 }).then(() => true).catch(() => false);
    res.changed = ok; res.after = await page.evaluate(() => { const l = [...document.querySelectorAll('div')].filter(d => (d.innerText || '').includes('לפירוט היום') && (d.innerText || '').includes('מתוך')); l.sort((a, c) => a.innerText.length - c.innerText.length); return l[0] && l[0].innerText; });
    await page.screenshot({ path: `${OUT}/noa-t12-after.png` });
  }
} catch (e) { res.err = String(e).slice(0, 500); await page.screenshot({ path: `${OUT}/noa-t12-err.png` }).catch(() => {}); }
console.log(JSON.stringify(res, null, 1));
await ctx.storageState({ path: authFile });
await browser.close();

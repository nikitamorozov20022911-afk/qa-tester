// QA #6f7aee T11/T14: send a chat message, wait for Wingman answer, read tooltip before/after (no reload). Saves storageState back.
// usage: node qa-6f7aee-chat.mjs <account> "<message>" <tag>
import { chromium } from 'playwright';
import fs from 'node:fs';
const [acc, msg, tag] = process.argv.slice(2);
const OUT = '../research/shots/6f7aee';
const authFile = `../auth/${acc}.json`;
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ storageState: authFile, viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, locale: 'he-IL', timezoneId: 'Asia/Jerusalem' });
const page = await ctx.newPage();
const res = { net: [] };
page.on('response', r => { const u = r.url(); if (/functions\/v1\/chat|rest\/v1\/(meals|activities)/.test(u)) res.net.push(`${r.request().method()} ${r.status()} ${u.replace(/\?.*/, '')}`); });
const tipText = async () => { const line = page.getByRole('button', { name: /קו היום/ }); await line.click(); await page.getByText('לפירוט היום').waitFor({ timeout: 10000 }); const t = await page.evaluate(() => { const l = [...document.querySelectorAll('div')].filter(d => (d.innerText || '').includes('לפירוט היום') && (d.innerText || '').includes('מתוך')); l.sort((a, b) => a.innerText.length - b.innerText.length); return l[0] ? l[0].innerText : null; }); return t; };
const closeTip = async () => { await page.keyboard.press('Escape'); await page.mouse.click(195, 100); await page.getByText('לפירוט היום').waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {}); };
try {
  await page.goto('https://nutriwingman.expo.app/home', { waitUntil: 'networkidle', timeout: 30000 });
  await page.getByRole('button', { name: /קו היום/ }).waitFor({ timeout: 15000 });
  res.before = await tipText();
  await page.screenshot({ path: `${OUT}/${acc}-${tag}-before.png` });
  await closeTip();
  const bubbles0 = await page.evaluate(() => document.body.innerText.length);
  const box = page.getByPlaceholder(/לשאול או לספר/);
  await box.click(); await box.fill(msg);
  const t0 = Date.now();
  const chatResp = page.waitForResponse(r => /functions\/v1\/chat/.test(r.url()), { timeout: 60000 }).catch(e => null);
  await box.press('Enter');
  const cr = await chatResp; res.chatStatus = cr && cr.status(); res.chatMs = Date.now() - t0;
  // wait until the input is empty and page text grew (answer rendered)
  await page.waitForFunction(n => document.body.innerText.length > n + 20, bubbles0, { timeout: 30000 }).catch(() => { res.waitErr = 'no growth'; });
  await page.waitForLoadState('networkidle').catch(() => {});
  res.renderMs = Date.now() - t0;
  await page.screenshot({ path: `${OUT}/${acc}-${tag}-chat.png` });
  res.chatTail = (await page.evaluate(() => document.body.innerText)).slice(0, 1500);
  const t1 = Date.now();
  res.afterImmediate = await tipText(); res.afterTipMs = Date.now() - t1; const changed = await page.waitForFunction(b => { const l = [...document.querySelectorAll('div')].filter(d => (d.innerText || '').includes('לפירוט היום') && (d.innerText || '').includes('מתוך')); l.sort((a, c) => a.innerText.length - c.innerText.length); return l[0] && l[0].innerText !== b; }, res.before, { timeout: 10000 }).then(() => true).catch(() => false); res.changedWithin10s = changed; res.changeMs = Date.now() - t1; res.after = await page.evaluate(() => { const l = [...document.querySelectorAll('div')].filter(d => (d.innerText || '').includes('לפירוט היום') && (d.innerText || '').includes('מתוך')); l.sort((a, c) => a.innerText.length - c.innerText.length); return l[0] ? l[0].innerText : null; }); if (process.env.RELOAD) { await page.reload({ waitUntil: 'networkidle' }); res.afterReload = await tipText(); await page.screenshot({ path: OUT + '/' + acc + '-' + tag + '-reload.png' }); }
  await page.screenshot({ path: `${OUT}/${acc}-${tag}-after.png` });
} catch (e) { res.err = String(e).slice(0, 600); await page.screenshot({ path: `${OUT}/${acc}-${tag}-err.png` }).catch(() => {}); }
fs.writeFileSync(`${OUT}/${acc}-${tag}.json`, JSON.stringify(res, null, 1));
console.log(JSON.stringify(res, null, 1).slice(0, 6000));
await ctx.storageState({ path: authFile });
await browser.close();

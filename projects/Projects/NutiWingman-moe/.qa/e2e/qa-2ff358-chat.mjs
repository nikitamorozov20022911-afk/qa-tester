// QA #59ec51 AC1-6: one chat message on nogoal, capture chat response + activities today. Saves storageState back.
import { chromium } from 'playwright';
import fs from 'node:fs';
const [acc, msg] = process.argv.slice(2);
const authFile = `../auth/${acc}.json`;
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ storageState: authFile, viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, locale: 'he-IL', timezoneId: 'Asia/Jerusalem' });
const page = await ctx.newPage();
const res = { net: [] };
page.on('response', async r => { const u = r.url(); if (/functions\/v1\/chat|rest\/v1\/activities/.test(u)) { let b = ''; try { b = (await r.text()).slice(0, 1500); } catch {} res.net.push({ m: r.request().method(), s: r.status(), u: u.replace(/\?.*/, ''), b }); } });
try {
  await page.goto('https://nutriwingman.expo.app/home', { waitUntil: 'networkidle', timeout: 30000 });
  await page.getByRole('button', { name: /קו היום/ }).waitFor({ timeout: 15000 });
  const box = page.getByPlaceholder(/לשאול או לספר/);
  await box.click(); await box.fill(msg);
  const t0 = Date.now();
  const chatResp = page.waitForResponse(r => /functions\/v1\/chat/.test(r.url()), { timeout: 60000 }).catch(() => null);
  await box.press('Enter');
  const cr = await chatResp; res.chatStatus = cr && cr.status(); res.chatMs = Date.now() - t0;
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.getByText(msg).last().waitFor({ timeout: 10000 }).catch(() => {});
  res.after = await page.evaluate(() => fetch('about:blank').then(() => null)).catch(() => null);
  await page.screenshot({ path: `../screenshots/2ff358-T7-mobile.png` });
  res.text = (await page.evaluate(() => document.body.innerText)).slice(-1200);
} catch (e) { res.err = String(e).slice(0, 600); await page.screenshot({ path: `../screenshots/2ff358-T7-mobile-err.png` }).catch(() => {}); }
console.log(JSON.stringify(res, null, 1).slice(0, 8000));
await ctx.storageState({ path: authFile });
await browser.close();

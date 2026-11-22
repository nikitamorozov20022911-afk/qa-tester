// complete prayers on user2 at a faked past date: node u2-pray-date.mjs <ISO> <slot1,slot2,...>
import { chromium } from 'playwright';
import fs from 'fs';
const AUTH = new URL('../../auth/user2.json', import.meta.url).pathname;
const fake = new Date(process.argv[2]);
const slots = (process.argv[3] || 'shacharit').split(',');
const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: AUTH, viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();
const log = [];
page.on('request', q => { if (/prayer_completions/.test(q.url()) && q.method() === 'POST') log.push('BODY ' + JSON.parse(q.postData()).slot + ' ' + JSON.parse(q.postData()).completed_at); });
page.on('response', r => { if (/prayer_completions/.test(r.url()) && r.request().method() === 'POST') log.push('RESP ' + r.status()); });
try {
  // real time first: make sure token is fresh
  await page.goto('https://zichui-harabim.expo.app/home'); await page.waitForTimeout(6000);
  const exp = await page.evaluate(() => { const k = Object.keys(localStorage).find(k => /^sb-.+-auth-token$/.test(k)); return JSON.parse(localStorage.getItem(k)).expires_at; });
  if (exp * 1000 - Date.now() < 10 * 60000) throw new Error('token expires soon: ' + Math.round((exp * 1000 - Date.now()) / 60000) + ' min');
  await page.clock.setFixedTime(fake);
  for (const s of slots) {
    await page.goto(`https://zichui-harabim.expo.app/prayer/${s}_ashkenaz`); await page.waitForTimeout(4000);
    await page.getByRole('button', { name: 'סיים תפילה' }).click(); await page.waitForTimeout(4000);
  }
  await page.goto('https://zichui-harabim.expo.app/home'); await page.waitForTimeout(5000);
  const h = await page.locator('body').innerText();
  console.log(fake.toISOString(), 'HOME:', (h.match(/\d+\n(ימים רצופים|תפילות היום|סה״כ תפילות)/g) || []).join(' ; ').replace(/\n/g, ' '));
  console.log('NET:', log.join(' || '));
} finally {
  // restore real clock before saving so app state is consistent
  const ns = await ctx.storageState();
  const o = ns.origins.find(x => x.origin.includes('expo.app'));
  if (o && o.localStorage.some(i => i.name.includes('auth-token'))) fs.writeFileSync(AUTH, JSON.stringify(ns, null, 2));
  await browser.close();
}

// complete N prayers on user2 via «סיים תפילה»; journey key kept as-is in context
import { chromium } from 'playwright';
import fs from 'fs';
const AUTH = new URL('../../auth/user2.json', import.meta.url).pathname;
const SHOTS = new URL('../../screenshots/', import.meta.url).pathname;
const N = +(process.argv[2] || 1);
const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: AUTH, viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();
const log = [];
page.on('request', q => { if (/prayer_completions/.test(q.url()) && q.method()==='POST') log.push('BODY '+q.postData()); });
page.on('response', r => { const u = r.url(); if (/rest\/v1\/(rpc|prayer|completion|user_prayer)/i.test(u) && r.request().method() !== 'GET') log.push(`${r.request().method()} ${u.replace(/^https:\/\/[^/]+/, '').slice(0,90)} ${r.status()}`); });
try {
  for (let i = 1; i <= N; i++) {
    await page.goto('https://zichui-harabim.expo.app/prayer/' + (process.argv[3]||'mincha_ashkenaz') + ''); await page.waitForTimeout(4000);
    await page.getByRole('button', { name: 'סיים תפילה' }).click(); await page.waitForTimeout(4000);
    const t = (await page.locator('body').innerText()).replace(/\n+/g, ' | ');
    await page.screenshot({ path: `${SHOTS}22c9-u2-pray-${Date.now()}.png` });
    console.log(`#${i} url=${page.url()} :: ${t.slice(0, 260)}`);
    // close possible popups (achievement) without navigating away
    const close = page.locator('#milestone-window-close');
    if (await close.isVisible().catch(() => false)) { console.log('  popup visible -> close'); await close.click(); await page.waitForTimeout(1000); }
  }
  await page.goto('https://zichui-harabim.expo.app/home'); await page.waitForTimeout(5000);
  const h = await page.locator('body').innerText();
  console.log('HOME counters:', (h.match(/\d+\n(ימים רצופים|תפילות היום|סה״כ תפילות)/g) || []).join(' ; ').replace(/\n/g, ' '));
  console.log('NET:', log.join(' || '));
} finally {
  const ns = await ctx.storageState();
  const o = ns.origins.find(x => x.origin.includes('expo.app'));
  if (o && o.localStorage.some(i => i.name.includes('auth-token'))) fs.writeFileSync(AUTH, JSON.stringify(ns, null, 2));
  await browser.close();
}

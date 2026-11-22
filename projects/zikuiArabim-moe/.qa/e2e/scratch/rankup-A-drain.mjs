// device A: close queued windows one by one, record titles; then reload — rank-up must not appear
import { chromium } from 'playwright';
import fs from 'fs';
const AUTH = new URL('../../auth/user2.json', import.meta.url).pathname;
const SHOTS = new URL('../../screenshots/', import.meta.url).pathname;
const br = await chromium.launch();
const ctx = await br.newContext({ storageState: AUTH, viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();
const net = []; page.on('request', q => { if (/user_profiles/.test(q.url()) && q.method() !== 'GET') net.push(q.method() + ' ' + q.postData()); });
const seen = [];
try {
  for (const round of ['first', 'reload1', 'reload2']) {
    await page.goto('https://zichui-harabim.expo.app/journey'); await page.waitForTimeout(7000);
    for (let i = 0; i < 6; i++) {
      const w = page.locator('#milestone-window');
      if (!(await w.isVisible().catch(() => false))) break;
      const t = (await w.innerText()).replace(/\n+/g, ' | ');
      seen.push({ round, window: t.slice(0, 80) });
      await page.screenshot({ path: `${SHOTS}22c9-A-drain-${round}-${i}.png` });
      await page.locator('#milestone-window-close').click(); await page.waitForTimeout(2500);
    }
    seen.push({ round, end: 'no window', journey: await page.evaluate(() => localStorage.getItem('journey')) });
  }
  const ns = await ctx.storageState();
  const o = ns.origins.find(x => x.origin.includes('expo.app'));
  if (o && o.localStorage.some(i => i.name.includes('auth-token'))) fs.writeFileSync(AUTH, JSON.stringify(ns, null, 2));
} finally { await br.close(); }
console.log(JSON.stringify({ seen, net }, null, 1));

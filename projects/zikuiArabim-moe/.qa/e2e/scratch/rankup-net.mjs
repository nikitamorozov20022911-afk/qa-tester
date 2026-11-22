import { chromium } from 'playwright';
import fs from 'fs';
const role = process.argv[2] || 'user1';
const AUTH = new URL(`../../auth/${role}.json`, import.meta.url).pathname;
const orig = JSON.parse(fs.readFileSync(AUTH, 'utf8'));
const journeyOrig = orig.origins[0].localStorage.find(i => i.name === 'journey');
const state = JSON.parse(JSON.stringify(orig));
state.origins[0].localStorage = state.origins[0].localStorage.filter(i => i.name !== 'journey');
const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: state, viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();
const hits = [];
page.on('response', async r => {
  const u = r.url();
  if (/rest\/v1\//.test(u) && /(user_profiles|rung|rank|journey)/i.test(u) ) {
    let body = ''; try { body = (await r.text()).slice(0, 600); } catch {}
    hits.push({ m: r.request().method(), u: u.replace(/^https:\/\/[^/]+/, '').slice(0, 200), st: r.status(), body: /last_announced_rung/.test(body) ? body.match(/"last_announced_rung":[^,}]*/g) : body.slice(0,120), reqBody: r.request().postData()?.slice(0,200) });
  }
});
await page.goto('https://zichui-harabim.expo.app/journey'); await page.waitForTimeout(8000);
const txt = await page.locator('body').innerText();
const out = { role, url: page.url(), rankupShown: /עלית דרגה/.test(txt), rung: (txt.match(/דרגה \d+ מתוך \d+/) || [])[0], total: (txt.match(/(\d+)\nסה״?כ תפילות|(\d+)\nסה"כ תפילות/) || [])[0], hits };
const ns = await ctx.storageState();
const o = ns.origins.find(x => x.origin.includes('zichui-harabim.expo.app'));
if (o && o.localStorage.some(i => i.name.includes('auth-token'))) {
  o.localStorage = o.localStorage.filter(i => i.name !== 'journey');
  if (journeyOrig) o.localStorage.push(journeyOrig);
  fs.writeFileSync(AUTH, JSON.stringify(ns, null, 2)); out.saved = true;
}
await browser.close();
console.log(JSON.stringify(out, null, 1));

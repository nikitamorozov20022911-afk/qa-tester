// #22c9d541: after rank-up (10th prayer) — window once, cross-device
import { chromium, webkit } from 'playwright';
import fs from 'fs';
const AUTH = new URL('../../auth/user2.json', import.meta.url).pathname;
const SHOTS = new URL('../../screenshots/', import.meta.url).pathname;
const URLJ = 'https://zichui-harabim.expo.app/journey';
const st = JSON.parse(fs.readFileSync(AUTH, 'utf8'));
const clean = JSON.parse(JSON.stringify(st)); clean.origins.forEach(o => o.localStorage = o.localStorage.filter(i => i.name !== 'journey'));
const out = [];
const net = [];
const cr = await chromium.launch(); const wk = await webkit.launch();
async function dev(name, br, state) {
  const ctx = await br.newContext({ storageState: state, viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  page.on('request', q => { if (/user_profiles/.test(q.url()) && q.method() !== 'GET') net.push(`${name} ${q.method()} ${q.url().replace(/^https:\/\/[^/]+/, '').slice(0, 80)} ${q.postData()}`); });
  return { name, ctx, page };
}
async function look(d, label) {
  await d.page.waitForTimeout(7000);
  const txt = await d.page.locator('body').innerText();
  const shown = await d.page.locator('#milestone-window').isVisible().catch(() => false) || /עלית דרגה/.test(txt);
  const shot = `${SHOTS}22c9-${d.name}-${label}.png`;
  await d.page.screenshot({ path: shot });
  out.push({ dev: d.name, label, shown, rung: (txt.match(/דרגה \d+ מתוך \d+/) || [])[0], journey: await d.page.evaluate(() => localStorage.getItem('journey')), shot });
}
try {
  const A = await dev('A', cr, st);
  await A.page.goto(URLJ); await look(A, '1-after-rankup');
  const B = await dev('B', cr, clean);
  await B.page.goto(URLJ); await look(B, '2-A-open-not-closed');
  // close on A
  if (await A.page.locator('#milestone-window-close').isVisible().catch(() => false)) { await A.page.locator('#milestone-window-close').click(); await A.page.waitForTimeout(3000); out.push({ dev: 'A', label: 'closed' }); }
  await A.page.reload(); await look(A, '3-reload-after-close');
  // close on B too if it is open (state as user would)
  if (await B.page.locator('#milestone-window-close').isVisible().catch(() => false)) { await B.page.locator('#milestone-window-close').click(); await B.page.waitForTimeout(2000); out.push({ dev: 'B', label: 'closed' }); }
  await B.page.reload(); await look(B, '4-reload');
  const C = await dev('C-chromium', cr, clean); await C.page.goto(URLJ); await look(C, '5-clean');
  const W = await dev('W-webkit', wk, clean); await W.page.goto(URLJ); await look(W, '6-clean');
  await A.page.goto('https://zichui-harabim.expo.app/home'); await A.page.waitForTimeout(3000); await A.page.goto(URLJ); await look(A, '7-renav');
  const ns = await A.ctx.storageState();
  const o = ns.origins.find(x => x.origin.includes('expo.app'));
  if (o && o.localStorage.some(i => i.name.includes('auth-token'))) fs.writeFileSync(AUTH, JSON.stringify(ns, null, 2));
} finally { await cr.close(); await wk.close(); }
console.log(JSON.stringify({ out, net }, null, 1));

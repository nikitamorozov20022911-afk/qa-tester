// #22c9d541 run 2 (rank 2→3): A drains achievements -> rank-up must appear on A; leave open; B clean meanwhile; close A; C/W clean; B reload
import { chromium, webkit } from 'playwright';
import fs from 'fs';
const AUTH = new URL('../../auth/user2.json', import.meta.url).pathname;
const SHOTS = new URL('../../screenshots/', import.meta.url).pathname;
const URLJ = 'https://zichui-harabim.expo.app/journey';
const st = JSON.parse(fs.readFileSync(AUTH, 'utf8'));
const clean = JSON.parse(JSON.stringify(st)); clean.origins.forEach(o => o.localStorage = o.localStorage.filter(i => i.name !== 'journey'));
const log = []; const net = [];
const cr = await chromium.launch(); const wk = await webkit.launch();
async function dev(name, br, state) {
  const ctx = await br.newContext({ storageState: state, viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  page.on('request', q => { if (/user_profiles/.test(q.url()) && q.method() !== 'GET') net.push(`${name} ${q.method()} ${q.postData()}`); });
  return { name, ctx, page };
}
const win = d => d.page.locator('#milestone-window');
async function title(d) { return (await win(d).isVisible().catch(() => false)) ? (await win(d).innerText()).replace(/\n+/g, ' | ').slice(0, 70) : null; }
async function rankInfo(d) { const t = await d.page.locator('body').innerText(); return (t.match(/דרגה \d+ מתוך \d+/) || [])[0]; }
try {
  const A = await dev('A', cr, st);
  await A.page.goto(URLJ); await A.page.waitForTimeout(7000);
  log.push({ step: 'A open', rank: await rankInfo(A) });
  let rankUpOnA = false;
  for (let i = 0; i < 8; i++) {
    const t = await title(A); if (!t) break;
    await A.page.screenshot({ path: `${SHOTS}22c9-r2-A-${i}.png` });
    log.push({ step: `A window ${i}`, t });
    if (/עלית דרגה/.test(t)) { rankUpOnA = true; break; }   // leave rank-up open
    await A.page.locator('#milestone-window-close').click(); await A.page.waitForTimeout(3000);
  }
  log.push({ step: 'A rank-up appeared (left open)', rankUpOnA });
  const B = await dev('B', cr, clean);
  await B.page.goto(URLJ); await B.page.waitForTimeout(7000);
  const tb = await title(B); await B.page.screenshot({ path: `${SHOTS}22c9-r2-B-while-A-open.png` });
  log.push({ step: 'B clean while A rank-up open, not closed', t: tb, rank: await rankInfo(B) });
  if (rankUpOnA) { await A.page.locator('#milestone-window-close').click(); await A.page.waitForTimeout(3000); log.push({ step: 'A closed rank-up' }); }
  await A.page.reload(); await A.page.waitForTimeout(7000); log.push({ step: 'A reload', t: await title(A) });
  await B.page.reload(); await B.page.waitForTimeout(7000); log.push({ step: 'B reload (after A closed)', t: await title(B) });
  await B.page.screenshot({ path: `${SHOTS}22c9-r2-B-reload.png` });
  const C = await dev('C', cr, clean); await C.page.goto(URLJ); await C.page.waitForTimeout(7000); log.push({ step: 'C chromium clean', t: await title(C), rank: await rankInfo(C) });
  const W = await dev('W', wk, clean); await W.page.goto(URLJ); await W.page.waitForTimeout(7000); log.push({ step: 'W webkit clean', t: await title(W) });
  const ns = await A.ctx.storageState();
  const o = ns.origins.find(x => x.origin.includes('expo.app'));
  if (o && o.localStorage.some(i => i.name.includes('auth-token'))) fs.writeFileSync(AUTH, JSON.stringify(ns, null, 2));
} finally { await cr.close(); await wk.close(); }
console.log(JSON.stringify({ log, net }, null, 1));

// QA #40b652/#95ffe2: per-account home line + tooltip + client API dump. usage: node qa-40b652-run.mjs <acc|guest> [tag]
import { chromium } from 'playwright';
import fs from 'node:fs';
const acc = process.argv[2]; const tag = process.argv[3] || 'r1';
const OUT = '../research/shots/40b652';
const authFile = `../auth/${acc}.json`;
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ ...(acc === 'guest' ? {} : { storageState: authFile }), viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, locale: 'he-IL', timezoneId: 'Asia/Jerusalem' });
const page = await ctx.newPage();
const errors = []; page.on('console', m => { if (m.type() === 'error') errors.push(m.text().slice(0, 200)); });
const reqs = []; page.on('request', r => { const u = r.url(); if (/supabase\.co\/(rest|functions)/.test(u)) reqs.push(r.method() + ' ' + u.replace(/^https:\/\/[^/]+/, '').slice(0, 160)); });
const res = { acc, tag };
const lineInfo = () => page.evaluate(() => {
  const b = [...document.querySelectorAll('[aria-label]')].find(e => /קו היום/.test(e.getAttribute('aria-label')));
  if (!b) return null; const R = b.getBoundingClientRect();
  const els = [...b.querySelectorAll('*')].map(d => { const r = d.getBoundingClientRect(); const cs = getComputedStyle(d); return { tag: d.tagName, t: d.children.length ? '' : (d.textContent || '').trim().slice(0, 20), x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), bg: cs.backgroundColor, bc: cs.borderTopColor, bw: cs.borderTopWidth, fill: d.getAttribute('fill'), stroke: d.getAttribute('stroke') }; }).filter(o => o.w > 0 && o.h > 0 && (o.t || o.bg !== 'rgba(0, 0, 0, 0)' || o.fill || o.stroke || (o.bw !== '0px')));
  return { al: b.getAttribute('aria-label'), box: [R.x, R.y, R.width, R.height].map(Math.round), text: b.innerText, els };
});
try {
  await page.goto('https://nutriwingman.expo.app/home', { waitUntil: 'networkidle', timeout: 40000 });
  const line = page.getByRole('button', { name: /קו היום/ });
  try { await line.waitFor({ timeout: 15000 }); } catch { res.noLine = true; }
  res.browserNow = await page.evaluate(() => new Date().toString());
  await page.screenshot({ path: `${OUT}/${acc}-${tag}-home.png` });
  res.line = await lineInfo();
  res.trendCandidates = await page.evaluate(() => (document.body.innerText.match(/קלוריות|חלבון|מגמ/g) || []).length);
  res.api = await page.evaluate(async () => {
    const api = __r(807).api; const o = {};
    const safe = async (k, f) => { try { o[k] = await f(); } catch (e) { o[k] = { error: String(e && e.message || e) }; } };
    await safe('day', async () => { const d = await api.balance.getDay(); return { now: d.now, status: d.status, progress: d.progress, goal: d.goal, eaten: d.eaten, nutrients: d.nutrients, keyMetrics: d.keyMetrics, advice: d.advice, meals: (d.meals || []).map(m => m.time + ' ' + m.title) }; });
    await safe('profile', async () => { const p = await api.profile.get?.(); return p ? { goal: p.goal, medical: p.medical, dietStyle: p.dietStyle, keys: Object.keys(p) } : null; });
    for (const [k, r] of Object.entries({ day: { kind: 'day' }, week: { kind: 'week' }, month: { kind: 'month' }, year: { kind: 'year' }, custom: { kind: 'custom', from: '2026-11-01', to: '2026-11-10' }, dayPast: { kind: 'day', date: '2026-11-10' },
      bad_fromGtTo: { kind: 'custom', from: '2026-11-10', to: '2026-11-01' }, bad_future: { kind: 'custom', from: '2026-11-01', to: '2026-12-31' }, bad_tooLong: { kind: 'custom', from: '2025-01-01', to: '2026-11-10' }, bad_notDate: { kind: 'custom', from: 'abc', to: '2026-11-10' }, bad_kind: { kind: 'decade' }, bad_dayFuture: { kind: 'day', date: '2026-12-01' }, bad_feb30: { kind: 'custom', from: '2026-02-30', to: '2026-03-01' } }))
      await safe('t_' + k, async () => { const t = await api.trends.getTrends(r); return { range: t.range, daysWithData: t.daysWithData, minDays: t.minDays, enoughData: t.enoughData, notEnoughReason: t.notEnoughReason, metrics: t.metrics, home: (t.home || []).map(m => m.key + ':' + m.status), activity: t.activity }; });
    return o;
  });
  if (!res.noLine) {
    await line.click();
    const t0 = Date.now();
    try { await page.getByText(/מתוך|לקבוע יעד|יעד/).first().waitFor({ timeout: 10000 }); res.tipMs = Date.now() - t0; } catch { res.tipErr = 'nothing in 10s'; }
    await page.screenshot({ path: `${OUT}/${acc}-${tag}-tooltip.png` });
    res.tipText = (await page.evaluate(() => document.body.innerText)).slice(-1500);
    res.lineAfter = await lineInfo();
    const setGoal = page.getByText('לקבוע יעד');
    res.setGoalCount = await setGoal.count();
    if (res.setGoalCount && process.argv[4] === 'clickgoal') {
      res.setGoalBox = await setGoal.first().boundingBox();
      await setGoal.first().click();
      await page.waitForLoadState('networkidle').catch(() => {});
      await page.screenshot({ path: `${OUT}/${acc}-${tag}-after-setgoal.png` });
      res.afterSetGoalUrl = page.url(); res.afterSetGoalText = (await page.evaluate(() => document.body.innerText)).slice(-1500);
    }
  }
} catch (e) { res.err = String(e).slice(0, 600); }
res.errors = errors; res.reqs = [...new Set(reqs)];
fs.writeFileSync(`${OUT}/${acc}-${tag}.json`, JSON.stringify(res, null, 1));
if (acc !== 'guest') await ctx.storageState({ path: authFile });
await browser.close(); console.log('done', acc, tag, res.err || '');

// Independent verifier for #40b652/#95ffe2. usage: node qa-verify-v.mjs <acc> <tag> [api] [tip]
import { chromium } from 'playwright';
import fs from 'node:fs';
const [acc, tag = 'v1', ...flags] = process.argv.slice(2);
const OUT = '../research/shots/40b652-v'; fs.mkdirSync(OUT, { recursive: true });
const authFile = `../auth/${acc}.json`;
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ storageState: authFile, viewport: { width: 390, height: 844 }, deviceScaleFactor: +(process.env.DPR||2), locale: 'he-IL', timezoneId: 'Asia/Jerusalem' });
const page = await ctx.newPage();
const res = { acc, tag };
try {
  await page.goto('https://nutriwingman.expo.app/home', { waitUntil: 'domcontentloaded', timeout: 40000 });
  const line = page.getByRole('button', { name: /קו היום/ });
  await line.waitFor({ timeout: 25000 });
  await page.waitForLoadState('networkidle').catch(() => {});
  res.now = await page.evaluate(() => new Date().toTimeString().slice(0, 5));
  res.url = page.url();
  const lines = await page.getByRole('button', { name: /קו היום/ }).count(); res.lineCount = lines;
  res.line = await page.evaluate(() => {
    const b = [...document.querySelectorAll('[aria-label]')].find(e => /קו היום/.test(e.getAttribute('aria-label')));
    const R = b.getBoundingClientRect();
    const els = [...b.querySelectorAll('*')].map(d => { const r = d.getBoundingClientRect(); const cs = getComputedStyle(d); return { tag: d.tagName, t: d.children.length ? '' : (d.textContent || '').trim().slice(0, 20), x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1), bg: cs.backgroundColor, bgi: cs.backgroundImage !== 'none' ? cs.backgroundImage.slice(0, 120) : undefined, fill: d.getAttribute('fill'), stroke: d.getAttribute('stroke') }; })
      .filter(o => o.w > 0 && o.h > 0 && (o.t || o.bg !== 'rgba(0, 0, 0, 0)' || o.bgi || o.fill || o.stroke));
    return { box: [R.x, R.y, R.width, R.height].map(Math.round), els };
  });
  const shot = `${OUT}/${acc}-${tag}-home.png`;
  await page.screenshot({ path: shot });
  // pixel-sample dot centers + track right next to each dot, from the real screenshot
  const dots = res.line.els.filter(e => e.tag === 'DIV' && e.w <= 6 && e.h <= 6);
  const b64 = fs.readFileSync(shot).toString('base64');
  res.dotPixels = await page.evaluate(async ({ b64, dots }) => {
    const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
    const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const g = c.getContext('2d'); g.drawImage(img, 0, 0);
    const px = (x, y) => { const d = g.getImageData(Math.round(x * DPR), Math.round(y * DPR), 1, 1).data; return '#' + [d[0], d[1], d[2]].map(v => v.toString(16).padStart(2, '0')).join(''); };
    const DPR=img.width/390; return dots.map(d => ({ x: d.x, cssBg: d.bg, center: px(d.x + d.w / 2, d.y + d.h / 2), trackBeside: px(d.x + d.w + 2.5, d.y + d.h / 2) }));
  }, { b64, dots });
  res.bodyHasTopMetric = await page.evaluate(() => { const t = document.body.innerText; return { kcal: (t.match(/קלוריות/g) || []).length, protein: (t.match(/חלבון/g) || []).length }; });
  if (flags.includes('api')) {
    res.api = await page.evaluate(async () => {
      const api = __r(807).api; const o = {};
      const safe = async (k, f) => { try { o[k] = await f(); } catch (e) { o[k] = { error: String(e && e.message || e) }; } };
      await safe('day', async () => { const d = await api.balance.getDay(); return { status: d.status, goal: d.goal, eaten: d.eaten, keyMetrics: d.keyMetrics, meals: (d.meals || []).map(m => m.time) }; });
      const R = { day: { kind: 'day' }, week: { kind: 'week' }, month: { kind: 'month' }, year: { kind: 'year' }, custom: { kind: 'custom', from: '2026-11-01', to: '2026-11-10' }, custom1: { kind: 'custom', from: '2026-11-11', to: '2026-11-11' },
        bad_fromGtTo: { kind: 'custom', from: '2026-11-10', to: '2026-11-01' }, bad_future: { kind: 'custom', from: '2026-11-01', to: '2026-11-20' }, bad_tooLong: { kind: 'custom', from: '2025-01-01', to: '2026-11-10' }, bad_notDate: { kind: 'custom', from: '11/01/2026', to: '2026-11-10' }, bad_kind: { kind: 'quarter' }, bad_dayFuture: { kind: 'day', date: '2026-11-12' }, bad_apr31: { kind: 'custom', from: '2026-04-31', to: '2026-05-02' }, bad_noTo: { kind: 'custom', from: '2026-11-01' } };
      for (const [k, r] of Object.entries(R)) await safe('t_' + k, async () => { const t = await api.trends.getTrends(r); return { range: t.range, dwd: t.daysWithData, min: t.minDays, enough: t.enoughData, reason: t.notEnoughReason, home: (t.home || []).map(m => m.key + ':' + m.status), metrics: (t.metrics || []).map(m => ({ k: m.key, v: m.value, t: m.target, s: m.status, r: m.reason, d: m.days })) }; });
      return o;
    });
  }
  if (flags.includes('tip')) {
    await line.click();
    try { await page.getByText(/מתוך|לקבוע יעד/).first().waitFor({ timeout: 10000 }); } catch { res.tipErr = 'no tooltip 10s'; }
    await page.screenshot({ path: `${OUT}/${acc}-${tag}-tip.png` });
    res.tipText = (await page.evaluate(() => document.body.innerText)).slice(-700);
  }
} catch (e) { res.err = String(e).slice(0, 500); await page.screenshot({ path: `${OUT}/${acc}-${tag}-err.png` }).catch(() => {}); }
fs.writeFileSync(`${OUT}/${acc}-${tag}.json`, JSON.stringify(res, null, 1));
await ctx.storageState({ path: authFile });
await browser.close(); console.log('done', acc, tag, res.err || '');

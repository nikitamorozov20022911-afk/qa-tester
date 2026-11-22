// QA #40b652 AC6 on throwaway guest (anonymous): set goal via line card, then log meal via chat, observe line update.
import { chromium } from 'playwright';
import fs from 'node:fs';
const OUT = '../research/shots/40b652'; const tag = process.argv[2] || 'g1';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, locale: 'he-IL', timezoneId: 'Asia/Jerusalem' });
const page = await ctx.newPage(); const res = { steps: [] };
const errors = []; page.on('console', m => { if (m.type() === 'error') errors.push(m.text().slice(0, 200)); });
const line = () => page.getByRole('button', { name: /קו היום/ });
const dot = () => page.evaluate(() => { const b = [...document.querySelectorAll('[aria-label]')].find(e => /קו היום/.test(e.getAttribute('aria-label'))); const c = b && [...b.querySelectorAll('circle')].find(c => c.getBoundingClientRect().width > 15); const meals = b ? [...b.querySelectorAll('div')].filter(d => { const r = d.getBoundingClientRect(); return r.width === 4 && r.height === 4; }).length : -1; return { dot: c && c.getAttribute('fill'), mealDots: meals }; });
const snap = async (n) => { await page.screenshot({ path: `${OUT}/guest-${tag}-${n}.png` }); res.steps.push({ n, ...(await dot()), text: (await page.evaluate(() => document.body.innerText)).slice(-700) }); };
try {
  await page.goto('https://nutriwingman.expo.app/home', { waitUntil: 'networkidle', timeout: 40000 });
  await line().waitFor({ timeout: 15000 });
  await snap('0-home');
  await line().click(); await page.getByText('לקבוע יעד').waitFor({ timeout: 10000 });
  await page.getByText('לקבוע יעד').click(); await page.waitForTimeout(0);
  await page.getByText(/שאלה \d מתוך \d/).waitFor({ timeout: 10000 });
  await snap('1-q');
  // answer up to 6 questions: pick first option row in the sheet each time
  for (let i = 0; i < 6; i++) {
    const q = await page.getByText(/שאלה \d מתוך \d/).first().textContent().catch(() => null);
    if (!q) break;
    res.steps.push({ q });
    const opt = page.getByText(/^(לרדת במשקל|אישה|גבר|לא|אין|ללא|כלום|בינונית|מתונה|לא בהריון|אף אחד).*$/).first();
    if (await opt.count()) { const t = await opt.textContent(); res.steps.push({ pick: t }); await opt.click(); }
    else { await snap('q-unknown-' + i); break; }
    await page.waitForLoadState('networkidle').catch(() => {});
    if (!(await page.getByText(/שאלה \d מתוך \d/).count())) break;
    const q2 = await page.getByText(/שאלה \d מתוך \d/).first().textContent().catch(() => null);
    if (q2 === q) { await snap('stuck-' + i); break; }
  }
  await page.waitForLoadState('networkidle').catch(() => {});
  const tg=Date.now(); try { await page.waitForFunction(() => { const b=[...document.querySelectorAll('[aria-label]')].find(e=>/קו היום/.test(e.getAttribute('aria-label'))); const c=b&&[...b.querySelectorAll('circle')].find(c=>c.getBoundingClientRect().width>15); return c && c.getAttribute('fill')!=='#7a828d'; }, null, { timeout: 20000 }); res.goalLineMs = Date.now()-tg; } catch { res.goalLineErr='line still grey 20s after goal pick'; }
  await snap('2-after-goal');
  res.day1 = await page.evaluate(async () => { const d = await __r(807).api.balance.getDay(); return { status: d.status, goal: d.goal, eaten: d.eaten }; });
  // log meal via chat
  const input = page.getByPlaceholder(/לשאול או לספר/);
  await input.fill('אכלתי עכשיו צלחת פסטה ברוטב עגבניות'); await input.press('Enter');
  const t0 = Date.now();
  try { await page.waitForFunction(() => { const b = [...document.querySelectorAll('[aria-label]')].find(e => /קו היום/.test(e.getAttribute('aria-label'))); return b && [...b.querySelectorAll('div')].some(d => { const r = d.getBoundingClientRect(); return r.width === 4 && r.height === 4; }); }, null, { timeout: 60000 }); res.mealDotMs = Date.now() - t0; } catch { res.mealDotErr = 'no meal dot in 60s'; }
  await snap('3-after-meal');
  res.day2 = await page.evaluate(async () => { const d = await __r(807).api.balance.getDay(); return { status: d.status, eaten: d.eaten, meals: d.meals.map(m => m.time + ' ' + m.title), advice: d.advice }; });
  await line().click(); await page.waitForTimeout(0); await page.getByText(/מתוך/).first().waitFor({ timeout: 10000 }).catch(() => {});
  await snap('4-tooltip');
} catch (e) { res.err = String(e).slice(0, 600); await page.screenshot({ path: `${OUT}/guest-${tag}-err.png` }); }
res.errors = errors; fs.writeFileSync(`${OUT}/guest-${tag}.json`, JSON.stringify(res, null, 1)); await browser.close(); console.log('done', res.err || '');

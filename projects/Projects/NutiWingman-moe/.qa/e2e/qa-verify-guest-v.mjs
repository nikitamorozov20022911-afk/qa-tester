import { chromium } from 'playwright'; import fs from 'node:fs';
const OUT = '../research/shots/40b652-v'; const res = { steps: [] };
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, locale: 'he-IL', timezoneId: 'Asia/Jerusalem' });
const page = await ctx.newPage();
const line = () => page.getByRole('button', { name: /קו היום/ });
const st = () => page.evaluate(() => { const b = [...document.querySelectorAll('[aria-label]')].find(e => /קו היום/.test(e.getAttribute('aria-label'))); const c = b && [...b.querySelectorAll('circle')].find(c => c.getBoundingClientRect().width > 15); const dots = b ? [...b.querySelectorAll('div')].filter(d => { const r = d.getBoundingClientRect(); return r.width === 4 && r.height === 4; }).length : -1; return { fill: c && c.getAttribute('fill'), dots }; });
const snap = async (n) => { await page.screenshot({ path: `${OUT}/guest-v-${n}.png` }); res.steps.push({ n, ...(await st()) }); };
try {
  await page.goto('https://nutriwingman.expo.app/home', { waitUntil: 'networkidle', timeout: 40000 }); await line().waitFor({ timeout: 20000 });
  await snap('0-home');
  await line().click(); await page.getByText('לקבוע יעד').click(); await page.getByText('לרדת במשקל').click();
  await page.waitForFunction(() => { const b = [...document.querySelectorAll('[aria-label]')].find(e => /קו היום/.test(e.getAttribute('aria-label'))); const c = b && [...b.querySelectorAll('circle')].find(c => c.getBoundingClientRect().width > 15); return c && c.getAttribute('fill') !== '#7a828d'; }, null, { timeout: 20000 });
  await snap('1-after-goal');
  res.day1 = await page.evaluate(async () => { const d = await __r(807).api.balance.getDay(); return { status: d.status, eaten: d.eaten.kcal, target: d.goal && d.goal.targets.kcal }; });
  if (await page.getByText('עוד כמה פרטים?').count()) { const x = page.getByRole('button', { name: /סגור|close/i }); if (await x.count()) await x.first().click(); else await page.mouse.click(44, 343); await page.getByText('עוד כמה פרטים?').waitFor({ state: 'hidden', timeout: 5000 }).catch(() => { res.sheetStillOpen = true; }); }
  const input = page.getByPlaceholder(/לשאול או לספר/);
  await input.fill('אכלתי עכשיו צלחת פסטה ברוטב עגבניות'); await input.press('Enter');
  const t0 = Date.now();
  await page.waitForFunction(() => { const b = [...document.querySelectorAll('[aria-label]')].find(e => /קו היום/.test(e.getAttribute('aria-label'))); return b && [...b.querySelectorAll('div')].some(d => { const r = d.getBoundingClientRect(); return r.width === 4 && r.height === 4; }); }, null, { timeout: 90000 }).then(() => res.mealDotMs = Date.now() - t0, () => res.mealDotErr = 'no dot 90s');
  await snap('2-after-chat-meal');
  res.day2 = await page.evaluate(async () => { const d = await __r(807).api.balance.getDay(); return { status: d.status, eaten: d.eaten.kcal, meals: d.meals.map(m => m.time + ' ' + m.title) }; });
  await line().click(); await page.getByText(/מתוך/).first().waitFor({ timeout: 10000 }).catch(() => {});
  await page.screenshot({ path: `${OUT}/guest-v-3-tip-after-chat.png` });
  res.tip2 = (await page.evaluate(() => document.body.innerText)).slice(-350);
  // top up to ~1000 kcal for green check
  const need = Math.max(0, 1000 - res.day2.eaten);
  if (need > 0) res.log = await page.evaluate(async (k) => { const d = await __r(807).api.balance.logMeal({ title: 'QA guest top-up', nutrients: { kcal: k, protein: 30, fat: 20, fiber: 8, carbs: 80 } }); return { status: d.status, eaten: d.eaten.kcal }; }, need);
  await page.reload({ waitUntil: 'networkidle' }); await line().waitFor();
  await snap('4-at-1000');
  await line().click(); await page.getByText(/מתוך/).first().waitFor({ timeout: 10000 }).catch(() => {});
  await page.screenshot({ path: `${OUT}/guest-v-5-tip-1000.png` });
  res.tip3 = (await page.evaluate(() => document.body.innerText)).slice(-350);
  res.trend = await page.evaluate(async () => (await __r(807).api.trends.getTrends({ kind: 'day' })).home.map(m => m.key + ':' + m.status + ':' + m.reason));
} catch (e) { res.err = String(e).slice(0, 500); await page.screenshot({ path: `${OUT}/guest-v-err.png` }); }
fs.writeFileSync(`${OUT}/guest-v.json`, JSON.stringify(res, null, 1)); console.log(JSON.stringify(res, null, 1)); await browser.close();

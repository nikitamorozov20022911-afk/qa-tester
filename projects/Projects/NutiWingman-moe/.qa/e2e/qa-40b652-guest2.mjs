// guest throwaway: goal -> meal 1000 kcal (green?) -> +1000 (over/purple?) ; screenshots of line+tooltip
import { chromium } from 'playwright'; import fs from 'node:fs';
const OUT = '../research/shots/40b652'; const res = {};
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, locale: 'he-IL', timezoneId: 'Asia/Jerusalem' });
const page = await ctx.newPage();
const line = () => page.getByRole('button', { name: /קו היום/ });
const fill = () => page.evaluate(() => { const b = [...document.querySelectorAll('[aria-label]')].find(e => /קו היום/.test(e.getAttribute('aria-label'))); const c = b && [...b.querySelectorAll('circle')].find(c => c.getBoundingClientRect().width > 15); return c && c.getAttribute('fill'); });
const waitFill = async (not) => { await page.waitForFunction((n) => { const b = [...document.querySelectorAll('[aria-label]')].find(e => /קו היום/.test(e.getAttribute('aria-label'))); const c = b && [...b.querySelectorAll('circle')].find(c => c.getBoundingClientRect().width > 15); return c && c.getAttribute('fill') !== n; }, not, { timeout: 20000 }); };
try {
  await page.goto('https://nutriwingman.expo.app/home', { waitUntil: 'networkidle' }); await line().waitFor();
  await line().click(); await page.getByText('לקבוע יעד').click(); await page.getByText('לרדת במשקל').click();
  await waitFill('#7a828d'); res.afterGoal = await fill();
  for (const [n, kcal] of [['green', 1000], ['over', 1000]]) {
    res['log_' + n] = await page.evaluate(async (k) => { const d = await __r(807).api.balance.logMeal({ title: 'QA guest ' + k, nutrients: { kcal: k, protein: 40, fat: 30, fiber: 10, carbs: 100 } }); return { status: d.status, eaten: d.eaten.kcal, target: d.goal && d.goal.targets.kcal, progress: d.progress }; }, kcal);
    await page.reload({ waitUntil: 'networkidle' }); await line().waitFor();
    res['fill_' + n] = await fill();
    await page.screenshot({ path: `${OUT}/guest-states-${n}-home.png` });
    await line().click(); await page.getByText(/מתוך/).first().waitFor({ timeout: 10000 }).catch(() => {});
    await page.screenshot({ path: `${OUT}/guest-states-${n}-tooltip.png` });
    res['tip_' + n] = (await page.evaluate(() => document.body.innerText)).split('כניסה').pop().slice(0, 600);
    res['trend_' + n] = await page.evaluate(async () => { const t = await __r(807).api.trends.getTrends({ kind: 'day' }); return t.home.map(m => m.key + ':' + m.status + ':' + m.reason); });
  }
} catch (e) { res.err = String(e).slice(0, 500); await page.screenshot({ path: `${OUT}/guest-states-err.png` }); }
fs.writeFileSync(`${OUT}/guest-states.json`, JSON.stringify(res, null, 1)); console.log(JSON.stringify(res, null, 1)); await browser.close();

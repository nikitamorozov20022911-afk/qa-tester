// Перепроверка #3bd4f2 AC4: поле кода Affiliate при регистрации и обработка ?ref=/?affiliate=/?code=
// node qa-3bd4f2-verify.mjs <run#> <locale>   (гостевой контекст, без storageState; email не вводится)
import { chromium } from 'playwright'; import fs from 'node:fs';
const [run = '1', locale = 'he-IL'] = process.argv.slice(2);
const OUT = '../research/shots/3bd4f2-v'; fs.mkdirSync(OUT, { recursive: true });
const TAG = 'QAREF' + run + (locale.startsWith('he') ? 'H' : 'E');
const tag = `${run}-${locale}`;
const res = { run, locale, TAG, reqHits: [], steps: [] };
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, locale, timezoneId: 'Asia/Jerusalem' });
const page = await ctx.newPage();
page.on('request', r => { const s = r.url() + ' ' + (r.postData() || ''); if (s.includes(TAG)) res.reqHits.push(r.method() + ' ' + r.url().slice(0, 200)); });
const allReq = []; page.on('request', r => { if (/supabase/.test(r.url())) allReq.push(r.method() + ' ' + r.url().replace(/\?.*/, '')); });
const inputs = () => page.evaluate(() => [...document.querySelectorAll('input,textarea,select')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; }).map(e => { const r = e.getBoundingClientRect(); return { tag: e.tagName, type: e.type, ph: e.placeholder, aria: e.getAttribute('aria-label'), name: e.name, rect: [r.x, r.y, r.width, r.height].map(Math.round) }; }));
try {
  await page.goto(`https://nutriwingman.expo.app/?ref=${TAG}&affiliate=${TAG}&code=${TAG}&referral=${TAG}`, { waitUntil: 'networkidle', timeout: 45000 });
  res.urlAfterLoad = page.url();
  await page.screenshot({ path: `${OUT}/${tag}-0-landing.png` });
  res.landingText = (await page.evaluate(() => document.body.innerText)).slice(0, 400);
  const login = page.getByText(/^(כניסה|Log in|Sign in|התחברות)$/).first();
  await login.waitFor({ timeout: 20000 });
  await login.click();
  const em = page.getByText(/המשך עם אימייל|Continue with email/i).first();
  await em.waitFor({ timeout: 15000 });
  await page.screenshot({ path: `${OUT}/${tag}-1-login-sheet.png` });
  res.sheetText = (await page.evaluate(() => document.body.innerText)).slice(-600);
  await em.click();
  await page.locator('input').first().waitFor({ timeout: 15000 });
  res.form = await inputs();
  res.formText = (await page.evaluate(() => document.body.innerText)).slice(-600);
  await page.screenshot({ path: `${OUT}/${tag}-2-email-form.png` });
  res.dir = await page.evaluate(() => getComputedStyle(document.body).direction + '/' + document.documentElement.lang);
  res.ls = await page.evaluate((t) => Object.keys(localStorage).map(k => ({ k, hit: (localStorage.getItem(k) || '').includes(t) })), TAG);
  res.ssHit = await page.evaluate((t) => Object.keys(sessionStorage).filter(k => (sessionStorage.getItem(k) || '').includes(t)), TAG);
  res.cookieHit = (await ctx.cookies()).filter(c => c.value.includes(TAG)).map(c => c.name);
} catch (e) { res.err = String(e).slice(0, 400); await page.screenshot({ path: `${OUT}/${tag}-err.png` }); res.errText = (await page.evaluate(() => document.body.innerText)).slice(0, 800); }
res.supabaseReq = [...new Set(allReq)];
fs.writeFileSync(`${OUT}/${tag}.json`, JSON.stringify(res, null, 1)); console.log(JSON.stringify(res, null, 1)); await browser.close();

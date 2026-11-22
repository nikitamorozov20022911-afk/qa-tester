// #1846ecd8 run script. env: RUN=r1|r2  W=375|1440  STEPS=A,B,D (A=providers path + חזרה, B=deals path + reload/back, D=double click+slow, V=validation, P=provider view)
import * as L from './qa1846-lib.mjs';
import fs from 'fs';
const RUN = process.env.RUN || 'r1';
const W = +(process.env.W || 375);
const H = W < 768 ? 812 : 900;
const DEV = W < 768 ? 'mobile' : 'desktop';
const STEPS = (process.env.STEPS || 'A,B,D,V').split(',');
const OUT = `${L.QA}/screenshots/1846ecd8/${RUN}-${DEV}-log.json`;
const log = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT)) : {};
const save = () => fs.writeFileSync(OUT, JSON.stringify(log, null, 2));
const SHIRA = 'שירה כהן — שיפוצים וניקיון · בדיקה';
const START = '05/10/2026', END = '12/10/2026';

const b = await L.newBrowser();
const { p } = await L.ctx(b, 'client', W, H);
p.setDefaultTimeout(15000);
const navs = [];
p.on('framenavigated', (f) => { if (f === p.mainFrame()) navs.push(f.url()); });

async function details(prefix) {
  await L.sleep(3500);
  const t = await L.visText(p);
  const lines = t.split('\n').filter(Boolean);
  const btns = await p.evaluate(() => [...document.querySelectorAll('[role=button],button')].filter((e) => e.offsetParent).map((e) => `${(e.innerText || e.getAttribute('aria-label') || '').trim().replace(/\n/g, ' / ')}${e.getAttribute('aria-disabled') === 'true' || e.disabled ? '[disabled]' : ''}`).filter(Boolean));
  const overflow = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth }));
  return { url: p.url(), lines: lines.slice(0, 80), btns, overflow };
}

async function listInfo(title) {
  await L.sleep(3000);
  const t = await L.visText(p);
  const occ = t.split(title).length - 1;
  const groups = t.split('\n');
  let group = null, cur = null; const heads = ['דורש פעולה', 'פעילות', 'במחלוקת', 'הושלמו / בוטלו'];
  for (const [i, l] of groups.entries()) { if (heads.includes(l) && i > 12) cur = l; if (l.includes(title)) { group = cur; break; } }
  const idx = groups.findIndex((l) => l.includes(title));
  return { url: p.url(), occurrences: occ, group, row: idx >= 0 ? groups.slice(idx, idx + 4) : null, count1846: (t.match(/QA 1846/g) || []).length };
}

async function create(title, amount, clickMode = 'single') {
  p._req.length = 0; p._console.length = 0; navs.length = 0;
  const before = p.url();
  const btn = await L.submitBtn(p);
  const t0 = Date.now();
  if (clickMode === 'double') { await btn.dblclick(); await btn.click({ timeout: 1500 }).catch((e) => log[`${title}-thirdclick`] = 'third click failed: ' + e.message.slice(0, 80)); }
  else await btn.click();
  // early state
  await L.sleep(300);
  const early = { url: p.url(), btn: await btn.isVisible().catch(() => false) ? await btn.innerText().catch(() => null) : 'gone', disabled: await btn.isDisabled().catch(() => null) };
  await L.shot(p, `${RUN}-${title.replace(/[^0-9A-Za-z]+/g, '_')}-early-${DEV}`);
  await p.waitForURL((u) => /\/deals\/[0-9a-f-]{20,}/.test(u.toString()), { timeout: 20000 }).catch(() => {});
  const ms = Date.now() - t0;
  return { before, early, ms, navs: [...navs], posts: p._req.filter((r) => !/sentry|analytics|log/.test(r)) };
}

try {
  // ---------- A: providers path
  if (STEPS.includes('A')) {
    const title = `QA 1846 ${L.hhmm()} ${RUN}A`;
    const r = (log.A = { title, amount: 500 });
    await p.goto(L.BASE + '/deals'); await L.sleep(4000);
    r.listBefore = await listInfo('QA 1846');
    await p.getByRole('tab', { name: 'נותני שירות' }).click(); await L.sleep(2500);
    r.providersUrl = p.url();
    await p.getByRole('button', { name: SHIRA }).first().click(); await L.sleep(3000);
    r.providerUrl = p.url();
    await L.shot(p, `${RUN}-A1-provider-page-${DEV}`);
    await p.getByRole('button', { name: 'פתיחת עסקה בטוחה' }).first().click(); await L.sleep(3000);
    r.formUrl = p.url();
    r.formRecipient = await p.getByRole('button', { name: SHIRA }).count();
    r.btnDisabledEmpty = await (await L.submitBtn(p)).isDisabled();
    await L.fillForm(p, { title, terms: 'QA 1846 תנאים: שיפוץ קל וניקיון', amount: 500, start: START, end: END });
    r.btnDisabledFilled = await (await L.submitBtn(p)).isDisabled();
    await L.shot(p, `${RUN}-A2-form-filled-${DEV}`);
    r.create = await create(title, 500);
    r.details = await details();
    await L.shot(p, `${RUN}-A3-details-${DEV}`);
    await p.screenshot({ path: `${L.SS}/${RUN}-A3-details-full-${DEV}.png`, fullPage: true });
    r.console = [...p._console];
    // חזרה
    // scroll inner content to bottom for full view
    await p.evaluate(() => { document.querySelectorAll('*').forEach((e) => { if (e.scrollHeight > e.clientHeight + 50 && getComputedStyle(e).overflowY !== 'visible') e.scrollTop = 99999; }); });
    await L.sleep(800); await L.shot(p, `${RUN}-A3b-details-bottom-${DEV}`);
    await L.redBox(p, p.getByRole('button', { name: 'חזרה' }), `${RUN}-A3c-details-back-btn-${DEV}`);
    navs.length = 0;
    await p.getByRole('button', { name: 'חזרה' }).first().click();
    r.afterBack = await listInfo(title);
    r.afterBack.navs = [...navs];
    const row = p.getByText(title).first();
    await L.redBox(p, (await row.count()) ? row : p.getByText(SHIRA), `${RUN}-A4-after-chazara-${DEV}`);
    // in-app back once more and browser back
    await p.goBack(); await L.sleep(3000); r.browserBackAfterChazara = p.url();
    // reopen created deal from list and test browser back from details
    await p.goto(L.BASE + '/deals'); r.listCheck = await listInfo(title);
    await L.redBox(p, p.getByText(title), `${RUN}-A5-list-has-deal-${DEV}`);
    save();
  }
  // ---------- B: deals path + reload/back
  if (STEPS.includes('B')) {
    const title = `QA 1846 ${L.hhmm()} ${RUN}B`;
    const r = (log.B = { title, amount: 650 });
    await p.goto(L.BASE + '/wallet'); await L.sleep(3000);
    await p.getByRole('tab', { name: 'עסקאות' }).click(); await L.sleep(3000);
    r.dealsUrl = p.url();
    await p.getByText('עסקה בטוחה', { exact: true }).first().click(); await L.sleep(3000);
    r.formUrl = p.url();
    r.role = await p.getByRole('button', { name: 'אני משלם' }).getAttribute('aria-selected').catch(() => null);
    await p.getByRole('button', { name: 'בחירה מנותני שירות' }).click(); await L.sleep(800);
    await p.getByRole('button', { name: 'בחירת נותן שירות' }).click(); await L.sleep(2000);
    await p.getByText('בחירת עסק', { exact: true }).nth(0).click().catch(async () => { await p.getByRole('button', { name: /בחירת עסק/ }).nth(1).click(); });
    await L.sleep(1500);
    r.recipientShown = (await L.visText(p)).includes(SHIRA);
    await L.fillForm(p, { title, terms: 'QA 1846 תנאים מסלול עסקאות', amount: 650, start: START, end: END });
    await L.shot(p, `${RUN}-B1-form-filled-${DEV}`);
    r.create = await create(title, 650);
    r.details = await details();
    await L.shot(p, `${RUN}-B2-details-${DEV}`);
    r.detailsUrl = p.url();
    // reload
    await p.reload(); r.afterReload = await details();
    await L.shot(p, `${RUN}-B3-details-after-reload-${DEV}`);
    // browser back
    navs.length = 0; p._req.length = 0;
    await p.goBack(); await L.sleep(3500);
    r.afterBrowserBack = { url: p.url(), text: (await L.visText(p)).slice(0, 400), posts: [...p._req] };
    await L.shot(p, `${RUN}-B4-after-browser-back-${DEV}`);
    // forward
    await p.goForward().catch(() => {}); await L.sleep(3000);
    r.afterForward = { url: p.url(), text: (await L.visText(p)).slice(0, 200) };
    await p.goto(L.BASE + '/deals'); r.listCheck = await listInfo(title);
    r.console = [...p._console];
    save();
  }
  // ---------- D: double click + slow network
  if (STEPS.includes('D')) {
    const title = `QA 1846 ${L.hhmm()} ${RUN}D`;
    const r = (log.D = { title, amount: 333 });
    await p.goto(L.BASE + '/deals/new?providerId=1929b054-5ae2-40ee-bee0-bfba608ac1fa'); await L.sleep(4000);
    await L.fillForm(p, { title, terms: 'QA 1846 תנאים לחיצה כפולה', amount: 333, start: START, end: END });
    // slow down all non-GET supabase requests by 3s
    await p.route(/supabase\.co/, async (route) => { if (route.request().method() !== 'GET') await L.sleep(3000); await route.continue(); });
    r.create = await create(title, 333, 'double');
    r.details = await details();
    await L.shot(p, `${RUN}-D1-details-after-dblclick-${DEV}`);
    await p.unroute(/supabase\.co/);
    await p.goto(L.BASE + '/deals'); r.listCheck = await listInfo(title);
    await L.redBox(p, p.getByText(title), `${RUN}-D2-list-after-dblclick-${DEV}`);
    r.console = [...p._console];
    save();
  }
  // ---------- E: slow network single click -> loading state
  if (STEPS.includes('E')) {
    const title = `QA 1846 ${L.hhmm()} ${RUN}E`;
    const r = (log.E = { title, amount: 444 });
    await p.goto(L.BASE + '/deals/new?providerId=1929b054-5ae2-40ee-bee0-bfba608ac1fa'); await L.sleep(4000);
    await L.fillForm(p, { title, terms: 'QA 1846 תנאים רשת איטית', amount: 444, start: START, end: END });
    await p.route(/supabase\.co\/rest\/v1\/deals/, async (route) => { if (route.request().method() === 'POST') await L.sleep(4000); await route.continue(); });
    p._req.length = 0;
    const btn = await L.submitBtn(p);
    await btn.click();
    await L.sleep(400);
    r.during = await p.evaluate(() => [...document.querySelectorAll('[role=button],button')].filter((e) => e.offsetParent).map((e) => `${(e.innerText || e.getAttribute('aria-label') || '').trim()}${e.getAttribute('aria-disabled') === 'true' || e.disabled ? '[disabled]' : ''}`).slice(-4));
    r.duringSpinner = await p.locator('[role=progressbar]').count();
    r.duringUrl = p.url();
    await L.shot(p, `${RUN}-E1-loading-state-${DEV}`);
    // try second click during loading
    await btn.click({ timeout: 1500 }).then(() => r.secondClick = 'clicked').catch(() => r.secondClick = 'not clickable');
    await p.waitForURL(/\/deals\/[0-9a-f-]{20,}/, { timeout: 20000 }).catch(() => {});
    await L.sleep(2000);
    r.posts = [...p._req].filter((x) => x.includes('/deals'));
    r.url = p.url();
    await p.unroute(/supabase\.co\/rest\/v1\/deals/);
    await p.goto(L.BASE + '/deals'); r.listCheck = await listInfo(title);
    save();
  }
  // ---------- K: plain double click (no throttling)
  if (STEPS.includes('K')) {
    const title = `QA 1846 ${L.hhmm()} ${RUN}K`;
    const r = (log.K = { title, amount: 222 });
    await p.goto(L.BASE + '/deals/new?providerId=1929b054-5ae2-40ee-bee0-bfba608ac1fa'); await L.sleep(4000);
    await L.fillForm(p, { title, terms: 'QA 1846 תנאים דאבל קליק', amount: 222, start: START, end: END });
    p._req.length = 0;
    await (await L.submitBtn(p)).dblclick();
    await p.waitForURL(/\/deals\/[0-9a-f-]{20,}/, { timeout: 20000 }).catch(() => {});
    await L.sleep(3000);
    r.posts = [...p._req].filter((x) => x.includes('/deals')); r.url = p.url();
    await p.goto(L.BASE + '/deals'); r.listCheck = await listInfo(title);
    await L.redBox(p, p.getByText(title), `${RUN}-K1-list-after-plain-dblclick-${DEV}`);
    save();
  }
  // ---------- V: validation
  if (STEPS.includes('V')) {
    const r = (log.V = {});
    await p.goto(L.BASE + '/deals/new?providerId=1929b054-5ae2-40ee-bee0-bfba608ac1fa'); await L.sleep(4000);
    const btn = await L.submitBtn(p);
    r.empty = await btn.isDisabled();
    await L.fillForm(p, { title: 'QA 1846 validation', terms: 'x', amount: 100, start: START });
    r.allRequiredNoEnd = await btn.isDisabled();
    // clear title
    await p.getByRole('textbox', { name: 'הקלד/י' }).nth(0).fill('');
    r.noTitle = await btn.isDisabled();
    await p.getByRole('textbox', { name: 'הקלד/י' }).nth(0).fill('QA 1846 validation');
    await p.getByRole('textbox', { name: 'הקלד/י' }).nth(2).fill('');
    r.noAmount = await btn.isDisabled();
    await p.getByRole('textbox', { name: 'הקלד/י' }).nth(2).fill('100');
    await L.fillForm(p, { type: null, end: '01/10/2026' });
    r.endBeforeStart = await btn.isDisabled();
    r.errText = (await L.visText(p)).includes('תאריך הסיום מוקדם מתאריך ההתחלה');
    p._req.length = 0;
    await btn.click({ force: true }).catch(() => {}); await L.sleep(2000);
    r.afterForceClick = { url: p.url(), posts: [...p._req] };
    await L.redBox(p, p.getByText('תאריך הסיום מוקדם מתאריך ההתחלה'), `${RUN}-V1-end-before-start-${DEV}`);
    save();
  }
} catch (e) {
  log.error = e.message.slice(0, 500);
  await L.shot(p, `${RUN}-ERROR-${DEV}`).catch(() => {});
}
log.finalConsole = p._console;
save();
console.log(JSON.stringify(log, null, 1));
await b.close();

// QA #129a4d driver: node qa-129a4d-run.mjs <scenario.json>
// scenario: { name, account: "new"|"guest", saveState: bool, steps: [ {send:"text"} | {shot:"name"} | {click:"text", shot:"name"} | {goto:"/path"} | {dump:"name"} ] }
import { chromium } from 'playwright';
import fs from 'node:fs';
const sc = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const SHOTS = 'C:/Users/nekit/Documents/projects/NutiWingman-moe/.qa/research/shots/129a4d';
const AUTH = 'C:/Users/nekit/Documents/projects/NutiWingman-moe/.qa/auth';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'he-IL', timezoneId: 'Asia/Jerusalem',
  ...(sc.account !== 'guest' ? { storageState: `${AUTH}/${sc.account}.json` } : {}),
});
const page = await ctx.newPage();
const log = [];
const consoleErr = [];
page.on('console', m => { if (m.type() === 'error') consoleErr.push(m.text().slice(0, 300)); });
const out = (o) => { log.push(o); console.log(JSON.stringify(o)); };
await page.goto('https://nutriwingman.expo.app' + (sc.start || '/'), { waitUntil: 'domcontentloaded' });
const input = () => page.locator('textarea, input[type="text"]').last();
try { await input().waitFor({ timeout: 20000 }); } catch { out({ warn: 'no input in 20s', url: page.url() }); }
out({ url: page.url() });
for (const st of sc.steps) {
  try {
    if (st.goto) { await page.goto('https://nutriwingman.expo.app' + st.goto); await page.waitForLoadState('networkidle').catch(() => {}); }
    if (st.send) {
      await page.waitForFunction(() => { const t = [...document.querySelectorAll('textarea, input[type="text"]')].pop(); return t && !t.hasAttribute('readonly'); }, null, { timeout: 15000 }).catch(() => {});
      const ro = await input().getAttribute('readonly'); if (ro !== null) { out({ sent: st.send, skipped: 'input readonly', page: (await page.evaluate(() => document.body.innerText)).slice(0, 900) }); continue; }
      const t0 = Date.now();
      const respP = page.waitForResponse(r => r.url().includes('/functions/v1/chat') && r.request().method() === 'POST', { timeout: 60000 });
      await input().fill(st.send);
      await input().press('Enter');
      const r = await respP; let body; try { body = await r.json(); } catch { body = await r.text(); }
      // wait until last message rendered
      await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
      const msgs = (body?.messages ?? []).map(m => ({ kind: m.kind, author: m.author, text: m.text ?? m.payload?.text ?? m.comment, actionLabel: m.actionLabel, pauses: m.pausesNutritionTalk, payload: m.kind === 'text' ? undefined : JSON.stringify(m.payload).slice(0, 400), meal: m.meal ? JSON.stringify(m.meal).slice(0, 500) : undefined }));
      out({ sent: st.send, status: r.status(), ms: Date.now() - t0, msgs, extra: body && typeof body === 'object' ? Object.keys(body) : null });
    }
    if (st.click) { await page.getByText(st.click, { exact: false }).last().click({ timeout: 10000 }); await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {}); out({ clicked: st.click, url: page.url() }); }
    if (st.fill) { await page.locator(st.fill.sel).first().fill(st.fill.value); out({ filled: st.fill }); }
    if (st.eval) { const v = await page.evaluate(st.eval); out({ eval: st.evalName || 'eval', v }); }
    if (st.shot) { await page.screenshot({ path: `${SHOTS}/${st.shot}.png`, fullPage: !!st.full }); out({ shot: `${SHOTS}/${st.shot}.png` }); }
    if (st.dump) { const txt = await page.evaluate(() => document.body.innerText); fs.writeFileSync(`${SHOTS}/${st.dump}.txt`, txt); out({ dump: st.dump, tail: txt.slice(-1500) }); }
  } catch (e) { out({ step: st, error: String(e).slice(0, 400) }); }
}
if (sc.saveState && sc.account !== 'guest') { await ctx.storageState({ path: `${AUTH}/${sc.account}.json` }); out({ savedState: sc.account }); }
out({ consoleErrors: consoleErr.slice(0, 10) });
await browser.close();

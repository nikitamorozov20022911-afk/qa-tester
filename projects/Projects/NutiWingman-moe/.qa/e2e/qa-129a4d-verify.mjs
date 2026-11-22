// QA #129a4d independent verifier driver: node qa-129a4d-verify.mjs <scenario.json>
// steps: {send}, {shot}, {click, exact?}, {clickRole:{role,name}}, {dump}, {eval, evalName}, {wait: ms-ish condition text}, {waitText}, {net:on}, {goto}
import { chromium } from 'playwright';
import fs from 'node:fs';
const sc = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const SHOTS = 'C:/Users/nekit/Documents/projects/NutiWingman-moe/.qa/research/shots/129a4d-v';
const AUTH = 'C:/Users/nekit/Documents/projects/NutiWingman-moe/.qa/auth';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'he-IL', timezoneId: 'Asia/Jerusalem',
  ...(sc.account !== 'guest' ? { storageState: `${AUTH}/${sc.account}.json` } : {}),
});
const page = await ctx.newPage();
const consoleErr = [];
const net = [];
const popups = [];
page.on('console', m => { if (m.type() === 'error') consoleErr.push(m.text().slice(0, 300)); });
page.on('request', r => { if (!/\.(png|jpg|svg|woff2?|ttf|js|css)(\?|$)/.test(r.url())) net.push({ t: Date.now(), m: r.method(), u: r.url().slice(0, 200), body: (r.postData() || '').slice(0, 600) }); });
ctx.on('page', p => popups.push(p.url()));
page.on('dialog', d => { popups.push('dialog:' + d.message()); d.dismiss().catch(() => {}); });
const out = (o) => console.log(JSON.stringify(o));
await page.goto('https://nutriwingman.expo.app' + (sc.start || '/'), { waitUntil: 'domcontentloaded' });
const input = () => page.locator('textarea, input[type="text"]').last();
try { await input().waitFor({ timeout: 25000 }); } catch { out({ warn: 'no input', url: page.url() }); }
out({ url: page.url() });
for (const st of sc.steps) {
  try {
    if (st.send) {
      await page.waitForFunction(() => { const t = [...document.querySelectorAll('textarea, input[type="text"]')].pop(); return t && !t.hasAttribute('readonly') && !t.disabled; }, null, { timeout: 20000 }).catch(() => {});
      const t0 = Date.now();
      const respP = page.waitForResponse(r => r.url().includes('/functions/v1/chat') && r.request().method() === 'POST', { timeout: 60000 }).catch(e => null);
      await input().fill(st.send);
      await input().press('Enter');
      const r = await respP;
      if (!r) { out({ sent: st.send, error: 'no chat response 60s' }); continue; }
      let body; try { body = await r.json(); } catch { body = await r.text(); }
      await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
      try {
        const ms = (body?.messages || []).filter(m => m.author === 'wingman');
        for (const m of ms) {
          const tx = (m.payload?.text || m.payload?.comment || m.payload?.title || '').trim();
          if (tx) await page.waitForFunction(s => document.body.innerText.includes(s), tx.slice(0, 18), { timeout: 25000 });
        }
        await page.waitForTimeout(300);
      } catch (e) { out({ warn: 'render wait failed' }); }
      out({ sent: st.send, status: r.status(), ms: Date.now() - t0, body: JSON.stringify(body).slice(0, 2500) });
    }
    if (st.click) { const loc = page.getByText(st.click, { exact: !!st.exact }).last(); await loc.click({ timeout: 10000 }); await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {}); out({ clicked: st.click, url: page.url() }); }
    if (st.clickRole) { await page.getByRole(st.clickRole.role, { name: st.clickRole.name }).last().click({ timeout: 10000 }); await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {}); out({ clickedRole: st.clickRole, url: page.url() }); }
    if (st.fillSel) { await page.locator(st.fillSel.sel).last().fill(st.fillSel.value); out({ filled: st.fillSel }); }
    if (st.press) { await page.keyboard.press(st.press); }
    if (st.waitText) { await page.getByText(st.waitText).last().waitFor({ timeout: st.timeout || 20000 }); out({ seen: st.waitText }); }
    if (st.idle) { await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {}); }
    if (st.eval) { const v = await page.evaluate(st.eval); out({ eval: st.evalName || 'eval', v }); }
    if (st.profile) {
      const KEY = fs.readFileSync(`${AUTH}/.sbkey`, 'utf8').trim();
      const v = await page.evaluate(async (KEY) => {
        const k = Object.keys(localStorage).find(k => /auth-token$/.test(k)); const s = JSON.parse(localStorage.getItem(k));
        const r = await fetch('https://siodtucasjpxpsfuvlfc.supabase.co/rest/v1/profiles?select=*,layers,goal,body', { headers: { apikey: KEY, Authorization: 'Bearer ' + s.access_token } });
        return { uid: s.user?.id, anon: s.user?.is_anonymous, prof: await r.json() };
      }, KEY);
      out({ profile: JSON.stringify(v).slice(0, 1500) });
    }
    if (st.patchAllergy) {
      const KEY = fs.readFileSync(`${AUTH}/.sbkey`, 'utf8').trim();
      const v = await page.evaluate(async ({ KEY, al }) => {
        const k = Object.keys(localStorage).find(k => /auth-token$/.test(k)); const s = JSON.parse(localStorage.getItem(k));
        const H = { apikey: KEY, Authorization: 'Bearer ' + s.access_token, 'Content-Type': 'application/json', Prefer: 'return=representation' };
        const B = 'https://siodtucasjpxpsfuvlfc.supabase.co/rest/v1/profiles';
        const row = (await (await fetch(B + '?select=*', { headers: H })).json())[0];
        const layers = { ...row.layers, medical: { ...row.layers.medical, allergies: al, conditions: [...new Set([...(row.layers.medical.conditions || []), 'allergy'])] } };
        const r = await fetch(B + '?id=eq.' + row.id, { method: 'PATCH', headers: H, body: JSON.stringify({ layers }) });
        return { keys: Object.keys(row), status: r.status, res: (await r.text()).slice(0, 600) };
      }, { KEY, al: st.patchAllergy });
      out({ patchAllergy: v });
    }
    if (st.fillPh) { await page.getByPlaceholder(st.fillPh.ph, { exact: true }).last().fill(String(st.fillPh.value)); out({ filledPh: st.fillPh }); }
    if (st.fillIdx) { await page.locator('input').nth(st.fillIdx.i).fill(String(st.fillIdx.value)); out({ filledIdx: st.fillIdx }); }
    if (st.mark) { st._t = Date.now(); globalThis.__mark = Date.now(); net.length = 0; popups.length = 0; out({ mark: true }); }
    if (st.observe) { // observe N ms after mark: popups, net, url, dialogs
      const until = (globalThis.__mark || Date.now()) + st.observe;
      while (Date.now() < until) { await page.waitForTimeout(500); }
      out({ observe: st.observe, url: page.url(), pages: ctx.pages().length, popups, net: net.map(n => `${n.m} ${n.u}`).slice(0, 30) });
    }
    if (st.shot) { await page.screenshot({ path: `${SHOTS}/${st.shot}.png`, fullPage: !!st.full }); out({ shot: `${SHOTS}/${st.shot}.png` }); }
    if (st.dump) { const txt = await page.evaluate(() => document.body.innerText); fs.writeFileSync(`${SHOTS}/${st.dump}.txt`, txt); out({ dump: st.dump, head: txt.slice(0, 1800) }); }
  } catch (e) { out({ step: Object.keys(st)[0], error: String(e).slice(0, 400) }); }
}
if (sc.saveState && sc.account !== 'guest') { await ctx.storageState({ path: `${AUTH}/${sc.account}.json` }); out({ savedState: sc.account }); }
if (sc.netDump) out({ net: net.filter(n => /supabase/.test(n.u)).map(n => `${n.m} ${n.u} ${n.body.slice(0, 300)}`) });
out({ consoleErrors: consoleErr.slice(0, 10) });
await browser.close();

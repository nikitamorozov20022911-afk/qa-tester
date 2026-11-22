// #3cc72778 main run. usage: node 3cc7-run.mjs <run:r1|r2> <phase> [width]
// phases: il | tony | ny | switch | revert | layout | rm
import { open, warm, fake, readReminders, tefillinRows, BASE, SHOTS, mark, unmark, setExp, readExp } from './3cc7-lib.mjs';
import fs from 'fs';
const [run, phase, w] = process.argv.slice(2);
const width = +(w || 390);
const OUT = `/private/tmp/claude-502/-Users-avielshnaider-zikuiArabim-moe/9c8d4faf-274d-42c5-b418-fc027cdd8f35/scratchpad/3cc7-${run}-${phase}-${width}.json`;
const results = [];
const IL = '+03:00', NY = '-04:00';
let s, page, log;
let hdr = {};

function rec(o) { results.push(o); fs.writeFileSync(OUT, JSON.stringify(results, null, 1)); console.log(JSON.stringify(o)); }

async function api(pathq) {
  return page.evaluate(async ({ h, pathq }) => {
    const k = Object.keys(localStorage).find((k) => /^sb-.+-auth-token$/.test(k)); const v = JSON.parse(localStorage.getItem(k));
    const r = await fetch(h.url + '/rest/v1/' + pathq, { headers: { apikey: h.apikey, Authorization: 'Bearer ' + v.access_token } });
    return { status: r.status, json: await r.json().catch(() => null) };
  }, { h: hdr, pathq });
}
async function remRows() {
  const r = await api('reminders?select=reminder_key,title,is_active&order=reminder_key');
  return r.status === 200 ? r.json.map((x) => `${x.reminder_key}${x.is_active ? '' : '(off)'}`) : 'api ' + r.status;
}

async function start(opts) {
  s = await open({ width, ...opts }); page = s.page; log = s.log;
  page.on('request', (r) => { const u = r.url(); if (u.includes('/rest/v1/') && !hdr.apikey && r.headers()['apikey']) { hdr.apikey = r.headers()['apikey']; hdr.url = u.split('/rest')[0]; } });
}
async function stop() { const sv = await s.close(); rec({ saved: sv, net: log.net, console: log.console }); }

// visit /home at fake instant
async function visit(item, label, iso, extra = {}) {
  if (iso) await fake(page, iso);
  const rpcBefore = log.rpc.length;
  if (extra.inApp) {
    await page.getByRole('tab', { name: /זמנים|בית/ }).first().click().catch(() => {});
  } else {
    await page.goto(BASE + '/home');
  }
  if (/\/(phone|welcome)/.test(page.url()) || page.url() === BASE + '/') throw new Error('SESSION DEAD at ' + label + ' url=' + page.url());
  const rem = await readReminders(page);
  const tf = tefillinRows(rem);
  const rpc = log.rpc.slice(rpcBefore).filter((x) => x.path.includes('generate_reminders')).map((x) => `${x.status} ${x.req} -> ${x.body}`);
  const shot = `${SHOTS}3cc7-${run}-${label}-${width}.png`;
  if (tf[0]) {
    const box = await page.evaluate(() => { const e = [...document.querySelectorAll('div')].find((d) => d.childElementCount === 0 && d.textContent.trim() === 'הנחת תפילין'); let r = e; for (let i = 0; i < 6 && r; i++) { r = r.parentElement; if (r.getBoundingClientRect().width > 300) break; } const b = r.getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height }; }).catch(() => null);
  }
  await page.getByText('תזכורות מהירות', { exact: true }).scrollIntoViewIfNeeded();
  await page.screenshot({ path: shot });
  const o = {
    item, label, at: iso || 'real', titles: rem.rows.map((r) => r.lines.join(' / ')),
    tefillin: tf.length, tefillinRow: tf[0] ? { lines: tf[0].lines, iconOnRight: tf[0].iconOnRight, icon: tf[0].icon, svgSig: tf[0].svgSig } : null,
    dupTitles: rem.rows.map((r) => r.lines[0]).filter((t, i, a) => a.indexOf(t) !== i),
    sigs: rem.rows.map((r) => `${r.lines[0]}=${r.svgSig}|R:${r.iconOnRight}`),
    rpc, db: await remRows(), shot, ...extra,
  };
  rec(o);
  return o;
}

function parseZ(txt) {
  const L = txt.split('\n').map((x) => x.trim()).filter(Boolean);
  const out = { alot: [], shkiya: null, header: L.slice(0, 5).join(' | ') };
  for (let i = 0; i < L.length; i++) {
    if (L[i] === 'עלות השחר' || L[i] === 'שקיעת החמה') {
      let j = i + 1; let meth = '';
      while (j < L.length && !/^\d{1,2}:\d{2}$/.test(L[j]) && j < i + 3) { meth = L[j]; j++; }
      if (/^\d{1,2}:\d{2}$/.test(L[j])) { if (L[i] === 'עלות השחר') out.alot.push(`${L[j]} ${meth}`); else out.shkiya = L[j]; }
    }
  }
  return out;
}
async function zmanim(item, label, iso) {
  await fake(page, iso);
  await page.goto(BASE + '/zmanim');
  await page.getByText('שקיעת החמה').first().waitFor({ timeout: 25000 });
  await page.waitForTimeout(1500);
  const z = parseZ(await page.locator('body').innerText());
  rec({ item, label: 'zmanim-' + label, at: iso, ...z });
  return z;
}
const hm = (t, dmin, date, off) => { const [h, m] = t.split(':').map(Number); const d = new Date(`${date}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00${off}`); return new Date(d.getTime() + dmin * 60000).toISOString(); };

async function boundaries(item, tag, date, off) {
  const z = await zmanim(item, `${tag}-${date}`, `${date}T12:00:00${off}`);
  const alotTimes = z.alot.map((a) => a.split(' ')[0]).sort();
  const earliest = alotTimes[0], latest = alotTimes[alotTimes.length - 1];
  await visit(12, `${tag}-${date}-0400`, `${date}T04:00:00${off}`);
  const uniq = [...new Set(alotTimes)];
  const done = new Set();
  for (const t of uniq) for (const d of [-1, 1]) {
    const iso = hm(t, d, date, off); if (done.has(iso)) continue; done.add(iso);
    await visit(12, `${tag}-${date}-alot${t.replace(':', '')}${d > 0 ? '+1' : '-1'}`, iso);
  }
  await visit(11, `${tag}-${date}-shkiya-1`, hm(z.shkiya, -1, date, off));
  await visit(11, `${tag}-${date}-shkiya+1`, hm(z.shkiya, +1, date, off));
  await visit(11, `${tag}-${date}-1930`, `${date}T19:30:00${off}`);
  await visit(11, `${tag}-${date}-2330`, `${date}T23:30:00${off}`);
  return z;
}

async function noReloadSunset(tag, date, off) {
  const z = await zmanim(13, `${tag}-${date}-nr`, `${date}T12:00:00${off}`);
  const before = await visit(13, `${tag}-${date}-nr-before`, hm(z.shkiya, -1, date, off));
  await fake(page, hm(z.shkiya, +2, date, off));
  await page.waitForTimeout(65000);
  const rem = await readReminders(page);
  await page.screenshot({ path: `${SHOTS}3cc7-${run}-${tag}-${date}-nr-after65s-${width}.png` });
  rec({ item: 13, label: `${tag}-${date}-nr-after65s-noReload`, at: hm(z.shkiya, +2, date, off), tefillin: tefillinRows(rem).length, titles: rem.rows.map((r) => r.lines.join(' / ')), shot: `${SHOTS}3cc7-${run}-${tag}-${date}-nr-after65s-${width}.png` });
  // in-app navigation away and back (no reload)
  await page.getByRole('tab').filter({ hasText: 'תפילות' }).first().click().catch((e) => rec({ item: 13, err: 'tab click ' + e.message }));
  await page.waitForTimeout(2000);
  await page.getByRole('tab').filter({ hasText: 'בית' }).first().click().catch((e) => rec({ item: 13, err: 'tab click ' + e.message }));
  const rem2 = await readReminders(page);
  rec({ item: 13, label: `${tag}-${date}-nr-afterTabNav`, url: page.url(), tefillin: tefillinRows(rem2).length, titles: rem2.rows.map((r) => r.lines.join(' / ')) });
}

async function setCity(query, optRe) {
  await page.goto(BASE + '/profile');
  await page.getByRole('button', { name: /^מיקום:/ }).click();
  const inp = page.getByLabel('שם המיקום');
  await inp.fill('');
  await inp.pressSequentially(query, { delay: 60 });
  const opt = page.getByRole('button', { name: optRe }).first();
  await opt.waitFor({ timeout: 15000 });
  const optName = await opt.getAttribute('aria-label') || await opt.innerText();
  await opt.click();
  await page.getByRole('button', { name: 'שמירה', exact: true }).click();
  const alert = await page.getByRole('alert').first().innerText({ timeout: 10000 }).catch(() => 'no alert');
  await page.waitForTimeout(1500);
  await page.reload();
  const lbl = await page.getByRole('button', { name: /^מיקום:/ }).getAttribute('aria-label');
  const prof = await api('user_profiles?select=location_name,location_geonameid,location_source');
  rec({ item: 'data', label: 'setCity ' + query, option: optName, alert, profileLabel: lbl, apiProfile: prof.json });
}

try {
  if (phase === 'il') {
    await start({ tz: 'Asia/Jerusalem' });
    await warm(page, s, '/profile');
    await visit(2, 'IL-real-today', null);
    await visit(9, 'IL-2026-10-04-1000', `2026-10-04T10:00:00${IL}`);
    await visit(9, 'IL-2026-10-05-1000', `2026-10-05T10:00:00${IL}`);
    await visit(9, 'IL-2027-04-29-1000', `2027-04-29T10:00:00${IL}`);
    // item 10 sequences
    await visit(10, 'IL-seqA1-1004', `2026-10-04T12:00:00${IL}`);
    await visit(10, 'IL-seqA2-1015', `2026-10-15T12:00:00${IL}`);
    await visit(10, 'IL-seqA3-1004', `2026-10-04T12:00:00${IL}`);
    await visit(10, 'IL-seqB1-1005', `2026-10-05T12:00:00${IL}`);
    await visit(10, 'IL-seqB2-1004', `2026-10-04T12:00:00${IL}`);
    // items 11/12 Israel (4.10 + 5.10)
    await boundaries('11-12', 'IL', '2026-10-04', IL);
    await boundaries('11-12', 'IL', '2026-10-05', IL);
    // item 14 Israel
    await visit(14, 'IL-2026-10-09-fri-1000', `2026-10-09T10:00:00${IL}`);
    await visit(14, 'IL-2026-10-10-shabbat-1000', `2026-10-10T10:00:00${IL}`);
    await visit(14, 'IL-2027-04-22-yt-1000', `2027-04-22T10:00:00${IL}`);
    await visit(14, 'IL-2027-04-25-cholhamoed-1000', `2027-04-25T10:00:00${IL}`);
    await visit(14, 'IL-2027-04-28-shviishi-1000', `2027-04-28T10:00:00${IL}`);
    await visit(14, 'IL-2027-06-13-1000', `2027-06-13T10:00:00${IL}`);
    // item 13 Israel
    await noReloadSunset('IL', '2026-10-04', IL);
    await stop();
  }
  if (phase === 'tony') {
    await start({ tz: 'Asia/Jerusalem' });
    await warm(page, s, '/profile');
    await setCity('New York', /^ניו יורק, New York, United States/);
    await stop();
  }
  if (phase === 'nycore') {
    await start({ tz: 'America/New_York' });
    await warm(page, s, '/profile');
    await visit(3, 'NY-2026-10-05-1000', `2026-10-05T10:00:00${NY}`);
    await visit(3, 'NY-2026-10-05-1700', `2026-10-05T17:00:00${NY}`);
    await visit(4, 'NY-seq4-1015', `2026-10-15T12:00:00${NY}`);
    await visit(4, 'NY-seq4-1005', `2026-10-05T12:00:00${NY}`);
    await visit(5, 'NY-seq5a-1006', `2026-10-06T12:00:00${NY}`);
    await visit(5, 'NY-seq5a-1005', `2026-10-05T12:00:00${NY}`);
    await visit(6, 'NY-2026-10-04-1200', `2026-10-04T12:00:00${NY}`);
    await visit(7, 'NY-2027-04-30-1000', `2027-04-30T10:00:00${NY}`);
    await stop();
  }
  if (phase === 'final') {
    await start({ tz: 'Asia/Jerusalem' });
    await warm(page, s, '/profile');
    await visit('final', 'IL-real-final', null);
    const prof = await api('user_profiles?select=location_name,location_geonameid,location_source,nusach');
    rec({ item: 'data', label: 'final profile', apiProfile: prof.json });
    await stop();
  }
  if (phase === 'ny') {
    await start({ tz: 'America/New_York' });
    await warm(page, s, '/profile');
    await visit(6, 'NY-real-today', null);
    await visit(3, 'NY-2026-10-05-1000', `2026-10-05T10:00:00${NY}`);
    await visit(3, 'NY-2026-10-05-1700', `2026-10-05T17:00:00${NY}`);
    await visit(4, 'NY-seq4-1015', `2026-10-15T12:00:00${NY}`);
    await visit(4, 'NY-seq4-1005', `2026-10-05T12:00:00${NY}`);
    await visit(5, 'NY-seq5a-1006', `2026-10-06T12:00:00${NY}`);
    await visit(5, 'NY-seq5a-1005', `2026-10-05T12:00:00${NY}`);
    await visit(5, 'NY-seq5b-1006', `2026-10-06T12:00:00${NY}`);
    await visit(5, 'NY-seq5b-1005', `2026-10-05T12:00:00${NY}`);
    await visit(6, 'NY-2026-10-04-1200', `2026-10-04T12:00:00${NY}`);
    await visit(6, 'NY-2026-10-03-1200', `2026-10-03T12:00:00${NY}`);
    await visit(7, 'NY-2027-04-29-1000', `2027-04-29T10:00:00${NY}`);
    await visit(7, 'NY-2027-04-30-1000', `2027-04-30T10:00:00${NY}`);
    await visit(7, 'NY-2027-06-13-1000', `2027-06-13T10:00:00${NY}`);
    await visit(7, 'NY-2027-06-12-1000', `2027-06-12T10:00:00${NY}`);
    await boundaries('11-12', 'NY', '2026-10-05', NY);
    await visit(14, 'NY-2026-10-09-fri-1000', `2026-10-09T10:00:00${NY}`);
    await visit(14, 'NY-2026-10-10-shabbat-1000', `2026-10-10T10:00:00${NY}`);
    await visit(14, 'NY-2027-04-22-yt-1000', `2027-04-22T10:00:00${NY}`);
    await visit(14, 'NY-2027-04-25-cholhamoed-1000', `2027-04-25T10:00:00${NY}`);
    await visit(14, 'NY-2027-04-28-yt-1000', `2027-04-28T10:00:00${NY}`);
    await noReloadSunset('NY', '2026-10-05', NY);
    await stop();
  }
  if (phase === 'switch') {
    // currently NY. back to PT (real time), then PT 5.10 19:30 IL → NY same instant (12:30 NY) in NY-tz context
    await start({ tz: 'Asia/Jerusalem' });
    await warm(page, s, '/profile');
    await setCity('פתח תקווה', /^פתח תקווה, Central District, ישראל/);
    const inst = `2026-10-05T19:30:00${IL}`;
    await visit(8, 'SW-PT-1005-1930', inst);
    await setCity('New York', /^ניו יורק, New York, United States/);
    await visit(8, 'SW-NY-sameCtx-ILtz-1005-1230NY', inst);
    await stop();
    await start({ tz: 'America/New_York', fakeAt: inst });
    await visit(8, 'SW-NY-NYtz-1005-1230NY', null);
    await visit(8, 'SW-NY-NYtz-reload', null);
    await stop();
  }
  if (phase === 'revert') {
    await start({ tz: 'Asia/Jerusalem' });
    await warm(page, s, '/profile');
    await setCity('פתח תקווה', /^פתח תקווה, Central District, ישראל/);
    await visit('revert', 'IL-real-after-revert', null);
    await stop();
  }

  if (phase === 'layout') {
    for (const W of [320, 375, 390, 1440]) {
      s = await open({ width: W, height: W > 1000 ? 900 : 844, tz: 'Asia/Jerusalem' }); page = s.page; log = s.log;
      if (W === 320) await warm(page, s, '/profile');
      await page.goto(BASE + '/home');
      const rem = await readReminders(page);
      const trunc = await page.evaluate(() => {
        const t = [...document.querySelectorAll('div,span')].find((e) => e.childElementCount === 0 && e.textContent.trim() === 'תזכורות מהירות');
        const block = t.parentElement.parentElement;
        const leaves = [...block.querySelectorAll('div,span')].filter((e) => e.childElementCount === 0 && e.textContent.trim());
        const bad = leaves.filter((e) => e.scrollWidth > e.clientWidth + 1 || (getComputedStyle(e).textOverflow === 'ellipsis' && e.scrollWidth > e.clientWidth)).map((e) => e.textContent.trim());
        const dirs = [...new Set(leaves.map((e) => getComputedStyle(e).direction))];
        const b = block.getBoundingClientRect();
        return { bad, dirs, block: { x: Math.round(b.x), w: Math.round(b.width), right: Math.round(b.right) }, vw: innerWidth, docW: document.documentElement.scrollWidth };
      });
      const shot = `${SHOTS}3cc7-${run}-layout-${W}.png`;
      await page.getByText('תזכורות מהירות', { exact: true }).scrollIntoViewIfNeeded();
      await page.screenshot({ path: shot, fullPage: W > 1000 });
      rec({ item: 16, label: 'layout-' + W, titles: rem.rows.map((r) => r.lines.join(' / ')), rows: rem.rows.map((r) => ({ t: r.lines[0], iconOnRight: r.iconOnRight, icon: r.icon, row: r.row, textRight: r.textRight, overflow: r.overflow })), docOverflowX: rem.docOverflowX, ...trunc, shot });
      // skeleton (HM-04): delay rest calls 6s
      await page.route('**/rest/v1/**', async (route) => { await new Promise((r) => setTimeout(r, 6000)); await route.continue().catch(() => {}); });
      await page.goto(BASE + '/home');
      await page.waitForTimeout(1500);
      const sk = await page.evaluate(() => {
        const circ = [...document.querySelectorAll('div')].filter((d) => { const b = d.getBoundingClientRect(); const cs = getComputedStyle(d); return b.width >= 28 && b.width <= 64 && Math.abs(b.width - b.height) < 2 && parseFloat(cs.borderTopLeftRadius) >= b.width / 2 - 1 && b.y > 0; }).map((d) => { const b = d.getBoundingClientRect(); return { x: Math.round(b.x), y: Math.round(b.y + scrollY), w: Math.round(b.width) }; });
        return { text: document.body.innerText.slice(0, 300).replace(/\n/g, ' | '), circles: circ, docH: document.documentElement.scrollHeight };
      });
      const skshot = `${SHOTS}3cc7-${run}-skeleton-${W}.png`;
      await page.screenshot({ path: skshot, fullPage: true });
      rec({ item: '16-skeleton', label: 'skeleton-' + W, ...sk, shot: skshot });
      await page.unroute('**/rest/v1/**');
      await page.waitForTimeout(7000);
      await stop();
    }
  }
  if (phase === 'rm') {
    await start({ tz: 'Asia/Jerusalem' });
    await warm(page, s, '/profile');
    await page.goto(BASE + '/home');
    await readReminders(page);
    const dates = await api('important_dates?select=label,date_type,person_name,gregorian_date,hebrew_date&order=gregorian_date.asc');
    rec({ item: 17, label: 'important_dates', dates: dates.json });
    // RM-02: toggle off → empty state → manage link → toggle on
    const sw = () => page.getByRole('switch', { name: /^תזכורות במערכת/ });
    await page.goto(BASE + '/profile');
    const before = await sw().getAttribute('aria-checked');
    await sw().click();
    const a1 = await page.getByRole('alert').filter({ hasText: 'תזכורות במערכת' }).first().innerText({ timeout: 10000 }).catch(() => 'no alert');
    await page.goto(BASE + '/home');
    await page.getByText('תזכורות מהירות', { exact: true }).waitFor();
    await page.waitForTimeout(3000);
    const offTxt = await page.evaluate(() => { const t = [...document.querySelectorAll('div')].find((e) => e.childElementCount === 0 && e.textContent.trim() === 'תזכורות מהירות'); return t.parentElement.parentElement.innerText; });
    await page.getByText('תזכורות מהירות', { exact: true }).scrollIntoViewIfNeeded();
    await page.screenshot({ path: `${SHOTS}3cc7-${run}-rm02-off.png` });
    await page.getByRole('button', { name: 'ניהול התזכורות במסך הפרופיל' }).click();
    await page.waitForTimeout(2500);
    const url = page.url();
    const swBox = await sw().boundingBox();
    rec({ item: 17, label: 'RM-02 off', before, alert: a1, offTxt, manageUrl: url, switchY: swBox && Math.round(swBox.y), inViewport: swBox && swBox.y >= 0 && swBox.y + swBox.height <= 844 });
    await sw().click();
    const a2 = await page.getByRole('alert').filter({ hasText: 'תזכורות במערכת' }).first().innerText({ timeout: 10000 }).catch(() => 'no alert');
    await page.reload(); await page.waitForTimeout(2500);
    rec({ item: 17, label: 'RM-02 on', alert: a2, ariaAfterReload: await sw().getAttribute('aria-checked') });
    await visit(17, 'RM-after-toggle-on-real', null);
    // RM-04 important dates today/tomorrow via clock (existing records, no creation)
    const picks = (dates.json || []).filter((d) => d.gregorian_date >= '2026-09-20' && d.gregorian_date <= '2026-10-02');
    const seen = new Set();
    for (const d of picks) {
      if (seen.has(d.date_type)) continue; seen.add(d.date_type);
      const day = d.gregorian_date;
      const prev = new Date(new Date(day + 'T12:00:00Z').getTime() - 86400000).toISOString().slice(0, 10);
      await visit(17, `RM04-${d.date_type}-${day}-tomorrow`, `${prev}T10:00:00${IL}`, { record: d });
      await visit(17, `RM04-${d.date_type}-${day}-today`, `${day}T10:00:00${IL}`, { record: d });
    }
    await stop();
  }
} catch (e) {
  rec({ ERROR: e.message, stack: e.stack?.split('\n').slice(0, 3).join(' | ') });
  try { await page.screenshot({ path: `${SHOTS}3cc7-${run}-${phase}-error.png` }); } catch {}
  try { await stop(); } catch (e2) { console.log('SAVE FAILED', e2.message); }
}

import { open, warm, readReminders, BASE, SHOTS } from './3cc7-lib.mjs';
const s = await open({});
const { page, log } = s;
const hdr = {};
page.on('request', (r) => { const u = r.url(); if (u.includes('/rest/v1/user_profiles') && !hdr.apikey) { hdr.apikey = r.headers()['apikey']; hdr.url = u.split('/rest')[0]; } });
try {
  await warm(page);
  const rem = await readReminders(page);
  console.log(JSON.stringify(rem, null, 1));
  const html = await page.evaluate(() => { const t = [...document.querySelectorAll('div')].find((e) => e.childElementCount === 0 && e.textContent.trim() === 'תזכורות מהירות'); return t.parentElement.parentElement.outerHTML.length; });
  console.log('htmlLen', html, 'url', page.url());
  // API read profile (read only)
  const prof = await page.evaluate(async (h) => {
    const k = Object.keys(localStorage).find((k) => /^sb-.+-auth-token$/.test(k)); const v = JSON.parse(localStorage.getItem(k));
    const r = await fetch(h.url + '/rest/v1/user_profiles?select=*&user_id=eq.' + v.user.id, { headers: { apikey: h.apikey, Authorization: 'Bearer ' + v.access_token } });
    const j = await r.json(); const p = j[0] || {}; const o = {}; for (const k of Object.keys(p)) if (/loc|city|geo|lat|lon|tz|time|nusach|remind/i.test(k)) o[k] = p[k]; return { status: r.status, keys: Object.keys(p), o };
  }, hdr);
  console.log(JSON.stringify(prof));
  const rems = await page.evaluate(async (h) => {
    const k = Object.keys(localStorage).find((k) => /^sb-.+-auth-token$/.test(k)); const v = JSON.parse(localStorage.getItem(k));
    const r = await fetch(h.url + '/rest/v1/reminders?select=*&order=created_at.desc&limit=30', { headers: { apikey: h.apikey, Authorization: 'Bearer ' + v.access_token } });
    return { status: r.status, body: (await r.text()).slice(0, 3000) };
  }, hdr);
  console.log(JSON.stringify(rems));
  await page.screenshot({ path: SHOTS + '3cc7-explore-home-real.png', fullPage: true });
  console.log('RPC', JSON.stringify(log.rpc, null, 1));
  console.log('NET', log.net, 'CONSOLE', log.console);
  console.log('HDR', hdr.url);
  require: 0;
} finally { console.log('save', await s.close()); }

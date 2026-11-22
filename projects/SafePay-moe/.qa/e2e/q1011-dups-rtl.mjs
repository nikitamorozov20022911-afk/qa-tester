import { chromium } from '@playwright/test';
const b = await chromium.launch({ headless: true });
const c = await b.newContext({ storageState: '../auth/mifrat.json', viewport: { width: 1440, height: 900 } });
const p = await c.newPage();
await p.goto('https://mifrat.com/Project?id=69e115aa1b31563236cf6b60&tab=tasks');
await p.waitForFunction(() => document.body.innerText.includes('בבדיקות'), null, { timeout: 60000 }).catch(()=>{});
await p.waitForTimeout(4000);
// scroll all columns to load
for (let i = 0; i < 15; i++) { await p.evaluate(() => document.querySelectorAll('*').forEach(e => { if (e.scrollHeight > e.clientHeight + 50 && getComputedStyle(e).overflowY.match(/auto|scroll/)) e.scrollTop = e.scrollHeight; })); await p.waitForTimeout(700); }
const r = await p.evaluate(() => {
  const out = [];
  for (const h of document.querySelectorAll('h4')) {
    let el = h, col = '';
    for (let i = 0; i < 12 && el; i++) { el = el.parentElement; const m = (el.innerText||'').match(/^(רשימת משימות|לביצוע|בביצוע|בבדיקות|הושלם)\n/); if (m) { col = m[1]; break; } }
    const t = h.innerText.trim();
    if (/יתרה|יישור|RTL|Android|אנדרואיד|שמאל/i.test(t)) out.push(col + ' | ' + t);
  }
  return { total: document.querySelectorAll('h4').length, url: location.href, out };
});
console.log(JSON.stringify(r, null, 1));
await b.close();

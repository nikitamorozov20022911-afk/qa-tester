// Read-only: list ticket headings in a mifrat column. Usage: list-column.mjs <column> <out.json>
import { chromium } from '@playwright/test';
import fs from 'node:fs';
const [,, col, outFile] = process.argv;
const b = await chromium.launch({ headless: true });
const c = await b.newContext({ storageState: '/Users/avielshnaider/banci-moe/.qa/auth/mifrat.json', viewport: { width: 1400, height: 900 }, locale: 'he-IL' });
const p = await c.newPage();
await p.goto('https://mifrat.com/Project?id=6a9ea042a896bdb61c97c8ee&tab=tasks'); await p.waitForTimeout(8000);
const all = new Map();
for (let i = 0; i < 20; i++) {
  const items = await p.evaluate((col) => { const out = []; for (const h of document.querySelectorAll('h4')) { let el = h, cc = '';
    for (let k = 0; k < 12 && el; k++) { el = el.parentElement; const m = (el.innerText||'').match(/^(רשימת משימות|לביצוע|בביצוע|בבדיקות|הושלם)\n/); if (m) { cc = m[1]; break; } }
    if (cc === col) { let card = h; for (let k=0;k<4;k++) card = card.parentElement; out.push({ title: h.innerText.trim(), card: card.innerText.replace(/\s+/g,' ').slice(0,200) }); } } return out; }, col);
  items.forEach(x => all.set(x.title, x));
  await p.evaluate(() => document.querySelectorAll('*').forEach(e => { if (e.scrollHeight > e.clientHeight + 50 && getComputedStyle(e).overflowY.match(/auto|scroll/)) e.scrollTop += 600; }));
  await p.waitForTimeout(600);
}
fs.writeFileSync(outFile, JSON.stringify([...all.values()], null, 1)); console.log(all.size);
await b.close();

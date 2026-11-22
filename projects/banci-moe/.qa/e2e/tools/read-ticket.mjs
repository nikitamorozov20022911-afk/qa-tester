// Read-only: open a mifrat ticket by title fragment, dump fields/text/files/rejects, close with ביטול.
import { chromium } from '@playwright/test';
import fs from 'node:fs';
const [,, frag, outFile] = process.argv;
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ storageState: '/Users/avielshnaider/banci-moe/.qa/auth/mifrat.json', viewport: { width: 1400, height: 900 }, locale: 'he-IL' });
const page = await context.newPage();
await page.goto('https://mifrat.com/Project?id=6a9ea042a896bdb61c97c8ee&tab=tasks');
await page.waitForTimeout(8000);
const res = {};
res.loggedIn = await page.evaluate(() => document.body.innerText.includes('בבדיקות'));
// find heading; scroll columns if needed
let found = false;
for (let i = 0; i < 25 && !found; i++) {
  found = await page.evaluate((f) => !![...document.querySelectorAll('h4')].find(x => x.innerText.includes(f)), frag);
  if (!found) await page.evaluate(() => document.querySelectorAll('*').forEach(e => { if (e.scrollHeight > e.clientHeight + 50 && getComputedStyle(e).overflowY.match(/auto|scroll/)) e.scrollTop += 1500; }));
  await page.waitForTimeout(800);
}
res.found = found;
if (found) {
  res.column = await page.evaluate((f) => { const h=[...document.querySelectorAll('h4')].find(x => x.innerText.includes(f)); let el=h; for (let i=0;i<14&&el;i++){el=el.parentElement; const m=(el.innerText||'').match(/^(רשימת משימות|לביצוע|בביצוע|בבדיקות|הושלם)\n/); if(m) return m[1];} return ''; }, frag);
  await page.evaluate((f) => [...document.querySelectorAll('h4')].find(x => x.innerText.includes(f)).click(), frag);
  await page.waitForTimeout(3500);
  Object.assign(res, await page.evaluate(() => { const d = document.querySelector('[role=dialog]'); return {
    head: d.innerText.slice(0, 300),
    fields: [...d.querySelectorAll('input,textarea')].map(i => ({ ph: i.placeholder, v: i.value })).filter(x => x.v && x.v.length > 3),
    text: d.innerText,
    links: [...new Set([...d.querySelectorAll('a,img')].map(e => e.href || e.src).filter(Boolean))],
    buttons: [...d.querySelectorAll('button')].map(b => b.innerText.trim()).filter(Boolean) }; }));
  await page.screenshot({ path: outFile.replace('.json', '-card.png'), fullPage: false });
  // rejects list (read-only)
  const rb = await page.evaluate(() => { const b=[...document.querySelectorAll('[role=dialog] button')].find(x=>/דחיות QA/.test(x.innerText)); if(b){b.click(); return b.innerText;} return null; });
  res.rejectsButton = rb;
  if (rb) { await page.waitForTimeout(2500); res.rejectsText = await page.evaluate(() => [...document.querySelectorAll('[role=dialog]')].map(d=>d.innerText).join('\n=====\n')); await page.screenshot({ path: outFile.replace('.json', '-rejects.png') }); }
  // close without changes
  res.closed = await page.evaluate(() => { const bs=[...document.querySelectorAll('[role=dialog] button')].filter(x=>x.innerText.trim()==='ביטול'); bs.forEach(b=>b.click()); return bs.length; });
}
fs.writeFileSync(outFile, JSON.stringify(res, null, 1));
await browser.close();
console.log(JSON.stringify({ loggedIn: res.loggedIn, found: res.found, column: res.column, rejects: res.rejectsButton, closed: res.closed }));

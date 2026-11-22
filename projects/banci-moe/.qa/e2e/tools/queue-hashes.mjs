// Read-only: open each ticket of queue json, read #hash, type, status, reject count; close with ביטול.
import { chromium } from '@playwright/test';
import fs from 'node:fs';
const [,, inFile, outFile] = process.argv;
const q = JSON.parse(fs.readFileSync(inFile, 'utf8'));
const b = await chromium.launch({ headless: true });
const c = await b.newContext({ storageState: '/Users/avielshnaider/banci-moe/.qa/auth/mifrat.json', viewport: { width: 1400, height: 900 }, locale: 'he-IL' });
const p = await c.newPage();
await p.goto('https://mifrat.com/Project?id=6a9ea042a896bdb61c97c8ee&tab=tasks'); await p.waitForTimeout(8000);
const res = [];
for (const x of q) {
  let ok = false;
  for (let i = 0; i < 20 && !ok; i++) { ok = await p.evaluate(t => !![...document.querySelectorAll('h4')].find(h => h.innerText.trim() === t), x.title);
    if (!ok) { await p.evaluate(() => document.querySelectorAll('*').forEach(e => { if (e.scrollHeight > e.clientHeight + 50 && getComputedStyle(e).overflowY.match(/auto|scroll/)) e.scrollTop += 600; })); await p.waitForTimeout(500); } }
  if (!ok) { res.push({ title: x.title, err: 'not found' }); continue; }
  await p.evaluate(t => [...document.querySelectorAll('h4')].find(h => h.innerText.trim() === t).click(), x.title);
  await p.waitForTimeout(2500);
  const r = await p.evaluate(() => { const d = document.querySelector('[role=dialog]'); const t = d.innerText;
    return { hash: (t.match(/#([0-9a-f]{8})/)||[])[1], rejects: (t.match(/דחיות QA \((\d+)\)/)||[])[1]||'0', cnr: /לא ניתן לשחזר\n.*סומן|סומן כלא ניתן לשחזר|מחק סימון/.test(t), comments: (t.split('הערות')[1]||'').slice(0,400) }; });
  res.push({ title: x.title, ...r });
  await p.evaluate(() => { [...document.querySelectorAll('[role=dialog] button')].filter(b => b.innerText.trim() === 'ביטול').forEach(b => b.click()); });
  await p.keyboard.press('Escape'); await p.waitForTimeout(1200);
}
fs.writeFileSync(outFile, JSON.stringify(res, null, 1)); console.log(res.length);
await b.close();

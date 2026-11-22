// Mark ticket «לא ניתן לשחזר» with a note. Usage: mifrat-cnr.mjs <job.json> [--discover|--submit]
// job: {hash, titleFrag, note}
import { chromium } from '@playwright/test';
import fs from 'node:fs';
const [,, jobFile, flag] = process.argv; const job = JSON.parse(fs.readFileSync(jobFile, 'utf8')); const out = jobFile.replace(/\.json$/, '');
const browser = await chromium.launch({ headless: false });
const context = await browser.newContext({ storageState: '/Users/avielshnaider/banci-moe/.qa/auth/mifrat.json', viewport: { width: 1200, height: 640 }, locale: 'he-IL' });
const page = await context.newPage();
await page.goto('https://mifrat.com/Project?id=6a9ea042a896bdb61c97c8ee&tab=tasks'); await page.waitForTimeout(8000);
let found = false;
for (let i = 0; i < 25 && !found; i++) { found = await page.evaluate((f) => !![...document.querySelectorAll('h4')].find(x => x.innerText.includes(f)), job.titleFrag);
  if (!found) { await page.evaluate(() => document.querySelectorAll('*').forEach(e => { if (e.scrollHeight > e.clientHeight + 50 && getComputedStyle(e).overflowY.match(/auto|scroll/)) e.scrollTop += 1500; })); await page.waitForTimeout(800); } }
if (!found) { console.log('NOT FOUND'); await browser.close(); process.exit(1); }
await page.evaluate((f) => [...document.querySelectorAll('h4')].find(x => x.innerText.includes(f)).click(), job.titleFrag); await page.waitForTimeout(3500);
const head = await page.evaluate(() => document.querySelector('[role=dialog]').innerText.slice(0, 200));
if (!head.includes(job.hash)) { console.log('HASH MISMATCH', head.slice(0, 80)); await browser.close(); process.exit(1); }
console.log('btn:', await page.evaluate(() => { const b = [...document.querySelectorAll('[role=dialog] button')].find(x => x.innerText.trim() === 'לא ניתן לשחזר'); if (b) { b.click(); return true } return false }));
await page.waitForTimeout(2000);
const dump = await page.evaluate(() => { const d = [...document.querySelectorAll('[role=dialog]')].pop(); return { text: d.innerText.slice(0, 700), inputs: [...d.querySelectorAll('input,textarea')].map(i => i.placeholder), buttons: [...d.querySelectorAll('button')].map(b => b.innerText.trim()).filter(Boolean) }; });
if (flag === '--discover') { console.log(JSON.stringify(dump, null, 1)); await page.screenshot({ path: out + '-cnr.png' }); await browser.close(); process.exit(0); }
const ta = page.locator('[role=dialog]').last().locator('textarea').first(); await ta.fill(job.note); await page.waitForTimeout(500);
console.log('filled:', (await ta.inputValue()).slice(0, 60));
if (flag === '--submit') { const c = await page.evaluate(() => { const d = [...document.querySelectorAll('[role=dialog]')].pop(); const b = [...d.querySelectorAll('button')].filter(x => x.offsetWidth && /אישור|סמן|שמור|לא ניתן לשחזר/.test(x.innerText.trim()) && !/ביטול/.test(x.innerText)).pop(); if (b) { const t = b.innerText.trim(); b.click(); return t } return null }); console.log('confirm:', c); await page.waitForTimeout(4000);
  console.log('after:', await page.evaluate(() => [...document.querySelectorAll('[role=dialog]')].map(d => d.innerText.slice(0, 300)).join(' || '))); }
else { await page.evaluate(() => { [...document.querySelectorAll('[role=dialog]')].reverse().forEach(d => [...d.querySelectorAll('button')].filter(b => b.innerText.trim() === 'ביטול').forEach(b => b.click())); }); console.log('NOT SUBMITTED'); }
await page.waitForTimeout(1500); await browser.close();

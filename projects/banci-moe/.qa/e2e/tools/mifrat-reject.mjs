// Reject a mifrat ticket. Usage: mifrat-reject.mjs <job.json> [--submit]
// job: {hash, titleFrag, title, current, desired, steps[], urlSuffix, files[]}
// Without --submit: fills the form, dumps state + screenshot, closes with ביטול.
import { chromium } from '@playwright/test';
import fs from 'node:fs';
const [,, jobFile, flag] = process.argv; const SUBMIT = flag === '--submit';
const job = JSON.parse(fs.readFileSync(jobFile, 'utf8'));
const out = jobFile.replace(/\.json$/, '');
const browser = await chromium.launch({ headless: false });
const context = await browser.newContext({ storageState: '/Users/avielshnaider/banci-moe/.qa/auth/mifrat.json', viewport: { width: 1200, height: 640 }, locale: 'he-IL' });
const page = await context.newPage();
await page.goto('https://mifrat.com/Project?id=6a9ea042a896bdb61c97c8ee&tab=tasks');
await page.waitForTimeout(8000);
let found = false;
for (let i = 0; i < 25 && !found; i++) {
  found = await page.evaluate((f) => !![...document.querySelectorAll('h4')].find(x => x.innerText.includes(f)), job.titleFrag);
  if (!found) await page.evaluate(() => document.querySelectorAll('*').forEach(e => { if (e.scrollHeight > e.clientHeight + 50 && getComputedStyle(e).overflowY.match(/auto|scroll/)) e.scrollTop += 1500; }));
  await page.waitForTimeout(800);
}
if (!found) { console.log('NOT FOUND'); await browser.close(); process.exit(1); }
await page.evaluate((f) => [...document.querySelectorAll('h4')].find(x => x.innerText.includes(f)).click(), job.titleFrag);
await page.waitForTimeout(3500);
const head = await page.evaluate(() => document.querySelector('[role=dialog]').innerText.slice(0, 200));
if (!head.includes(job.hash)) { console.log('HASH MISMATCH', head); await browser.close(); process.exit(1); }
await page.evaluate(() => [...document.querySelectorAll('[role=dialog] button')].find(b => b.innerText.trim() === 'דחה משימה').click());
await page.waitForTimeout(2000);
const form = () => page.locator('[role=dialog]').last();
const dump = async () => page.evaluate(() => { const d = [...document.querySelectorAll('[role=dialog]')].pop(); return {
  text: d.innerText.slice(0, 1500),
  inputs: [...d.querySelectorAll('input,textarea')].map(i => ({ tag: i.tagName, type: i.type, ph: i.placeholder, v: i.value })),
  buttons: [...d.querySelectorAll('button')].map(b => b.innerText.trim()).filter(Boolean) }; });
if (flag === '--discover') { fs.writeFileSync(out + '-form.json', JSON.stringify(await dump(), null, 1)); await page.screenshot({ path: out + '-form.png' }); await browser.close(); process.exit(0); }
// fill
const setVal = async (loc, v) => { await loc.click(); await loc.fill(v); };
const f = form();
const byPh = (ph) => f.locator(`input[placeholder*="${ph}"], textarea[placeholder*="${ph}"]`).first();
const fields = job.fieldMap; // {placeholderFragment: value}
for (const [ph, v] of Object.entries(fields)) await setVal(byPh(ph), v);
// steps
for (let i = 0; i < job.steps.length; i++) {
  let stepInputs = f.locator(`input[placeholder*="${job.stepPh}"], textarea[placeholder*="${job.stepPh}"]`);
  if ((await stepInputs.count()) <= i) { await f.getByRole('button', { name: 'הוסף שלב' }).click(); await page.waitForTimeout(300); stepInputs = f.locator(`input[placeholder*="${job.stepPh}"], textarea[placeholder*="${job.stepPh}"]`); }
  await setVal(stepInputs.nth(i), job.steps[i]);
}
// files
const [chooser] = await Promise.all([page.waitForEvent('filechooser'), f.getByRole('button', { name: 'צרף קבצים' }).click()]);
await chooser.setFiles(job.files);
await page.waitForTimeout(6000);
const state = await dump();
fs.writeFileSync(out + '-filled.json', JSON.stringify(state, null, 1));
await page.screenshot({ path: out + '-filled.png', fullPage: true });
const names = job.files.map(p => p.split('/').pop());
const thumbs = await page.evaluate(() => [...document.querySelectorAll('[role=dialog]')].pop().querySelectorAll('img').length);
const filesOk = thumbs >= job.files.length;
console.log(JSON.stringify({ filesOk, thumbs, steps: state.inputs.filter(i => (i.ph||'').includes(job.stepPh)).map(i => i.v) }));
if (SUBMIT && filesOk) {
  await f.getByRole('button', { name: 'דחה משימה' }).last().click();
  await page.waitForTimeout(5000);
  console.log('SUBMITTED; dialogs:', await page.evaluate(() => [...document.querySelectorAll('[role=dialog]')].map(d => d.innerText.slice(0, 150))));
} else {
  await page.evaluate(() => { const d=[...document.querySelectorAll('[role=dialog]')]; d.reverse().forEach(x => [...x.querySelectorAll('button')].filter(b => b.innerText.trim()==='ביטול').forEach(b => b.click())); });
  console.log('NOT SUBMITTED');
}
await page.waitForTimeout(1500);
await browser.close();

// Create a new mifrat ticket. Usage: mifrat-new.mjs <job.json> [--discover|--submit]
// job: {title, type:'bug', actual, expected, steps[], files[]}
import { chromium } from '@playwright/test';
import fs from 'node:fs';
const [,, jobFile, flag] = process.argv;
const job = JSON.parse(fs.readFileSync(jobFile, 'utf8')); const out = jobFile.replace(/\.json$/, '');
const browser = await chromium.launch({ headless: false });
const context = await browser.newContext({ storageState: '/Users/avielshnaider/banci-moe/.qa/auth/mifrat.json', viewport: { width: 1200, height: 640 }, locale: 'he-IL' });
const page = await context.newPage();
await page.goto('https://mifrat.com/Project?id=6a9ea042a896bdb61c97c8ee&tab=tasks'); await page.waitForTimeout(8000);
const dump = async () => page.evaluate(() => { const d = [...document.querySelectorAll('[role=dialog]')].pop() || document.body; return {
  text: d.innerText.slice(0, 1500), inputs: [...d.querySelectorAll('input,textarea,[contenteditable=true]')].map(i => ({ tag: i.tagName, type: i.type, ph: i.placeholder || i.getAttribute('aria-label'), v: (i.value||'').slice(0,40) })),
  buttons: [...d.querySelectorAll('button,[role=button],[role=combobox]')].map(b => (b.innerText||b.getAttribute('aria-label')||'').trim()).filter(Boolean).slice(0,60) }; });
const clickText = async (re) => page.evaluate((src) => { const r = new RegExp(src); const b = [...document.querySelectorAll('button,[role=button],[role=tab],[role=option]')].filter(x => x.offsetWidth && r.test((x.innerText||x.getAttribute('aria-label')||'').trim())).pop(); if (b) { b.click(); return (b.innerText||b.getAttribute('aria-label')).trim(); } return null; }, re.source);
console.log('open:', await clickText(/^(משימה חדשה|\+)$/)); await page.waitForTimeout(2500);
if (flag === '--discover') { fs.writeFileSync(out + '-form.json', JSON.stringify(await dump(), null, 1)); await page.screenshot({ path: out + '-form.png' });
  console.log('bug:', await clickText(/דיווח על באג/)); await page.waitForTimeout(1500); fs.writeFileSync(out + '-form-bug.json', JSON.stringify(await dump(), null, 1)); await page.screenshot({ path: out + '-form-bug.png', fullPage: true }); await browser.close(); process.exit(0); }

// fill
const D = () => page.locator('[role=dialog]').last();
await clickText(/דיווח על באג/); await page.waitForTimeout(1200);
const ph = (t) => D().locator(`input[placeholder*="${t}"], textarea[placeholder*="${t}"]`).first();
await ph('מה צריך לעשות').fill(job.title);
await ph('מה קורה כרגע').fill(job.actual);
await ph('מה צריך לקרות').fill(job.expected);
for (let i = 0; i < job.steps.length; i++) { let st = D().locator('input[placeholder^="שלב "]'); if ((await st.count()) <= i) { await D().getByRole('button', { name: 'הוסף שלב' }).click(); await page.waitForTimeout(300); st = D().locator('input[placeholder^="שלב "]'); } await st.nth(i).fill(job.steps[i]); }
// status
await page.evaluate(() => { const b = [...document.querySelectorAll('[role=dialog] button,[role=dialog] [role=combobox]')].find(x => x.offsetWidth && x.innerText.trim() === 'רשימת משימות'); b && b.click(); }); await page.waitForTimeout(800);
console.log('status:', await page.evaluate(() => { const o = [...document.querySelectorAll('[role=option],[role=menuitem],li,div')].filter(x => x.offsetWidth && x.innerText && x.innerText.trim() === 'לביצוע' && !x.closest('[role=dialog] h4')).pop(); if (o) { o.click(); return true } return false }));
await page.waitForTimeout(800);
// open files section, url suffix
await page.evaluate(() => { const b = [...document.querySelectorAll('[role=dialog] button')].find(x => x.innerText.includes('קבצים וקישורים')); b && b.click(); }); await page.waitForTimeout(800);
if (job.url) { const u = D().locator('input[placeholder*="/page/section"]'); if (await u.count()) await u.first().fill(job.url); }
const [ch] = await Promise.all([page.waitForEvent('filechooser'), D().getByRole('button', { name: 'צרף קבצים' }).first().click()]);
await ch.setFiles(job.files); await page.waitForTimeout(6000);
const st = await page.evaluate(() => { const d = [...document.querySelectorAll('[role=dialog]')].pop(); return { thumbs: d.querySelectorAll('img').length, status: [...d.querySelectorAll('button,[role=combobox]')].map(b => b.innerText.trim()).filter(t => /רשימת משימות|לביצוע|בביצוע/.test(t)), steps: [...d.querySelectorAll('input[placeholder^="שלב "]')].map(i => i.value), title: d.querySelector('input[placeholder*="מה צריך לעשות"]').value }; });
console.log(JSON.stringify(st)); await page.screenshot({ path: out + '-filled.png', fullPage: true });
const ok = st.thumbs >= job.files.length && st.status.includes('לביצוע') && st.steps.length === job.steps.length;
if (flag === '--submit' && ok) { await D().getByRole('button', { name: 'צור משימה' }).click(); await page.waitForTimeout(5000); console.log('CREATED'); }
else { await page.evaluate(() => { const b = [...document.querySelectorAll('[role=dialog] button')].find(x => x.innerText.trim() === 'ביטול'); b && b.click(); }); console.log('NOT CREATED ok=' + ok); }
await page.waitForTimeout(1500); await browser.close();

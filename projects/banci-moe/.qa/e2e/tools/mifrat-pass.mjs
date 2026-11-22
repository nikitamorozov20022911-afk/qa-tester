// «עבר QA» for a ticket: marks open rejects «סמן כטופל», then «עבר QA», verifies «הושלם».
// Usage: mifrat-pass.mjs <hash> <titleFrag> [--submit]
import { chromium } from '@playwright/test';
const [,, hash, frag, flag] = process.argv;
const browser = await chromium.launch({ headless: false });
const context = await browser.newContext({ storageState: '/Users/avielshnaider/banci-moe/.qa/auth/mifrat.json', viewport: { width: 1200, height: 640 }, locale: 'he-IL' });
const page = await context.newPage(); const log = (...a) => console.log(hash, ...a);
await page.goto('https://mifrat.com/Project?id=6a9ea042a896bdb61c97c8ee&tab=tasks'); await page.waitForTimeout(8000);
let found = false;
for (let i = 0; i < 25 && !found; i++) { found = await page.evaluate((f) => !![...document.querySelectorAll('h4')].find(x => x.innerText.includes(f)), frag);
  if (!found) { await page.evaluate(() => document.querySelectorAll('*').forEach(e => { if (e.scrollHeight > e.clientHeight + 50 && getComputedStyle(e).overflowY.match(/auto|scroll/)) e.scrollTop += 1500; })); await page.waitForTimeout(800); } }
if (!found) { log('NOT FOUND'); await browser.close(); process.exit(1); }
await page.evaluate((f) => [...document.querySelectorAll('h4')].find(x => x.innerText.includes(f)).click(), frag); await page.waitForTimeout(3500);
const head = await page.evaluate(() => document.querySelector('[role=dialog]').innerText.slice(0, 300));
if (!head.includes(hash)) { log('HASH MISMATCH'); await browser.close(); process.exit(1); }
log('status before:', head.split('\n').slice(0, 6).join(' | '));
const rej = process.env.MARK_TREATED ? await page.evaluate(() => { const b = [...document.querySelectorAll('[role=dialog] button')].find(x => /דחיות QA/.test(x.innerText)); if (b) { b.click(); return b.innerText.trim(); } return null; }) : null;
log('rejects:', rej);
if (rej) { await page.waitForTimeout(2500);
  let exp=null; try { const badge = page.locator('[role=dialog]').last().getByText('נדחה', { exact: true }).first(); const box = await badge.boundingBox(); if (box) { await page.mouse.click(box.x + 350, box.y + box.height/2); exp='mouse@'+Math.round(box.x+350)+','+Math.round(box.y); } } catch(e) { exp='err '+e.message.slice(0,60); }
  log('expand:', exp); await page.waitForTimeout(2000);
  const info = await page.evaluate(() => { const t = [...document.querySelectorAll('[role=dialog]')].map(d => d.innerText).join(' || '); return { open: (t.match(/פתוח/g) || []).length, marks: [...document.querySelectorAll('[role=dialog] button')].filter(b => b.innerText.trim() === 'סמן כטופל').length }; });
  log('open rejects:', JSON.stringify(info)); log('buttons:', JSON.stringify(await page.evaluate(() => [...document.querySelectorAll('[role=dialog] button, [role=dialog] [role=button]')].filter(b=>b.offsetWidth).map(b => (b.innerText||b.getAttribute('aria-label')||b.title||'').trim()).filter(Boolean)))); await page.screenshot({path:'/Users/avielshnaider/banci-moe/.qa/research/rejects-list.png'});
  if (flag === '--submit') { for (let k = 0; k < 5; k++) { const c = await page.evaluate(() => { const b = [...document.querySelectorAll('[role=dialog] button')].find(x => x.offsetWidth && x.innerText.trim() === 'סמן כטופל'); if (b) { b.click(); return true } return false }); if (!c) break; log('marked treated'); await page.waitForTimeout(2000); } }
  await page.keyboard.press('Escape'); await page.waitForTimeout(1500);
  if (!(await page.evaluate((h) => [...document.querySelectorAll('[role=dialog]')].some(d => d.innerText.includes(h)), hash))) { await page.evaluate((f) => [...document.querySelectorAll('h4')].find(x => x.innerText.includes(f)).click(), frag); await page.waitForTimeout(3000); }
}
if (flag === '--submit') {
  const ok = await page.evaluate(() => { const b = [...document.querySelectorAll('[role=dialog] button')].find(x => x.offsetWidth && x.innerText.trim() === 'עבר QA'); if (b) { b.click(); return true } return false });
  log('pass clicked:', ok); await page.waitForTimeout(3000);
  const conf = await page.evaluate(() => { const d = [...document.querySelectorAll('[role=dialog],[role=alertdialog]')].pop(); const b = d && [...d.querySelectorAll('button')].find(x => x.offsetWidth && /^(אישור|כן|עבר QA|אשר)$/.test(x.innerText.trim())); if (b && !d.innerText.includes('תקן את המשימה')) { b.click(); return b.innerText.trim() } return null });
  if (conf) { log('confirmed:', conf); await page.waitForTimeout(3000); }
  log('status after:', await page.evaluate((h) => { const d = [...document.querySelectorAll('[role=dialog]')].find(x => x.innerText.includes(h)); return d ? d.innerText.split('\n').slice(0, 6).join(' | ') : 'dialog closed'; }, hash));
}
await page.evaluate(() => { [...document.querySelectorAll('[role=dialog] button')].filter(b => b.innerText.trim() === 'ביטול').forEach(b => b.click()); }); await page.waitForTimeout(1500);
await browser.close();

// «בדיקה יומית»: выделить карточки (Cmd+клик) → עוד → צור סיכום → «בדיקה יומית» → окно сводки остаётся открытым.
// node mifrat-daily.mjs <ids.json>   ids.json: {"ids":[data-task-id...], "titles":[часть заголовка...]}
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const { ids = [], titles = [] } = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const browser = await chromium.launch({ headless: process.env.HEADED !== '1' });
const context = await browser.newContext({ storageState: path.resolve(here, '../auth/mifrat.json'), viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
await page.goto('https://mifrat.com/Project?id=69e115aa1b31563236cf6b60&tab=tasks');
await page.waitForFunction(() => document.body.innerText.includes('בבדיקות'), null, { timeout: 60000 });
// подгрузить все колонки до конца
let prev = -1;
for (let i = 0; i < 60; i++) {
  await page.evaluate(() => document.querySelectorAll('.flex-1.overflow-auto').forEach(s => (s.scrollTop = s.scrollHeight)));
  await page.waitForTimeout(600);
  const n = await page.locator('[data-task-id]').count();
  if (n === prev && i > 5) break; prev = n;
}
await page.bringToFront(); await page.waitForTimeout(500);
for (const id of ids) { for (let k = 0; k < 15 && !(await page.locator(`[data-task-id="${id}"]`).count()); k++) { await page.evaluate(() => document.querySelectorAll('.flex-1.overflow-auto').forEach(s => (s.scrollTop = s.scrollHeight))); await page.waitForTimeout(800); } }
const targets = [...ids.map(id => page.locator(`[data-task-id="${id}"]`).first()), ...titles.map(t => page.locator('[data-task-id]').filter({ has: page.locator('h4', { hasText: t }) }).first())];
const missing = [];
for (let i = 0; i < targets.length; i++) {
  const t = targets[i];
  if (!(await t.count())) { missing.push(ids[i] || titles[i - ids.length]); continue; }
  await t.scrollIntoViewIfNeeded();
  const box = await t.boundingBox();
  await page.keyboard.down(process.env.MOD || 'Meta'); await page.mouse.click(box.x + box.width - 12, box.y + box.height - 8); await page.keyboard.up(process.env.MOD || 'Meta');
  await page.waitForTimeout(300);
  if (await page.locator('[role=dialog]').count()) { console.log('dialog opened on', ids[i] || titles[i - ids.length]); await browser.close(); process.exit(1); }
}
const counter = (await page.locator('body').innerText()).match(/(\d+) נבחרו/);
console.log(JSON.stringify({ missing, selected: counter && counter[1] }));
if (!counter || +counter[1] !== targets.length - missing.length) { console.log('Выделено не столько, сколько нужно — стоп'); await browser.close(); process.exit(1); }
await page.getByRole('button', { name: 'עוד' }).last().click();
await page.getByText('צור סיכום', { exact: true }).click();
await page.getByPlaceholder(/לדוגמה: תיצור סיכום שבועי/).fill('בדיקה יומית');
await page.getByRole('button', { name: 'שלח ליצירת סיכום' }).click();
await page.getByText('סיכום משימות').first().waitFor({ timeout: 90000 }).catch(() => {});
await page.waitForTimeout(25000);
const out = path.resolve(here, '../screenshots/daily-summary-' + new Date().toISOString().slice(0,10));
const dlg = page.locator('[role=dialog]').filter({ hasText: 'סיכום משימות' }).last();
await dlg.screenshot({ path: out + '.png' }).catch(async () => { await page.screenshot({ path: out + '.png', fullPage: true }); });
fs.writeFileSync(out + '.txt', await dlg.innerText().catch(() => page.locator('body').innerText()));
console.log('Сводка: ' + out + '.png / .txt');
await browser.close();

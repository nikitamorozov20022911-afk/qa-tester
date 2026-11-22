// Отправка реджектов в mifrat с вложениями (сессия .qa/auth/mifrat.json из mifrat-login.mjs).
// node mifrat-reject.mjs <jobs.json>   jobs: [{id,title,current,desired,steps[],urlSuffix,link,files[]}]
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const jobs = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const board = 'https://mifrat.com/Project?id=6a38157f90cef5c5eb408c58&tab=tasks';
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ storageState: path.resolve(here, '../auth/mifrat.json'), viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
await page.goto(board);
await page.waitForFunction(() => document.body.innerText.includes('בבדיקות'), null, { timeout: 60000 });

for (const j of jobs) {
  const card = page.locator(`[data-task-id^="${j.id}"] h4`).first();
  // колонка подгружается при прокрутке
  for (let i = 0; i < 30 && !(await card.count()); i++) {
    await page.evaluate(() => document.querySelectorAll('.flex-1.overflow-auto').forEach(s => (s.scrollTop = s.scrollHeight)));
    await page.waitForTimeout(700);
  }
  await card.scrollIntoViewIfNeeded(); await card.click();
  const dlg = page.locator('[role=dialog]').filter({ hasText: j.id }).first();
  await dlg.waitFor({ timeout: 15000 });
  if (!(await dlg.innerText()).includes(j.id)) throw new Error('wrong card ' + j.id);
  await dlg.getByRole('button', { name: 'דחה משימה', exact: true }).click();
  const f = page.locator('[role=dialog]').filter({ hasText: 'דחיית משימה - QA' }).last();
  await f.waitFor();
  await f.getByPlaceholder('למשל: הכפתור לא מגיב ללחיצה...').fill(j.title);
  await f.getByPlaceholder('תאר מה קורה כרגע...').fill(j.current);
  await f.getByPlaceholder('תאר מה צריך לקרות...').fill(j.desired);
  for (let i = 1; i < j.steps.length; i++) await f.getByRole('button', { name: 'הוסף שלב' }).click();
  const stepInputs = f.locator('input[placeholder^="שלב"]');
  for (let i = 0; i < j.steps.length; i++) await stepInputs.nth(i).fill(j.steps[i]);
  if (j.urlSuffix) await f.getByPlaceholder('/page/section...').fill(j.urlSuffix);
  if (j.link) await f.getByPlaceholder('https://...').fill(j.link);
  if (j.files?.length) {
    await f.locator('input[type=file]').first().setInputFiles(j.files);
    await page.waitForTimeout(1500 + 800 * j.files.length);
  }
  const imgs = await f.locator('img').count();
  await f.getByRole('button', { name: 'דחה משימה', exact: true }).last().click();
  await page.waitForTimeout(3000);
  const status = ((await dlg.innerText()).match(/סטטוס\n([^\n]+)/) || [])[1];
  console.log(JSON.stringify({ id: j.id, attached: imgs, status }));
  await dlg.getByRole('button', { name: 'ביטול', exact: true }).click().catch(() => {});
  await page.waitForTimeout(1200);
}
await browser.close();

// Создание новых тикетов в mifrat со вложениями (сессия .qa/auth/mifrat.json из mifrat-login.mjs).
// node mifrat-create.mjs <jobs.json>  jobs: [{title, bug:true|false, current, desired, steps[], description, urlSuffix, priority:'נמוכה'|'בינונית'|'גבוהה', files[]}]
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

async function pick(dlg, current, value) {
  if (current === value) return;
  await dlg.getByRole('combobox').filter({ hasText: current }).first().click();
  await page.getByRole('option', { name: value, exact: true }).click();
}

for (const j of jobs) {
  await page.getByRole('button', { name: 'משימה חדשה' }).click();
  const dlg = page.locator('[role=dialog]').filter({ hasText: 'משימה חדשה' }).last();
  await dlg.waitFor();
  await dlg.getByPlaceholder('מה צריך לעשות?').fill(j.title);
  if (j.bug) {
    await dlg.getByRole('button', { name: 'דיווח על באג' }).click();
    await dlg.getByPlaceholder('מה קורה כרגע?').fill(j.current);
    await dlg.getByPlaceholder('מה צריך לקרות?').fill(j.desired);
    for (let i = 1; i < j.steps.length; i++) await dlg.getByRole('button', { name: 'הוסף שלב' }).click();
    const st = dlg.locator('input[placeholder^="שלב"]');
    for (let i = 0; i < j.steps.length; i++) await st.nth(i).fill(j.steps[i]);
  } else {
    await dlg.getByPlaceholder('הוסיפו תיאור, הקשר או פרטים שיעזרו לצוות...').fill(j.description);
    await pick(dlg, 'משימה רגילה', 'משימה רגילה');
  }
  await pick(dlg, 'רשימת משימות', 'לביצוע');
  await pick(dlg, 'בינונית', j.priority || 'בינונית');
  if (j.urlSuffix) {
    const u = dlg.getByPlaceholder('/page/section...');
    if (!(await u.isVisible().catch(() => false))) await dlg.getByRole('button', { name: /פרטי המשימה/ }).click().catch(() => {});
    if (await u.isVisible().catch(() => false)) await u.fill(j.urlSuffix);
  }
  if (j.files?.length) {
    await dlg.getByRole('button', { name: /קבצים וקישורים/ }).click().catch(() => {});
    await dlg.locator('input[type=file]').first().setInputFiles(j.files);
    await page.waitForTimeout(2000 + 1500 * j.files.length);
  }
  const shot = path.resolve(here, `../screenshots/2026-10-04/mifrat-create-${jobs.indexOf(j)}.png`);
  await page.screenshot({ path: shot, fullPage: false });
  const imgs = await dlg.locator('img').count();
  await dlg.getByRole('button', { name: 'צור משימה' }).click();
  await page.waitForTimeout(4000);
  const created = await page.locator('h4', { hasText: j.title.slice(0, 40) }).count();
  console.log(JSON.stringify({ title: j.title.slice(0, 50), imgsInForm: imgs, cardsWithTitle: created, formStillOpen: await dlg.isVisible().catch(() => false) }));
  if (await dlg.isVisible().catch(() => false)) { console.log('STOP: форма не закрылась'); break; }
}
await browser.close();

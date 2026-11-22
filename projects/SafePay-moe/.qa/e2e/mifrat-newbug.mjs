// Новые баги в mifrat (статус לביצוע) с вложениями. Сессия .qa/auth/mifrat.json.
// node mifrat-newbug.mjs <bugs.json>  bugs: [{title,actual,expected,steps[],urlSuffix,link,priority?,files[]}]
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const bugs = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ storageState: path.resolve(here, '../auth/mifrat.json'), viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
await page.goto('https://mifrat.com/Project?id=69e115aa1b31563236cf6b60&tab=tasks');
await page.waitForFunction(() => document.body.innerText.includes('בבדיקות'), null, { timeout: 60000 });
const pick = async (f, current, option) => {
  await f.locator('button,[role=combobox]').filter({ hasText: new RegExp('^' + current + '$') }).first().click();
  await page.waitForTimeout(500);
  await page.locator('[role=option],[role=menuitem],[role=menuitemradio],[cmdk-item]').filter({ hasText: option }).first().click()
    .catch(async () => { await page.getByText(option, { exact: true }).last().click(); });
  await page.waitForTimeout(400);
};
for (const bug of bugs) {
  await page.getByRole('button', { name: /משימה חדשה/ }).first().click();
  await page.waitForTimeout(1200);
  const f = page.locator('[role=dialog]').filter({ hasText: 'משימה חדשה' }).last();
  await f.getByRole('button', { name: 'דיווח על באג' }).click();
  await f.getByPlaceholder('מה צריך לעשות?').fill(bug.title);
  await f.getByPlaceholder('מה קורה כרגע?').fill(bug.actual);
  await f.getByPlaceholder('מה צריך לקרות?').fill(bug.expected);
  for (let i = 1; i < bug.steps.length; i++) await f.getByRole('button', { name: 'הוסף שלב' }).click();
  const st = f.locator('input[placeholder^="שלב"]');
  for (let i = 0; i < bug.steps.length; i++) await st.nth(i).fill(bug.steps[i]);
  await pick(f, 'רשימת משימות', 'לביצוע');
  if (bug.priority && bug.priority !== 'בינונית') await pick(f, 'בינונית', bug.priority);
  if (bug.urlSuffix || bug.link || bug.files?.length) {
    await f.getByRole('button', { name: /קבצים וקישורים/ }).click().catch(() => {});
    await page.waitForTimeout(500);
    if (bug.urlSuffix) await f.getByPlaceholder('/page/section...').fill(bug.urlSuffix).catch(() => {});
    if (bug.link) await f.getByPlaceholder('https://...').fill(bug.link).catch(() => {});
    if (bug.files?.length) { await f.locator('input[type=file]').first().setInputFiles(bug.files); await page.waitForTimeout(1500 + 800 * bug.files.length); }
  }
  const status = await f.locator('button,[role=combobox]').filter({ hasText: /^(לביצוע|רשימת משימות)$/ }).first().innerText();
  const imgs = await f.locator('img').count();
  await f.getByRole('button', { name: 'צור משימה', exact: true }).click();
  await page.waitForTimeout(3500);
  const found = await page.locator('h4').filter({ hasText: bug.title.slice(0, 40) }).count();
  console.log(JSON.stringify({ title: bug.title.slice(0, 50), statusSet: status, attached: imgs, onBoard: found }));
}
await browser.close();

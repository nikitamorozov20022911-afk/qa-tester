// «עבר QA» для ОДНОГО тикета (сессия .qa/auth/mifrat.json из mifrat-login.mjs).
// node mifrat-pass.mjs <data-task-id> [--dry]
// Проверяет #hash в карточке, отмечает открытые реджекты «סמן כטופל», жмёт «עבר QA», печатает статус до/после.
import { chromium } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const id = process.argv[2];
const dry = process.argv.includes('--dry');
if (!/^[0-9a-f]{24}$/.test(id || '')) throw new Error('нужен полный data-task-id');
const hash = '#' + id.slice(0, 8);
const board = 'https://mifrat.com/Project?id=6a38157f90cef5c5eb408c58&tab=tasks';
const browser = await chromium.launch({ headless: false });
const context = await browser.newContext({ storageState: path.resolve(here, '../auth/mifrat.json'), viewport: { width: 1200, height: 640 } });
const page = await context.newPage();
await page.goto(board);
await page.waitForFunction(() => document.body.innerText.includes('בבדיקות'), null, { timeout: 60000 });

const openCard = async () => {
  const card = page.locator(`[data-task-id="${id}"] h4`).first();
  for (let i = 0; i < 30 && !(await card.count()); i++) {
    await page.evaluate(() => document.querySelectorAll('.flex-1.overflow-auto').forEach(s => (s.scrollTop = s.scrollHeight)));
    await page.waitForTimeout(700);
  }
  await card.scrollIntoViewIfNeeded(); await card.click();
  const dlg = page.locator('[role=dialog]').filter({ hasText: hash }).first();
  await dlg.waitFor({ timeout: 15000 });
  const head = (await dlg.innerText()).slice(0, 200);
  if (!head.includes(hash)) throw new Error('не та карточка: ' + head);
  return dlg;
};
const statusOf = async dlg => ((await dlg.innerText()).match(/\n(בבדיקות|הושלם|לביצוע|בביצוע)\n/) || [])[1];

const dlg = await openCard();
const out = { id, hash, title: (await dlg.innerText()).split('\n')[0], before: await statusOf(dlg), resolved: 0 };

const rejBtn = dlg.getByRole('button', { name: /דחיות QA/ });
if (await rejBtn.count()) {
  await rejBtn.first().click();
  const list = page.locator('[role=dialog]').filter({ hasText: 'דחיות QA' }).last();
  await list.waitFor();
  await page.waitForTimeout(1200);
  out.rejectsText = (await list.innerText()).slice(0, 600);
  const marks = list.getByRole('button', { name: 'סמן כטופל' });
  out.openRejects = await marks.count();
  if (!dry) {
    while (await marks.count()) {
      const n = await marks.count();
      await marks.first().click();
      await page.waitForTimeout(1500);
      if ((await marks.count()) >= n) throw new Error('«סמן כטופל» не сработал');
      out.resolved++;
    }
  }
  await page.keyboard.press('Escape');
  await page.waitForTimeout(1000);
}

if (!dry) {
  const d2 = page.locator('[role=dialog]').filter({ hasText: hash }).first();
  if (!(await d2.innerText()).slice(0, 200).includes(hash)) throw new Error('карточка сменилась перед עבר QA');
  await d2.getByRole('button', { name: 'עבר QA', exact: true }).click();
  await page.waitForTimeout(2500);
  const confirm = page.locator('[role=alertdialog], [role=dialog]').filter({ hasText: /עבר QA/ }).filter({ hasNotText: hash }).last();
  if (await confirm.count()) { out.confirm = (await confirm.innerText()).slice(0, 200); }
  out.after = await statusOf(d2).catch(() => 'closed');
}
out.buttons = (await page.locator('[role=dialog]').last().getByRole('button').allInnerTexts()).filter(t => /QA|טופל|אישור|ביטול/.test(t));
await page.screenshot({ path: path.resolve(here, `../screenshots/2026-10-05/board-${id.slice(0, 8)}-${dry ? 'dry' : 'pass'}.png`) });
console.log(JSON.stringify(out, null, 1));
await browser.close();

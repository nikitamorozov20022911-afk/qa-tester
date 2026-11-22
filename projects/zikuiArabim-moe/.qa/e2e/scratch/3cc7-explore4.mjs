import { open, warm, BASE, SHOTS } from './3cc7-lib.mjs';
const s = await open({});
const { page } = s;
try {
  await warm(page);
  await page.goto(BASE + '/profile');
  await page.getByText('מיקום', { exact: true }).click();
  const inp = page.getByLabel('שם המיקום');
  await inp.fill('');
  await inp.pressSequentially('New York', { delay: 60 });
  await page.waitForTimeout(3000);
  const opts = await page.locator('[role=option],[role=button],[role=menuitem]').evaluateAll(a => a.map(b => (b.getAttribute('aria-label') || b.innerText).slice(0, 80)));
  console.log(JSON.stringify(opts.slice(-20)));
  await page.screenshot({ path: SHOTS + '3cc7-explore-loc2.png' });
  await page.getByRole('button', { name: 'סגירה' }).click();
  await page.waitForTimeout(1000);
  await page.reload(); await page.waitForTimeout(3000);
  console.log((await page.getByRole('button', { name: /^מיקום:/ }).getAttribute('aria-label')));
} finally { console.log('save', await s.close()); }
